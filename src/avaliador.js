// tbhbau · Avaliador de baú. Lê o save (.es3) 100% no navegador, cruza com o snapshot do mercado.
// Depende de window.tbh (common.js): moeda global, idioma da página, modal de item, snapshot.
import { decryptES3, readStash } from '/tbh-save.js';
const { $, $$, ls, moneyBrl, netCents, fetchSnapshot, openItemDetail, on } = window.tbh;
const LANG = window.tbh.lang; // idioma da página (o build gera /avaliador/ em PT e /en/evaluator/ em EN)

const I18N = {
  pt: {
    copy_path: '📋 copiar caminho', copy_path_done: '✓ copiado!',
    st_total: 'Valor total — anúncio', st_instant: '💸 Venda imediata (R$)', st_gear: 'Equipamentos', st_materials: 'Materiais', st_items: 'Itens no baú',
    st_nlnm: 'Sem anúncio · sem mercado', st_brlpend: '⚠ BRL pendente', st_brlload: 'preço em R$ ainda carregando', st_brlpend_n: n => `${n} itens`,
    count_types: n => `${n} tipos`,
    disclaimer: d => `Preços do Mercado Steam atualizados automaticamente a cada ~30 min, <b>não são em tempo real</b>. Confira o valor na Steam antes de vender. Última atualização: ${d}.`,
    explain: 'Anúncio = preço de listagem (você espera vender). Venda imediata = maior ordem de compra (vende na hora).',
    diag: (dups, other) => `${dups} refs duplicadas ignoradas. ${other} itens sem nome conhecido.`, unrecognized: n => `Itens não reconhecidos (${n})`,
    tag_nolisting: 'sem anúncio', price_pending: 'R$ pendente', no_order: 'sem ordem', kind_gear: 'equip.', kind_material: 'material', kind_other: '?',
    top4_title: '🚀 Top 4 pra lançar agora', top4_hint: 'Os 4 itens mais lucrativos por <b>venda imediata</b> (bate na maior ordem de compra e vende na hora). Use na sua janela de 4 itens / 8h.',
    top4_liq: (liq, n) => `liquidez ${liq} (${n} ordens)`, top4_unit: 'un.', top4_total: v => `Lançando esses 4 agora você recebe ≈ <b>${v}</b> na hora.`,
    liq_alta: 'alta', liq_media: 'média', liq_baixa: 'baixa', liq_nenhuma: 'nenhuma',
    s_loading: 'Carregando tabelas de itens e snapshot do mercado…', s_reading: f => `Lendo <b>${f}</b>…`, s_decrypting: 'Decifrando o save no navegador…', s_crossing: 'Cruzando o baú com o Mercado Steam…',
    s_error: msg => `Falha ao ler o save: ${msg}. Confira se é o <code>SaveFile_Live.es3</code> do TBH.`, s_cached: 'Carregando último save salvo…',
    st_net: 'Você recebe (líquido)', st_net_note: 'após taxa ~13%', top4_net: v => `≈ ${v} líquido (após taxa Steam)`,
  },
  en: {
    copy_path: '📋 copy path', copy_path_done: '✓ copied!',
    st_total: 'Total value — listing', st_instant: '💸 Instant sell (R$)', st_gear: 'Equipment', st_materials: 'Materials', st_items: 'Items in stash',
    st_nlnm: 'No listing · no market', st_brlpend: '⚠ BRL pending', st_brlload: 'BRL price still loading', st_brlpend_n: n => `${n} items`,
    count_types: n => `${n} types`,
    disclaimer: d => `Steam Market prices update automatically every ~30 min, <b>not real-time</b>. Check the value on Steam before selling. Last update: ${d}.`,
    explain: 'Listing = ask price (you wait to sell). Instant sell = highest buy order (sell right now, BRL).',
    diag: (dups, other) => `${dups} duplicate refs ignored. ${other} items with unknown name.`, unrecognized: n => `Unrecognized items (${n})`,
    tag_nolisting: 'no listing', price_pending: 'BRL pending', no_order: 'no order', kind_gear: 'gear', kind_material: 'material', kind_other: '?',
    top4_title: '🚀 Top 4 to list now', top4_hint: 'The 4 most profitable items by <b>instant sell</b> (hit the highest buy order and sell now). Use in your 4-items / 8h window.',
    top4_liq: (liq, n) => `liquidity ${liq} (${n} orders)`, top4_unit: 'ea.', top4_total: v => `Listing these 4 now you get ≈ <b>${v}</b> instantly.`,
    liq_alta: 'high', liq_media: 'medium', liq_baixa: 'low', liq_nenhuma: 'none',
    s_loading: 'Loading item tables and market snapshot…', s_reading: f => `Reading <b>${f}</b>…`, s_decrypting: 'Decrypting the save in your browser…', s_crossing: 'Matching your stash with the Steam Market…',
    s_error: msg => `Failed to read the save: ${msg}. Make sure it is the TBH <code>SaveFile_Live.es3</code>.`, s_cached: 'Loading last saved file…',
    st_net: 'You receive (net)', st_net_note: 'after ~13% fee', top4_net: v => `≈ ${v} net (after Steam fee)`,
  },
};
const t = (k, ...a) => { const v = (I18N[LANG] && I18N[LANG][k] != null) ? I18N[LANG][k] : I18N.pt[k] ?? k; return typeof v === 'function' ? v(...a) : v; };

