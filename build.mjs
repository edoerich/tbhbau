// Build estático do tbhbau (zero deps): node build.mjs [--offline]
// Lê o snapshot do mercado (API ao vivo → public/data/snapshot.json → seed) e o resumo do histórico (API),
// e gera dist/ com: home, mercado, itens, uma página por item e por tipo, avaliador, guias, boletim,
// páginas institucionais, sitemap, robots, redirects e assets. O Cloudflare Pages roda isso a cada deploy.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { API_BASE, SITE, slugify, parseItem, dedupeItems, pct } from './build/lib.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.join(ROOT, 'public'), SRC = path.join(ROOT, 'src'), DIST = path.join(ROOT, 'dist');
const OFFLINE = process.argv.includes('--offline');
const log = (...a) => console.log('[build]', ...a);
const t0 = Date.now();

async function fetchJson(url, ms) {
  const ac = new AbortController(); const timer = setTimeout(() => ac.abort(), ms);
  try { const r = await fetch(url, { signal: ac.signal, headers: { 'Accept': 'application/json' } }); if (!r.ok) throw new Error('HTTP ' + r.status); return await r.json(); }
  finally { clearTimeout(timer); }
}
const readJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };

// ── 1. dados ──
let snap = null, snapSrc = '';
if (!OFFLINE) { try { snap = await fetchJson(`${API_BASE}/data/snapshot.json`, 30000); snapSrc = 'api'; } catch (e) { log('snapshot da API indisponível:', e.message); } }
if (!snap) { snap = readJson(path.join(PUB, 'data', 'snapshot.json')); snapSrc = 'public/data/snapshot.json'; }
if (!snap) { snap = readJson(path.join(PUB, 'data', 'snapshot.seed.json')); snapSrc = 'seed'; }
if (!snap) throw new Error('sem snapshot');
const updatedAt = snap.updatedAt || snap.fetchedAt || Date.now();
log(`snapshot: ${snapSrc}, ${snap.items.length} entradas, atualizado ${new Date(updatedAt).toISOString()}`);

let hist = null;
if (!OFFLINE) { try { hist = await fetchJson(`${API_BASE}/api/history-summary`, 90000); log(`histórico: ${hist.count} itens`); } catch (e) { log('histórico indisponível:', e.message); } }
const H = (hist && hist.items) || {};

// ── 2. itens enriquecidos ──
const raw = dedupeItems(snap.items).filter(i => i.hash && i.name && i.hasMarketListing !== false);
const used = new Set();
const items = raw.map(parseItem).map(it => {
  let slug = slugify(it.hash), n = 2; while (used.has(slug)) slug = `${slugify(it.hash)}-${n++}`; used.add(slug);
  const h = H[it.hash] || null;
  const d7 = h && h.s7 ? pct(it.lowestBrl, h.s7.ask0) : null;
  const d30 = h && h.s30 ? pct(it.lowestBrl, h.s30.ask0) : null;
  const active = it.vol > 0 || (it.buyCount || 0) > 0;
  const indexable = active || (h && h.n >= 20);
  const ad = indexable && h && h.n >= 10;
  return { ...it, slug, h, d7, d30, indexable, ad };
});
log(`itens: ${items.length} (dedup de ${snap.items.length}), indexáveis ${items.filter(i => i.indexable).length}, com anúncio ${items.filter(i => i.ad).length}`);

const types = new Map();
for (const it of items) { if (!types.has(it.typeBase)) types.set(it.typeBase, []); types.get(it.typeBase).push(it); }
for (const list of types.values()) list.sort((a, b) => (b.lowestBrl ?? -1) - (a.lowestBrl ?? -1));
const byFamily = new Map();
for (const it of items) { if (!byFamily.has(it.family)) byFamily.set(it.family, []); byFamily.get(it.family).push(it); }

const loadDir = async dir => { const out = []; for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.mjs')).sort()) out.push((await import(pathToFileURL(path.join(dir, f)).href)).default); return out; };
const GUIA_ORDER = ['como-vender', 'anuncio-vs-venda-imediata', 'grades-raridades'];
const guias = (await loadDir(path.join(SRC, 'content', 'guias'))).sort((a, b) => (GUIA_ORDER.indexOf(a.slug) + 1 || 99) - (GUIA_ORDER.indexOf(b.slug) + 1 || 99));
const paginas = (await import(pathToFileURL(path.join(SRC, 'content', 'paginas', 'index.mjs')).href)).default;

const ctx = {
  items, types, byFamily, guias, paginas, updatedAt, now: Date.now(), histCount: hist ? hist.count : 0,
  typeSlug: t => slugify(t), typeUrl: t => `/tipo/${slugify(t)}/`, itemUrl: it => `/item/${it.slug}/`,
};

// ── 3. dist: limpa e copia assets ──
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'data'), { recursive: true });
const copy = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); };
for (const f of ['tbh-save.js', 'pix-qr.svg', 'ads.txt']) if (fs.existsSync(path.join(PUB, f))) copy(path.join(PUB, f), path.join(DIST, f));
for (const f of ['snapshot.seed.json', 'tbh-itemtable.json', 'tbh-itemnames.json']) copy(path.join(PUB, 'data', f), path.join(DIST, 'data', f));
for (const f of ['site.css', 'common.js', 'avaliador.js']) copy(path.join(SRC, f), path.join(DIST, 'assets', f));
fs.writeFileSync(path.join(DIST, 'data', 'items-index.json'), JSON.stringify(Object.fromEntries(items.map(i => [i.hash, i.slug]))));
fs.writeFileSync(path.join(DIST, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#66c0f4"/><stop offset="1" stop-color="#8be3ff"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><text x="32" y="44" font-family="system-ui,Segoe UI,Roboto,sans-serif" font-size="36" font-weight="900" text-anchor="middle" fill="#06121c">B</text></svg>`);
fs.writeFileSync(path.join(DIST, '_redirects'), [
  '/index.html / 301', '/guias.html /guias/ 301', '/privacidade.html /privacidade/ 301',
  '/guia-como-vender /guias/como-vender/ 301', '/guia-como-vender.html /guias/como-vender/ 301',
  '/guia-anuncio-vs-venda-imediata /guias/anuncio-vs-venda-imediata/ 301', '/guia-anuncio-vs-venda-imediata.html /guias/anuncio-vs-venda-imediata/ 301',
  '/guia-grades-raridades /guias/grades-raridades/ 301', '/guia-grades-raridades.html /guias/grades-raridades/ 301', ''].join('\n'));
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

// ── 4. páginas ──
const gens = ['home', 'avaliador', 'mercado', 'itens', 'item', 'boletim', 'guias', 'paginas'];
const urls = [];
let count = 0;
for (const g of gens) {
  const mod = await import(pathToFileURL(path.join(ROOT, 'build', 'pages', `${g}.mjs`)).href);
  const pages = mod.render(ctx);
  for (const p of pages) {
    const f = path.join(DIST, p.path);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, p.html);
    count++;
    if (p.sitemap) urls.push({ loc: SITE + '/' + p.path.replace(/index\.html$/, ''), ...p.sitemap });
  }
  log(`${g}: ${pages.length} página(s)`);
}
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority.toFixed(1)}</priority></url>`).join('\n')}\n</urlset>\n`);
log(`${count} páginas, ${urls.length} no sitemap, ${((Date.now() - t0) / 1000).toFixed(1)}s → dist/`);
