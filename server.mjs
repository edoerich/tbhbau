// Server do protótipo (zero deps). Serve os arquivos estáticos E faz proxy do orderbook da Steam
// (buy orders = venda imediata), que o navegador não pode chamar direto (sem CORS).
// node server.mjs → http://localhost:5270
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.join(ROOT, 'public'); // dados do worker (snapshot.json + history/) — na VM é também o que se serve
// Pasta servida como site: STATIC_DIR=dist pra ver o build local (node build.mjs); padrão public/ (VM/API)
const STATIC = path.resolve(ROOT, process.env.STATIC_DIR || 'public');
const PORT = Number(process.env.PORT || 5270);
const HOST = process.env.HOST || '127.0.0.1'; // local: só localhost; na VM use HOST=0.0.0.0
const APPID = 3678970;
const UA = 'giba-steam-market/1.0 (uso pessoal read-only)';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };

const ORDERBOOK_TTL_MS = 3 * 60 * 1000; // ordens mudam rápido
const CUR_SYMBOL = { 1: '$', 7: 'R$' };
const obCache = new Map(); // hash → { at, data }

function classifyLiquidez(buyCount) {
  if (!buyCount) return 'nenhuma';
  if (buyCount > 500) return 'alta';
  if (buyCount >= 50) return 'media';
  return 'baixa';
}

// rgCompact* = [preço, qtd, preço, qtd, ...] em centavos → [[preço, qtd], ...] (limita níveis)
function parseCompact(arr, limit = 40) {
  const out = [];
  for (let i = 0; i + 1 < (arr || []).length && out.length < limit; i += 2) out.push([arr[i], arr[i + 1]]);
  return out;
}

// Maior ordem de COMPRA (amtMaxBuyOrder) = o que você recebe vendendo na hora.
async function fetchOrderbook(hash) {
  const hit = obCache.get(hash);
  if (hit && (Date.now() - hit.at) < ORDERBOOK_TTL_MS) return { ...hit.data, cached: true };
  const qp = encodeURIComponent(JSON.stringify([APPID, hash]));
  const url = `https://steamcommunity.com/market/orderbook?q=Load&qp=${qp}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA, 'Accept': 'application/json',
      'Referer': `https://steamcommunity.com/market/listings/${APPID}/${encodeURIComponent(hash)}`,
    },
  });
  if (res.status === 429) throw Object.assign(new Error('rate-limited'), { code: 429 });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  // Steam mudou o envelope em ago/2026: {data:{success,data}} (antes era {success,data}); aceita os dois
  const env = (j && j.data && typeof j.data.success !== "undefined") ? j.data : j;
  const d = (env && env.success && env.data) ? env.data : {};
  const buyCount = d.cBuyOrders || 0;
  const data = {
    hash,
    maxBuyCents: d.amtMaxBuyOrder ?? null,   // venda imediata (você recebe isso)
    minSellCents: d.amtMinSellOrder ?? null, // anúncio de venda mais barato
    buyCount, sellCount: d.cSellOrders || 0,
    currency: d.eCurrency || null, symbol: CUR_SYMBOL[d.eCurrency] || '',
    liquidez: classifyLiquidez(buyCount),
    buyOrders: parseCompact(d.rgCompactBuyOrders),   // [[preço, qtd], ...] compras (maior→menor)
    sellOrders: parseCompact(d.rgCompactSellOrders), // vendas (menor→maior)
  };
  obCache.set(hash, { at: Date.now(), data });
  return data;
}

const sendJson = (res, code, obj) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
};

