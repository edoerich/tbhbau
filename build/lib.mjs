// Helpers do build estático (zero deps). Tudo em PT-BR.
export const SITE = 'https://tbhbau.com.br';
export const API_BASE = 'https://api.tbhbau.com.br';
export const APPID = 3678970;
export const AD_CLIENT = 'ca-pub-1603507684488543';
export const AD_SLOT = '6443249296';
export const STEAM_FEE_DIV = 1.15; // 5% Steam + 10% jogo → vendedor recebe ~87%

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function slugify(s) {
  return String(s).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item';
}

// Grades (raridades) na ordem empírica de valor (mediana de preço no mercado, set/2026)
export const RARITIES = ['Legendary', 'Immortal', 'Arcana', 'Beyond', 'Celestial', 'Divine', 'Cosmic'];
export const RARITY_PT = { Legendary: 'Lendária', Immortal: 'Imortal', Arcana: 'Arcana', Beyond: 'Beyond', Celestial: 'Celestial', Divine: 'Divina', Cosmic: 'Cósmica' };
export const RARITY_COLOR = { Legendary: 'EBBB00', Immortal: 'E8695A', Arcana: 'FB86FF', Beyond: 'FF0080', Celestial: '00F6FF', Divine: 'F6E7A2', Cosmic: 'FC00FF' };

// [singular, plural, gênero]
export const TYPE_PT = {
  Helmet: ['Elmo', 'Elmos', 'm'], Gloves: ['Luvas', 'Luvas', 'f'], Shield: ['Escudo', 'Escudos', 'm'], Armor: ['Armadura', 'Armaduras', 'f'],
  Arrow: ['Flecha', 'Flechas', 'f'], Boots: ['Botas', 'Botas', 'f'], Staff: ['Cajado', 'Cajados', 'm'], Orb: ['Orbe', 'Orbes', 'm'],
  Bracer: ['Bracelete', 'Braceletes', 'm'], Amulet: ['Amuleto', 'Amuletos', 'm'], Ring: ['Anel', 'Anéis', 'm'], Earing: ['Brinco', 'Brincos', 'm'],
  Bow: ['Arco', 'Arcos', 'm'], Bolt: ['Virote', 'Virotes', 'm'], Hatchet: ['Machadinha', 'Machadinhas', 'f'], Crossbow: ['Besta', 'Bestas', 'f'],
  Axe: ['Machado', 'Machados', 'm'], Scepter: ['Cetro', 'Cetros', 'm'], Sword: ['Espada', 'Espadas', 'f'], Tome: ['Tomo', 'Tomos', 'm'],
  'Decoration Material': ['Material de decoração', 'Materiais de decoração', 'm'],
  'Crafting Material': ['Material de criação', 'Materiais de criação', 'm'],
  'Offering Material': ['Material de oferenda', 'Materiais de oferenda', 'm'],
  'Inscription Material': ['Material de inscrição', 'Materiais de inscrição', 'm'],
  'Engraving Material': ['Material de gravação', 'Materiais de gravação', 'm'],
  Soulstone: ['Pedra da alma', 'Pedras da alma', 'f'],
};
export const typePt = (t, plural = false) => (TYPE_PT[t] || [t, t, 'm'])[plural ? 1 : 0];
export const typeGender = t => (TYPE_PT[t] || [t, t, 'm'])[2];

export const volNum = v => { const n = parseInt(String(v ?? '').replace(/[^\d]/g, ''), 10); return Number.isFinite(n) ? n : 0; };
export const netCents = c => c == null ? null : Math.round(c / STEAM_FEE_DIV);
export const fmtQty = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : String(n);
export const fmtInt = n => Number(n).toLocaleString('pt-BR');
export const fmtPct = p => (p > 0 ? '+' : '') + p.toFixed(1).replace('.', ',') + '%';
export const fmtDate = ts => new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' });
export const fmtDateLong = ts => new Date(ts).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });
export const fmtDateTime = ts => new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }) + ' (Brasília)';

