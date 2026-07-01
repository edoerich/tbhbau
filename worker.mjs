// worker.mjs — mantém data/snapshot.json fresco pra TODOS os usuários (dado é global; só o save é pessoal).
// Por item: usdCents/brlCents (anúncio), buyCents (venda imediata = maior ordem de compra), buyCount (liquidez), minSellCents.
// Roda em loop na VM (pm2/systemd). Rotação gentil pra respeitar o rate-limit da Steam.
// Zero deps (Node 20+).  Uso:  node worker.mjs   |   LIMIT=8 node worker.mjs (teste)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(ROOT, 'public', 'data'); // o site (public/) lê este snapshot
const SNAP = path.join(DATA, 'snapshot.json');
const HISTDIR = path.join(DATA, 'history');     // série temporal por item (para o gráfico)
const HIST_MAX = 1500;                          // ~1 mês a 1 ponto/30min
const HIST_MIN_GAP_MS = 20 * 60 * 1000;         // não grava pontos mais densos que 20 min
const APPID = 3678970;
const UA = 'giba-steam-market/1.0 (uso pessoal read-only)';
const LIMIT = Number(process.env.LIMIT || 0);             // >0 = processa só N itens (teste)
const OB_DELAY = Number(process.env.OB_DELAY || 900);     // ms entre orderbooks
const BRL_DELAY = Number(process.env.BRL_DELAY || 1500);  // ms entre priceoverview BRL
const LISTINGS_EVERY_MS = 20 * 60 * 1000;                 // re-busca a lista USD a cada 20min
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = m => console.log(`[${new Date().toISOString()}] ${m}`);
const brlToCents = s => { const m = String(s || '').match(/[\d.,]+/); if (!m) return null; const v = parseFloat(m[0].replace(/\./g, '').replace(',', '.')); return Number.isFinite(v) ? Math.round(v * 100) : null; };

// ── Histórico: grava [timestamp, menorVenda, vendaImediata, volume] por item ──
const safeName = h => Buffer.from(h).toString('base64url');
const volNum = v => { const n = parseInt(String(v || '').replace(/[^\d]/g, ''), 10); return Number.isFinite(n) ? n : null; };
function recordHistory(it) {
  if (it.brlCents == null && it.buyCents == null) return; // nada pra registrar ainda
  const f = path.join(HISTDIR, safeName(it.hash) + '.json');
  let arr = [];
  try { arr = JSON.parse(fs.readFileSync(f, 'utf8')); } catch {}
  const now = Date.now();
  if (arr.length && (now - arr[arr.length - 1][0]) < HIST_MIN_GAP_MS) return; // ponto recente demais
  arr.push([now, it.brlCents ?? null, it.buyCents ?? null, volNum(it.volume)]);
  if (arr.length > HIST_MAX) arr = arr.slice(-HIST_MAX);
  try { const t = f + '.tmp'; fs.writeFileSync(t, JSON.stringify(arr)); fs.renameSync(t, f); } catch {}
}

async function steamJson(url, headers = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json', ...headers } });
  if (res.status === 429) throw Object.assign(new Error('429'), { code: 429 });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// catálogo + preço de ANÚNCIO em USD (search/render respeita USD; é a fonte do catálogo de hashes)
async function fetchListingsUSD() {
  const items = [];
  let start = 0, total = Infinity;
  while (start < total) {
    const url = `https://steamcommunity.com/market/search/render/?appid=${APPID}&norender=1&count=100&start=${start}&sort_column=price&sort_dir=desc&country=US&currency=1`;
    let j;
    try { j = await steamJson(url); }
    catch (e) { if (e.code === 429 && items.length) { log(`429 listagem start=${start}, parcial ${items.length}`); break; } throw e; }
    if (!j?.success) throw new Error('success=false');
    total = j.total_count ?? 0;
    for (const r of j.results || []) {
      const d = r.asset_description || {};
      items.push({ name: r.name, hash: r.hash_name, usdCents: r.sell_price, type: d.type || '', color: d.name_color || '',
        icon: d.icon_url ? `https://community.fastly.steamstatic.com/economy/image/${d.icon_url}/96fx96f` : '' });
    }
    const got = (j.results || []).length; if (!got) break;
    start += got; if (start < total) await sleep(1800);
  }
  return items;
}

const CUR_SYMBOL = { 1: '$', 7: 'R$' };
function classifyLiquidez(n) { if (!n) return 'nenhuma'; if (n > 500) return 'alta'; if (n >= 50) return 'media'; return 'baixa'; }

async function fetchOrderbook(hash) {
  const qp = encodeURIComponent(JSON.stringify([APPID, hash]));
  const j = await steamJson(`https://steamcommunity.com/market/orderbook?q=Load&qp=${qp}`,
    { Referer: `https://steamcommunity.com/market/listings/${APPID}/${encodeURIComponent(hash)}` });
  const d = (j && j.success && j.data) ? j.data : {};
  return { buyCents: d.amtMaxBuyOrder ?? null, minSellCents: d.amtMinSellOrder ?? null,
    buyCount: d.cBuyOrders || 0, currency: d.eCurrency || null, liquidez: classifyLiquidez(d.cBuyOrders || 0) };
}
async function fetchBrlListing(hash) {
  const j = await steamJson(`https://steamcommunity.com/market/priceoverview/?appid=${APPID}&currency=7&market_hash_name=${encodeURIComponent(hash)}`);
  if (!j || !j.success) return null;
  return { cents: brlToCents(j.lowest_price) ?? brlToCents(j.median_price), median: brlToCents(j.median_price), volume: j.volume || null };
}

function loadSnap() { try { return JSON.parse(fs.readFileSync(SNAP, 'utf8')); } catch { return null; } }
function saveSnap(snap) {
  snap.updatedAt = Date.now();
  const tmp = SNAP + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(snap));
  fs.renameSync(tmp, SNAP); // escrita atômica: o site nunca lê um JSON pela metade
}

