// Build estático do tbhbau (zero deps): node build.mjs [--offline]
// Lê o snapshot do mercado (API ao vivo → public/data/snapshot.json → seed) e o resumo do histórico (API),
// e gera dist/ em DOIS idiomas (PT em / e EN em /en/) com: home, mercado, itens, uma página por item e por tipo,
// avaliador, guias, boletim, páginas institucionais, sitemap, robots, redirects e assets. O Cloudflare Pages roda isso no deploy.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { API_BASE, SITE, slugify, parseItem, dedupeItems, pct } from './build/lib.mjs';
import { LANGS, ROUTES, mk } from './build/i18n.mjs';

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
const raw = dedupeItems(snap.items).filter(x => x.hash && x.name && x.hasMarketListing !== false);
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
log(`itens: ${items.length} (dedup de ${snap.items.length}), indexáveis ${items.filter(x => x.indexable).length}, com anúncio ${items.filter(x => x.ad).length}`);

const types = new Map();
for (const it of items) { if (!types.has(it.typeBase)) types.set(it.typeBase, []); types.get(it.typeBase).push(it); }
for (const list of types.values()) list.sort((a, b) => (b.lowestBrl ?? -1) - (a.lowestBrl ?? -1));
const byFamily = new Map();
for (const it of items) { if (!byFamily.has(it.family)) byFamily.set(it.family, []); byFamily.get(it.family).push(it); }

// ── conteúdo por idioma (guias pareados por id; páginas por key) ──
const loadDir = async dir => { const out = []; if (!fs.existsSync(dir)) return out; for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.mjs')).sort()) out.push((await import(pathToFileURL(path.join(dir, f)).href)).default); return out; };
const GUIA_ORDER = ['como-vender', 'anuncio-vs-venda-imediata', 'grades-raridades'];
const PAGE_KEY = { sobre: 'about', contato: 'contact', termos: 'terms', privacidade: 'privacy' };
const content = {};
for (const L of LANGS) {
  const base = L === 'pt' ? path.join(SRC, 'content') : path.join(SRC, 'content', 'en');
  const guias = (await loadDir(path.join(base, 'guias'))).map(g => ({ ...g, id: g.id || g.slug }))
    .sort((a, b) => (GUIA_ORDER.indexOf(a.id) + 1 || 99) - (GUIA_ORDER.indexOf(b.id) + 1 || 99));
  const paginas = ((await import(pathToFileURL(path.join(base, 'paginas', 'index.mjs')).href)).default).map(p => ({ ...p, key: p.key || PAGE_KEY[p.slug] }));
  content[L] = { guias, paginas };
}
const guideUrlIn = (L, id) => { const g = content[L].guias.find(x => x.id === id); return g ? `${ROUTES[L].guides}${g.slug}/` : null; };

function makeCtx(L) {
  const i = mk(L), other = L === 'pt' ? 'en' : 'pt';
  return {
    L, i, items, types, byFamily, updatedAt, now: Date.now(), histCount: hist ? hist.count : 0,
    vk: L === 'en' ? 'usdCents' : 'lowestBrl', // chave de "valor" p/ ranquear: EN mostra US$, PT mostra R$
    guias: content[L].guias, paginas: content[L].paginas,
    altRoute: k => ROUTES[other][k],
    typeSlug: t => slugify(t), typeUrl: t => `${ROUTES[L].type}${slugify(t)}/`, typeAltUrl: t => `${ROUTES[other].type}${slugify(t)}/`,
    itemUrl: it => `${ROUTES[L].item}${it.slug}/`, itemAltUrl: it => `${ROUTES[other].item}${it.slug}/`,
    guideUrl: id => guideUrlIn(L, id), guideAltUrl: id => guideUrlIn(other, id),
  };
}

// ── 3. dist: limpa e copia assets ──
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'data'), { recursive: true });
const copy = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); };
for (const f of ['tbh-save.js', 'pix-qr.svg', 'ads.txt']) if (fs.existsSync(path.join(PUB, f))) copy(path.join(PUB, f), path.join(DIST, f));
for (const f of ['snapshot.seed.json', 'tbh-itemtable.json', 'tbh-itemnames.json']) copy(path.join(PUB, 'data', f), path.join(DIST, 'data', f));
for (const f of ['site.css', 'common.js', 'avaliador.js']) copy(path.join(SRC, f), path.join(DIST, 'assets', f));
fs.writeFileSync(path.join(DIST, 'data', 'items-index.json'), JSON.stringify(Object.fromEntries(items.map(x => [x.hash, x.slug]))));
// favicon: aba vinho chanfrada com "B" em blocos (pixel), como a marca na barra
fs.writeFileSync(path.join(DIST, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path d="M2 0h12l2 2v12l-2 2H2l-2-2V2z" fill="#7a1d1d"/><path d="M2 0h12l2 2v1H0V2z" fill="#a33232"/><path d="M0 13h16v1l-2 2H2l-2-2z" fill="#4a0f0f"/><path fill="#f0c452" d="M5 3h5v1h1v1h1v2h-1v1h1v3h-1v1h-1v1H5zM7 5v2h3V5zm0 4v2h3V9z"/></svg>`);
fs.writeFileSync(path.join(DIST, '_redirects'), [
  '/index.html / 301', '/guias.html /guias/ 301', '/privacidade.html /privacidade/ 301',
  '/guia-como-vender /guias/como-vender/ 301', '/guia-como-vender.html /guias/como-vender/ 301',
  '/guia-anuncio-vs-venda-imediata /guias/anuncio-vs-venda-imediata/ 301', '/guia-anuncio-vs-venda-imediata.html /guias/anuncio-vs-venda-imediata/ 301',
  '/guia-grades-raridades /guias/grades-raridades/ 301', '/guia-grades-raridades.html /guias/grades-raridades/ 301', ''].join('\n'));
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

// ── 4. páginas (PT e EN) ──
const gens = ['home', 'avaliador', 'mercado', 'itens', 'item', 'boletim', 'guias', 'paginas'];
const mods = {};
for (const g of gens) mods[g] = await import(pathToFileURL(path.join(ROOT, 'build', 'pages', `${g}.mjs`)).href);
const urls = [];
let count = 0;
for (const L of LANGS) {
  const ctx = makeCtx(L);
  const per = [];
  for (const g of gens) {
    const pages = mods[g].render(ctx);
    for (const p of pages) {
      const f = path.join(DIST, p.path);
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, p.html);
      count++;
      if (p.sitemap) urls.push({ loc: SITE + '/' + p.path.replace(/index\.html$/, ''), ...p.sitemap });
    }
    per.push(`${g} ${pages.length}`);
  }
  log(`${L}: ${per.join(', ')}`);
}
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority.toFixed(1)}</priority></url>`).join('\n')}\n</urlset>\n`);
log(`${count} páginas, ${urls.length} no sitemap, ${((Date.now() - t0) / 1000).toFixed(1)}s → dist/`);