const LOC = { brl: ['R$', 'pt-BR'], usd: ['$', 'en-US'] };
export function money(cents, cur = 'brl') {
  if (cents == null) return '—';
  const [sym, loc] = LOC[cur];
  return `${sym} ${(cents / 100).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
export const moneyBrl = c => money(c, 'brl');
// Span que o common.js re-formata quando o visitante troca R$/US$
export function moneySpan(brl, usd, cls = '') {
  if (brl == null && usd == null) return '<span class="money">—</span>';
  const attrs = [brl != null ? `data-brl="${brl}"` : '', usd != null ? `data-usd="${usd}"` : ''].filter(Boolean).join(' ');
  return `<span class="money ${cls}" ${attrs}>${brl != null ? moneyBrl(brl) : money(usd, 'usd')}</span>`;
}

// Enriquecimento de um item do snapshot: grade, nível, tipo base, família
export function parseItem(it) {
  const m = it.name.match(/\(([^)]+)\)/);
  const rarity = m && RARITY_PT[m[1]] ? m[1] : null;
  const lvl = Number((it.type.match(/Lv\. (\d+)/) || [])[1]) || null;
  const typeBase = it.type.replace(/\s*-\s*Lv\. \d+/, '').trim() || 'Outro';
  const isMaterial = !rarity || /Material|Soulstone/.test(typeBase);
  const family = it.name.replace(/\s*\([^)]+\)\s*[A-Z]?$/, '').trim();
  return { ...it, rarity, lvl, typeBase, isMaterial, family, vol: volNum(it.volume),
    lowestBrl: it.brlCents ?? it.minSellCents ?? null,
    spread: (it.minSellCents != null && it.buyCents != null) ? it.minSellCents - it.buyCents : null };
}

// Deduplica por hash (o worker acumulou duplicatas): fica com a entrada mais completa
export function dedupeItems(items) {
  const score = i => ['brlCents', 'buyCents', 'medianCents', 'minSellCents', 'volume'].reduce((a, k) => a + (i[k] != null ? 1 : 0), 0);
  const by = new Map();
  for (const it of items) { const ex = by.get(it.hash); if (!ex || score(it) > score(ex)) by.set(it.hash, it); }
  return [...by.values()];
}

export const steamUrl = hash => `https://steamcommunity.com/market/listings/${APPID}/${encodeURIComponent(hash)}`;

// Gráfico de linha SVG (estático) do histórico de "menor venda". points: [[t, ask, bid, vol], ...]
export function chartSvg(points, { w = 640, h = 160, pad = 10, fmtDate: fd = fmtDate, alt = 'Histórico de menor venda em reais' } = {}) {
  const pts = (points || []).filter(p => p[1] != null);
  if (pts.length < 2) return '';
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const minX = xs[0], maxX = xs[xs.length - 1], minY = Math.min(...ys), maxY = Math.max(...ys);
  const sx = x => pad + (maxX === minX ? 0 : (x - minX) / (maxX - minX)) * (w - 2 * pad);
  const sy = v => h - pad - (maxY === minY ? 0.5 * (h - 2 * pad) : (v - minY) / (maxY - minY) * (h - 2 * pad));
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(' ');
  const area = `${line} L${sx(maxX).toFixed(1)},${(h - pad).toFixed(1)} L${sx(minX).toFixed(1)},${(h - pad).toFixed(1)} Z`;
  return `<div class="chart-wrap"><div class="chart-yhi">${moneyBrl(maxY)}</div><div class="chart-ylo">${moneyBrl(minY)}</div>
<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" class="chart-svg" role="img" aria-label="${alt}">
<path d="${area}" fill="rgba(102,192,244,.12)" stroke="none"/><path d="${line}" fill="none" stroke="#66c0f4" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>
<div class="chart-x"><span>${fd(minX)}</span><span>${fd(maxX)}</span></div></div>`;
}

// Variação percentual segura
export const pct = (now, before) => (now != null && before != null && before > 0) ? (now - before) / before * 100 : null;

export const liqLabel = { alta: 'alta', media: 'média', baixa: 'baixa', nenhuma: 'nenhuma' };