async function main() {
  fs.mkdirSync(DATA, { recursive: true });
  fs.mkdirSync(HISTDIR, { recursive: true });
  let snap = loadSnap();
  if (!snap) {
    // seed a partir do market-snapshot.json existente (se houver), senão começa vazio
    try { const old = JSON.parse(fs.readFileSync(path.join(DATA, 'market-snapshot.json'), 'utf8'));
      snap = { appid: APPID, currencies: ['usd', 'brl'], symbols: { usd: '$', brl: 'R$' }, items: old.items, byHash: {} }; }
    catch { snap = { appid: APPID, currencies: ['usd', 'brl'], symbols: { usd: '$', brl: 'R$' }, items: [], byHash: {} }; }
  }
  const idx = new Map(snap.items.map(it => [it.hash, it]));
  // SKIP_LISTINGS=1: pula a busca de catálogo USD e usa o seed (pra testar a rotação rápido)
  let lastListings = process.env.SKIP_LISTINGS ? Date.now() : 0, cycle = 0;

  while (true) {
    // 1) lista USD (catálogo + anúncio USD) periodicamente
    if (Date.now() - lastListings > LISTINGS_EVERY_MS || !snap.items.length) {
      try {
        const listed = await fetchListingsUSD();
        for (const l of listed) {
          const ex = idx.get(l.hash);
          if (ex) { ex.name = l.name; ex.usdCents = l.usdCents; ex.type = l.type; ex.color = l.color; ex.icon = l.icon; }
          else { const it = { ...l, brlCents: null, buyCents: null, buyCount: null, minSellCents: null, liquidez: null }; idx.set(l.hash, it); snap.items.push(it); }
        }
        lastListings = Date.now(); saveSnap(snap);
        log(`listagem USD ok: ${listed.length} itens (catálogo ${snap.items.length})`);
      } catch (e) { log(`listagem USD falhou: ${e.message}`); }
    }

    // 2) rotação: orderbook (venda imediata/liquidez) + BRL anúncio, item a item
    const all = LIMIT ? snap.items.slice(0, LIMIT) : snap.items;
    let i = 0, obErr = 0;
    for (const it of all) {
      try { const ob = await fetchOrderbook(it.hash); Object.assign(it, ob); }
      catch (e) { obErr++; if (e.code === 429) { log('429 orderbook — pausa 30s'); await sleep(30000); } }
      await sleep(OB_DELAY);
      // BRL anúncio: 1 a cada 2 itens (priceoverview é o mais limitado)
      if (i % 2 === 0) { try { const b = await fetchBrlListing(it.hash); if (b) { if (b.cents != null) it.brlCents = b.cents; it.medianCents = b.median; it.volume = b.volume; } } catch (e) { if (e.code === 429) await sleep(20000); } await sleep(BRL_DELAY); }
      recordHistory(it); // grava um ponto na série temporal do item
      if (++i % 20 === 0) { saveSnap(snap); log(`ciclo ${cycle}: ${i}/${all.length} (orderbook err ${obErr})`); }
    }
    saveSnap(snap);
    cycle++;
    log(`ciclo ${cycle} completo: ${all.length} itens atualizados. Reiniciando rotação.`);
    if (LIMIT) { log('LIMIT setado — encerrando após 1 ciclo (modo teste).'); break; }
  }
}

main().catch(e => { console.error('worker morreu:', e); process.exit(1); });