const PASSWORD = 'emuMqG3bLYJ938ZDCfieWJ'; // chave ES3 do jogo (pública, embutida nos assets do TBH)
const drop = $('#drop'), fileInput = $('#file'), statusEl = $('#status');
const money = (cents) => window.tbh.money(cents, window.tbh.cur);
const SYMBOLS = { usd: '$', brl: 'R$' };
let tables = null, lastStash = null;
function setStatus(html, isErr) { statusEl.className = 'note' + (isErr ? ' err' : ''); statusEl.innerHTML = html; statusEl.classList.remove('hidden'); }

async function loadTables() {
  if (tables) return tables;
  setStatus(t('s_loading'));
  const [table, names, market] = await Promise.all([
    fetch('/data/tbh-itemtable.json').then(r => r.json()),
    fetch('/data/tbh-itemnames.json').then(r => r.json()),
    fetchSnapshot(),
  ]);
  tables = { table, names, market: market.items, fetchedAt: market.updatedAt || market.fetchedAt };
  return tables;
}

const SAVE_KEY = 'tbhSave', SAVE_NAME_KEY = 'tbhSaveName';
function bytesToB64(bytes) { let bin = ''; const chunk = 0x8000; for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk)); return btoa(bin); }
function b64ToBytes(b64) { const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }

async function handleFile(file) { await handleBytes(new Uint8Array(await file.arrayBuffer()), file.name, false); }
async function handleBytes(bytes, name, fromCache) {
  try {
    setStatus(fromCache ? t('s_cached') : t('s_reading', name));
    const tb = await loadTables();
    setStatus(t('s_decrypting'));
    const plain = await decryptES3(bytes, PASSWORD);
    setStatus(t('s_crossing'));
    lastStash = readStash(new TextDecoder().decode(plain), tb.table, tb.names, tb.market);
    render();
    statusEl.classList.add('hidden');
    $('#loadedName').textContent = name;
    $('#loadedBar').classList.remove('hidden');
    $('#intro').classList.add('hidden');
    if (!fromCache) { ls.set(SAVE_KEY, bytesToB64(bytes)); ls.set(SAVE_NAME_KEY, name); window.tbh.refreshChip(); }
  } catch (e) {
    console.error(e);
    setStatus(t('s_error', e.message), true);
    if (fromCache) ls.del(SAVE_KEY);
  }
}