http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  // CORS: o site (tbhbau.com.br) busca o snapshot deste servidor (api.tbhbau.com.br). Leitura pública.
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  // ── API: orderbook de 1 item ──
  if (u.pathname === '/api/orderbook') {
    const hash = u.searchParams.get('hash');
    if (!hash) return sendJson(res, 400, { error: 'hash obrigatório' });
    try { return sendJson(res, 200, await fetchOrderbook(hash)); }
    catch (e) { return sendJson(res, e.code === 429 ? 429 : 500, { error: e.message, hash }); }
  }

  // ── API: detalhe do item (order book completo ao vivo) — mediana/volume vêm do snapshot ──
  if (u.pathname === '/api/item') {
    const hash = u.searchParams.get('hash');
    if (!hash) return sendJson(res, 400, { error: 'hash obrigatório' });
    try { return sendJson(res, 200, await fetchOrderbook(hash)); }
    catch (e) { return sendJson(res, e.code === 429 ? 429 : 500, { error: e.message, hash }); }
  }

  // ── API: histórico do item (série temporal gravada pelo worker) ──
  if (u.pathname === '/api/history') {
    const hash = u.searchParams.get('hash');
    if (!hash) return sendJson(res, 400, { error: 'hash obrigatório' });
    const f = path.join(PUB, 'data', 'history', Buffer.from(hash).toString('base64url') + '.json');
    return fs.readFile(f, 'utf8', (err, txt) => {
      if (err) return sendJson(res, 200, { hash, points: [] });
      try { return sendJson(res, 200, { hash, points: JSON.parse(txt) }); }
      catch { return sendJson(res, 200, { hash, points: [] }); }
    });
  }

  // ── API: resumo do histórico de TODOS os itens (usado pelo build estático) ──
  // Por hash: n pontos, primeiro/último ts, série dos últimos 30 dias reamostrada (≤60 pts) e
  // estatísticas de 7d/30d (menor venda no início da janela, mín, máx, volume médio). Cache 10 min.
  if (u.pathname === '/api/history-summary') {
    try { return sendJson(res, 200, await historySummary()); }
    catch (e) { return sendJson(res, 500, { error: e.message }); }
  }

  // ── snapshot ao vivo (dados do worker) sempre de public/, mesmo quando STATIC_DIR=dist ──
  if (u.pathname === '/data/snapshot.json' || u.pathname.startsWith('/data/history/')) {
    return serveFile(res, path.join(PUB, path.normalize(decodeURIComponent(u.pathname)).replace(/^(\.\.[/\\])+/, '')), PUB);
  }

  // ── estáticos (site) ──
  let p = decodeURIComponent(u.pathname);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(STATIC, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(STATIC)) { res.writeHead(403); return res.end('forbidden'); }
  // imita o Cloudflare Pages: /x → /x/index.html ou /x.html
  if (!path.extname(file)) { if (fs.existsSync(file + '.html')) file += '.html'; else if (fs.existsSync(path.join(file, 'index.html'))) file = path.join(file, 'index.html'); }
  serveFile(res, file, STATIC);
}).listen(PORT, HOST, () => console.log(`tbhbau server em ${HOST}:${PORT} (site: ${STATIC})`));

function serveFile(res, file, root) {
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': (TYPES[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8' });
    res.end(buf);
  });
}

let _hs = null; // { at, data }
const HS_TTL_MS = 10 * 60 * 1000;
async function historySummary() {
  if (_hs && Date.now() - _hs.at < HS_TTL_MS) return _hs.data;
  const dir = path.join(PUB, 'data', 'history');
  const items = {};
  let files = [];
  try { files = await fs.promises.readdir(dir); } catch { files = []; }
  const now = Date.now(), D7 = now - 7 * 864e5, D30 = now - 30 * 864e5;
  const stats = pts => {
    const asks = pts.map(p => p[1]).filter(v => v != null);
    const vols = pts.map(p => p[3]).filter(v => v != null);
    if (!asks.length) return null;
    return { ask0: asks[0], min: Math.min(...asks), max: Math.max(...asks),
      volAvg: vols.length ? Math.round(vols.reduce((a, b) => a + b, 0) / vols.length) : null, n: pts.length };
  };
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    let pts;
    try { pts = JSON.parse(await fs.promises.readFile(path.join(dir, f), 'utf8')); } catch { continue; }
    if (!Array.isArray(pts) || !pts.length) continue;
    const hash = Buffer.from(f.slice(0, -5), 'base64url').toString('utf8');
    const p30 = pts.filter(p => p[0] >= D30), p7 = pts.filter(p => p[0] >= D7);
    const step = Math.max(1, Math.ceil(p30.length / 60));
    const series = p30.filter((_, i) => i % step === 0 || i === p30.length - 1);
    items[hash] = { n: pts.length, first: pts[0][0], last: pts[pts.length - 1][0], series, s7: stats(p7), s30: stats(p30) };
  }
  const data = { generatedAt: now, count: Object.keys(items).length, items };
  _hs = { at: now, data };
  return data;
}