let sortKey = 'subtotal', sortDir = -1;
function render() {
  const s = lastStash; if (!s) return;
  const CUR = window.tbh.cur;
  $('#result').classList.remove('hidden');
  const date = tables?.fetchedAt ? new Date(tables.fetchedAt).toLocaleString(LANG === 'pt' ? 'pt-BR' : 'en-US') : '—';
  const missing = s.types - (s.pricedTypes[CUR] || 0) - s.unpricedItems;
  const pendNote = (CUR === 'brl' && missing > 0)
    ? `<div class="stat" style="border-color:#5a4a1f"><div class="k">${t('st_brlpend')}</div><div class="v" style="font-size:16px">${t('st_brlpend_n', missing)}<br><span class="pend">${t('st_brlload')}</span></div></div>` : '';
  $('#summary').innerHTML = `
    <div class="stat"><div class="k">${t('st_total')} (${SYMBOLS[CUR]})</div><div class="v big">${money(s.total[CUR])}</div></div>
    <div class="stat green"><div class="k">${t('st_instant')}</div><div class="v big">${moneyBrl(s.instantTotalBrl)}</div></div>
    <div class="stat"><div class="k">${t('st_net')}</div><div class="v">${moneyBrl(netCents(s.instantTotalBrl))}</div><div class="s">${t('st_net_note')}</div></div>
    <div class="stat"><div class="k">${t('st_gear')}</div><div class="v">${money(s.gear[CUR])}</div></div>
    <div class="stat"><div class="k">${t('st_materials')}</div><div class="v">${money(s.mat[CUR])}</div></div>
    <div class="stat"><div class="k">${t('st_items')}</div><div class="v">${s.totalItems}</div></div>
    <div class="stat"><div class="k">${t('st_nlnm')}</div><div class="v" style="font-size:18px">${s.unlistedItems} · ${s.unpricedItems}</div></div>
    ${pendNote}`;
  const dEl = $('#disclaimer'); dEl.innerHTML = t('disclaimer', date); dEl.classList.remove('hidden');
  renderRows(); renderTop4();
  $('#extra').innerHTML = `<p class="muted" style="margin-top:18px">${t('explain')} ${t('diag', s.duplicateSlotRefsIgnored, s.ownedOtherItems)}</p>`
    + (s.unknownSummary.length ? `<details><summary class="muted">${t('unrecognized', s.unknownSummary.length)}</summary><ul class="muted">${s.unknownSummary.map(u => `<li>${u.label} ×${u.qty}</li>`).join('')}</ul></details>` : '');
}

function renderRows() {
  if (!lastStash) return;
  const CUR = window.tbh.cur;
  const q = $('#q').value.trim().toLowerCase();
  let rows = lastStash.items.filter(it => !q || it.name.toLowerCase().includes(q)).map(it => {
    const p = it[CUR + 'Cents'];
    return { ...it, listing: p, subtotal: p == null ? null : p * it.qty, instant: it.buyCount ? it.buyCents : null };
  });
  rows.sort((a, b) => { const av = a[sortKey], bv = b[sortKey]; const cmp = typeof av === 'string' ? String(av).localeCompare(String(bv)) : ((av ?? -1) - (bv ?? -1)); return cmp * sortDir; });
  $('#count').textContent = t('count_types', rows.length);
  $('#tbl tbody').innerHTML = rows.map(it => {
    const noListing = it.hasMarketListing === false;
    const pend = !noListing && it.listing == null;
    const hasBuy = it.buyCount && it.buyCents != null;
    return `<tr class="clickable" data-hash="${encodeURIComponent(it.hash)}">
      <td>${it.icon ? `<img class="ico" src="${it.icon}" loading="lazy" alt="">` : ''}</td>
      <td>${it.name}${noListing ? ` <span class="tag">${t('tag_nolisting')}</span>` : pend ? ` <span class="pend">${t('price_pending')}</span>` : ''}</td>
      <td><span class="tag ${it.kind || ''}">${t('kind_' + (it.kind || 'other'))}</span></td>
      <td class="num">${it.qty}</td>
      <td class="num">${noListing ? '—' : money(it.listing)}</td>
      <td class="num">${hasBuy ? moneyBrl(it.buyCents) : `<span class="muted">${t('no_order')}</span>`}</td>
      <td>${it.liquidez ? `<span class="liq ${it.liquidez}">${t('liq_' + it.liquidez)}${it.buyCount ? ` (${it.buyCount})` : ''}</span>` : ''}</td>
      <td class="num">${noListing ? '—' : money(it.subtotal)}</td></tr>`; }).join('');
}

function renderTop4() {
  if (!lastStash) return;
  const units = [];
  for (const it of lastStash.items) {
    if (!it.buyCents || !it.buyCount) continue;
    for (let i = 0; i < it.qty; i++) units.push({ name: it.name, hash: it.hash, icon: it.icon, cents: it.buyCents, liq: it.liquidez, buyCount: it.buyCount });
  }
  if (!units.length) { $('#top4').classList.add('hidden'); return; }
  units.sort((a, b) => b.cents - a.cents);
  const top = units.slice(0, 4), total = top.reduce((a, u) => a + u.cents, 0);
  const grouped = [];
  for (const u of top) { const g = grouped.find(x => x.hash === u.hash); if (g) g.n++; else grouped.push({ ...u, n: 1 }); }
  $('#top4').classList.remove('hidden');
  $('#top4').innerHTML = `<h2>${t('top4_title')}</h2><div class="hint">${t('top4_hint')}</div>
    <div class="picks">${grouped.map((u, i) => `<div class="pick"><div class="rank">${i + 1}${u.n > 1 ? `<span class="muted" style="font-size:12px">×${u.n}</span>` : ''}</div>${u.icon ? `<img src="${u.icon}" alt="">` : ''}
      <div><div class="nm">${u.name}</div><div class="val">${moneyBrl(u.cents)}${u.n > 1 ? ` <span class="muted" style="font-size:12px">${t('top4_unit')}</span>` : ''}</div><div class="liq ${u.liq}">${t('top4_liq', t('liq_' + u.liq), u.buyCount)}</div></div></div>`).join('')}</div>
    <div class="tot">${t('top4_total', moneyBrl(total))} <span class="muted" style="font-size:13px">${t('top4_net', moneyBrl(netCents(total)))}</span></div>`;
}

// eventos
drop.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => e.target.files[0] && handleFile(e.target.files[0]));
['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('hover'); }));
['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('hover'); }));
drop.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) handleFile(f); });
$('#copyPath').addEventListener('click', async e => {
  e.stopPropagation();
  try { await navigator.clipboard.writeText($('#savePath').textContent); } catch {}
  const btn = $('#copyPath'); btn.textContent = t('copy_path_done'); setTimeout(() => btn.textContent = t('copy_path'), 1500);
});
$('#q').addEventListener('input', renderRows);
$$('th[data-s]').forEach(th => th.addEventListener('click', () => { const k = th.dataset.s; sortDir = (sortKey === k) ? -sortDir : -1; sortKey = k; renderRows(); }));
$('#tbl tbody').addEventListener('click', e => {
  const tr = e.target.closest('tr[data-hash]'); if (!tr || !lastStash) return;
  const it = lastStash.items.find(x => x.hash === decodeURIComponent(tr.dataset.hash));
  if (it) openItemDetail(it);
});
$('#removeSave').addEventListener('click', () => {
  ls.del(SAVE_KEY); ls.del(SAVE_NAME_KEY); window.tbh.refreshChip();
  lastStash = null;
  $('#result').classList.add('hidden'); $('#loadedBar').classList.add('hidden'); statusEl.classList.add('hidden'); $('#intro').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
on('cur', () => { if (lastStash) render(); });

(function () { // recarrega o último save salvo (só no navegador), se houver
  const b64 = ls.get(SAVE_KEY);
  if (b64) { try { handleBytes(b64ToBytes(b64), ls.get(SAVE_NAME_KEY) || 'save', true); } catch { ls.del(SAVE_KEY); } }
})();
