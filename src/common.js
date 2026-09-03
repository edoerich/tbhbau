// tbhbau · JS comum a todas as páginas (PT/EN): moeda global, idioma, chip do save, menu, modal de item,
// order book ao vivo, tabelas ordenáveis e Pix. Sem dependências. Exposto em window.tbh pro avaliador.js.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const API_BASE = 'https://api.tbhbau.com.br';
  const SNAPSHOT_URL = API_BASE + '/data/snapshot.json';
  const SNAPSHOT_FALLBACK = '/data/snapshot.seed.json';
  const APPID = 3678970;
  const SYMBOLS = { usd: '$', brl: 'R$' }, LOCALES = { usd: 'en-US', brl: 'pt-BR' };
  const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} }, del: k => { try { localStorage.removeItem(k); } catch {} } };

  // Idioma = o da página (o build gera PT em / e EN em /en/). Preferência salva só quando o visitante clica no seletor.
  const LANG = document.documentElement.dataset.lang === 'en' ? 'en' : 'pt';
  // Moeda: ?cur=usd|brl na URL > preferência salva > padrão do idioma (EN → US$, PT → R$)
  const qcur = new URLSearchParams(location.search).get('cur');
  let CUR = (qcur === 'usd' || qcur === 'brl') ? qcur : (ls.get('cur') === 'usd' ? 'usd' : ls.get('cur') === 'brl' ? 'brl' : (LANG === 'en' ? 'usd' : 'brl'));
  if (qcur === 'usd' || qcur === 'brl') ls.set('cur', qcur);
  const money = (cents, cur = CUR) => cents == null ? '—' : `${SYMBOLS[cur]} ${(cents / 100).toLocaleString(LOCALES[cur], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const moneyBrl = c => money(c, 'brl');
  const netCents = c => c == null ? null : Math.round(c / 1.15);
  const volNum = v => { const n = parseInt(String(v ?? '').replace(/[^\d]/g, ''), 10); return Number.isFinite(n) ? n : 0; };
  const fmtQty = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : String(n);
  const fmtDate = ts => new Date(ts).toLocaleDateString(LANG === 'pt' ? 'pt-BR' : 'en-US');

  const listeners = {};
  const on = (ev, cb) => (listeners[ev] = listeners[ev] || []).push(cb);
  const emit = (ev, ...a) => (listeners[ev] || []).forEach(cb => cb(...a));

  const T = {
    pt: { loading: 'carregando order book…', error: 'não foi possível carregar o order book agora. Tente de novo em instantes.',
      hint: 'Order book ao vivo da Steam · valores em R$', lowest: 'Menor venda', median: 'Mediana', vol: 'Volume 24h', bid: 'Melhor compra', ask: 'Melhor venda', spread: 'Spread',
      buy: 'Ordens de compra', sell: 'Ordens de venda', chart: 'Histórico — menor venda (R$)', chart_full: 'Histórico completo — menor venda (R$)', pts: n => `${n} pontos`, empty: '📈 Coletando histórico… o gráfico aparece conforme os preços forem registrados.', copied: 'Copiado ✓', copy: 'Copiar código Pix' },
    en: { loading: 'loading order book…', error: 'could not load the order book right now. Try again in a moment.',
      hint: 'Live order book from Steam · values in R$ (BRL)', lowest: 'Lowest ask', median: 'Median', vol: '24h volume', bid: 'Best bid', ask: 'Best ask', spread: 'Spread',
      buy: 'Buy orders', sell: 'Sell orders', chart: 'History — lowest ask (R$)', chart_full: 'Full history — lowest ask (R$)', pts: n => `${n} points`, empty: '📈 Collecting history… the chart appears as prices get recorded.', copied: 'Copied ✓', copy: 'Copy Pix code' },
  };
  const t = (k, ...a) => { const v = T[LANG][k] ?? T.pt[k]; return typeof v === 'function' ? v(...a) : v; };

  // ── Moeda global (R$ / US$) ──
  function applyCurrency() {
    $$('.money').forEach(el => {
      const b = el.dataset.brl, u = el.dataset.usd;
      if (b == null && u == null) return;
      if (CUR === 'usd' && u != null) el.textContent = money(+u, 'usd');
      else if (b != null) el.textContent = moneyBrl(+b);
      else el.textContent = money(+u, 'usd');
    });
    $$('#curToggle button').forEach(b => b.classList.toggle('on', b.dataset.cur === CUR));
    emit('cur', CUR);
  }
  const curToggle = $('#curToggle');
  if (curToggle) curToggle.addEventListener('click', e => {
    const b = e.target.closest('button[data-cur]'); if (!b) return;
    CUR = b.dataset.cur; ls.set('cur', CUR); applyCurrency();
  });

  // ── Idioma: seletor salva a preferência; barra sugere a outra língua a quem nunca escolheu ──
  $$('#langToggle a[data-setlang]').forEach(a => a.addEventListener('click', () => { ls.set('lang', a.dataset.setlang); ls.set('langBarDismissed', '1'); }));
  (function langBar() {
    const bar = $('#langBar'); if (!bar) return;
    if (ls.get('lang') || ls.get('langBarDismissed')) return;
    const nav = (navigator.language || '').toLowerCase();
    const wants = nav.startsWith('pt') ? 'pt' : 'en';
    if (wants === LANG) return;
    bar.classList.remove('hidden');
    $('#langBarClose').addEventListener('click', () => { bar.classList.add('hidden'); ls.set('langBarDismissed', '1'); });
    bar.addEventListener('click', e => { if (e.target.closest('a')) { ls.set('lang', wants); ls.set('langBarDismissed', '1'); } });
  })();

  // ── Chip "save carregado" na barra ──
  function refreshChip() {
    const chip = $('#saveChip'); if (!chip) return;
    const name = ls.get('tbhSaveName');
    chip.classList.toggle('hidden', !name);
    if (name) { $('#saveChipName', chip).textContent = name; }
  }

  // ── Menu mobile ──
  const navBtn = $('#navToggle');
  if (navBtn) navBtn.addEventListener('click', () => $('.topbar').classList.toggle('open'));

  // ── Snapshot (cache por sessão) e índice de slugs ──
  let _snap = null, _idx = null;
  async function fetchSnapshot() {
    if (_snap) return _snap;
    try { const r = await fetch(SNAPSHOT_URL, { cache: 'no-store' }); if (!r.ok) throw new Error('HTTP ' + r.status); _snap = await r.json(); }
    catch (e) { console.warn('snapshot ao vivo indisponível, usando bundle:', e.message); _snap = await fetch(SNAPSHOT_FALLBACK).then(r => r.json()); }
    return _snap;
  }
  async function itemUrl(hash) {
    if (!_idx) { try { _idx = await fetch('/data/items-index.json').then(r => r.json()); } catch { _idx = {}; } }
    return _idx[hash] ? `${LANG === 'en' ? '/en' : ''}/item/${_idx[hash]}/` : null;
  }

  // ── Order book + gráfico (render compartilhado) ──
  function obColumn(orders, cls, label) {
    const rows = (orders || []).slice(0, 12);
    const maxQ = Math.max(1, ...rows.map(o => o[1]));
    const totalQ = (orders || []).reduce((a, o) => a + o[1], 0);
    const body = rows.length ? rows.map(o =>
      `<div class="obrow ${cls}"><span class="obbar" style="width:${Math.round(o[1] / maxQ * 100)}%"></span><span class="obp">${moneyBrl(o[0])}</span><span class="obq">${fmtQty(o[1])}</span></div>`).join('')
      : '<div class="muted" style="padding:6px;font-size:12px">—</div>';
    return `<div><div class="obhead"><span class="h-${cls}">${label}</span><span class="muted">${fmtQty(totalQ)}</span></div>${body}</div>`;
  }
  function chartHtml(points, title) {
    const pts = (points || []).filter(p => p[1] != null);
    if (pts.length < 2) return `<div class="chart-empty">${t('empty')}</div>`;
    const W = 640, H = 160, pad = 10;
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const minX = xs[0], maxX = xs[xs.length - 1], minY = Math.min(...ys), maxY = Math.max(...ys);
    const sx = x => pad + (maxX === minX ? 0 : (x - minX) / (maxX - minX)) * (W - 2 * pad);
    const sy = v => H - pad - (maxY === minY ? 0.5 * (H - 2 * pad) : (v - minY) / (maxY - minY) * (H - 2 * pad));
    const line = pts.map((p, n) => `${n ? 'L' : 'M'}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(' ');
    const area = `${line} L${sx(maxX).toFixed(1)},${(H - pad).toFixed(1)} L${sx(minX).toFixed(1)},${(H - pad).toFixed(1)} Z`;
    return `<div class="chart-title"><span>${title || t('chart')}</span><span class="muted">${t('pts', pts.length)}</span></div>
      <div class="chart-wrap"><div class="chart-yhi">${moneyBrl(maxY)}</div><div class="chart-ylo">${moneyBrl(minY)}</div>
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="chart-svg"><path d="${area}" fill="rgba(102,192,244,.12)"/><path d="${line}" fill="none" stroke="#66c0f4" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>
      <div class="chart-x"><span>${fmtDate(minX)}</span><span>${fmtDate(maxX)}</span></div></div>`;
  }
  async function fetchLive(hash) {
    const [obR, histR] = await Promise.all([
      fetch(`${API_BASE}/api/item?hash=${encodeURIComponent(hash)}`, { cache: 'no-store' }),
      fetch(`${API_BASE}/api/history?hash=${encodeURIComponent(hash)}`, { cache: 'no-store' }).catch(() => null),
    ]);
    if (!obR.ok) throw new Error('HTTP ' + obR.status);
    const ob = await obR.json();
    let points = [];
    if (histR && histR.ok) { try { points = (await histR.json()).points || []; } catch {} }
    return { ob, points };
  }

  // ── Modal de detalhe do item ──
  const itemModal = $('#itemModal');
  const closeItem = () => itemModal && itemModal.classList.add('hidden');
  if (itemModal) {
    $('#itemClose').addEventListener('click', closeItem);
    itemModal.addEventListener('click', e => { if (e.target === itemModal) closeItem(); });
  }
  async function openItemDetail(it) {
    if (!itemModal) return;
    $('#idetName').textContent = it.name;
    $('#idetType').textContent = it.type || '';
    const icon = $('#idetIcon'); if (it.icon) { icon.src = it.icon; icon.style.display = ''; } else icon.style.display = 'none';
    $('#idetLink').href = `https://steamcommunity.com/market/listings/${APPID}/${encodeURIComponent(it.hash)}`;
    $('#idetHint').textContent = t('hint');
    const pg = $('#idetPage'); pg.classList.add('hidden');
    itemUrl(it.hash).then(u => { if (u) { pg.href = u; pg.classList.remove('hidden'); } });
    $('#idetIndicators').innerHTML = '';
    $('#idetBody').innerHTML = `<div class="muted" style="padding:24px;text-align:center">${t('loading')}</div>`;
    itemModal.classList.remove('hidden');
    try {
      const { ob, points } = await fetchLive(it.hash);
      const bid = ob.maxBuyCents, ask = ob.minSellCents;
      const spread = (bid != null && ask != null) ? ask - bid : null;
      const spreadPct = (spread != null && (ask + bid) > 0) ? spread / ((ask + bid) / 2) * 100 : null;
      const ind = [[t('lowest'), moneyBrl(ask)], [t('median'), moneyBrl(it.medianCents)], [t('vol'), it.volume || '—'],
        [t('bid'), moneyBrl(bid)], [t('ask'), moneyBrl(ask)], [t('spread'), spread != null ? `${moneyBrl(spread)} (${spreadPct.toFixed(1)}%)` : '—']];
      $('#idetIndicators').innerHTML = ind.map(([k, v]) => `<div class="istat"><div class="ik">${k}</div><div class="iv">${v}</div></div>`).join('');
      $('#idetBody').innerHTML = `<div class="obwrap">${obColumn(ob.buyOrders, 'buy', t('buy'))}${obColumn(ob.sellOrders, 'sell', t('sell'))}</div>` + chartHtml(points);
    } catch (e) {
      $('#idetBody').innerHTML = `<div class="err" style="padding:24px;text-align:center">${t('error')}</div>`;
    }
  }
  document.addEventListener('click', async e => {
    const el = e.target.closest('[data-hash][data-open]'); if (!el) return;
    if (e.target.closest('a')) return;
    e.preventDefault();
    const snap = await fetchSnapshot();
    const hash = decodeURIComponent(el.dataset.hash);
    const it = (snap.items || []).find(x => x.hash === hash) || { hash, name: el.dataset.name || hash, type: '', icon: '' };
    openItemDetail(it);
  });

  // ── Página do item: order book ao vivo + gráfico completo ──
  const live = $('#liveOb');
  if (live) (async () => {
    const hash = decodeURIComponent(live.dataset.hash);
    try {
      const { ob, points } = await fetchLive(hash);
      live.innerHTML = `<div class="obwrap">${obColumn(ob.buyOrders, 'buy', t('buy'))}${obColumn(ob.sellOrders, 'sell', t('sell'))}</div>`;
      const set = (k, v) => { const el = $(`[data-live="${k}"]`); if (el && v != null) el.textContent = v; };
      set('bid', moneyBrl(ob.maxBuyCents)); set('buyCount', ob.buyCount);
      set('net', moneyBrl(netCents(ob.maxBuyCents)));
      if (ob.maxBuyCents != null && ob.minSellCents != null) set('spread', `${moneyBrl(ob.minSellCents - ob.maxBuyCents)} (${((ob.minSellCents - ob.maxBuyCents) / ((ob.minSellCents + ob.maxBuyCents) / 2) * 100).toFixed(1)}%)`);
      $$('[data-live-badge]').forEach(el => el.classList.remove('hidden'));
      const full = $('#liveChart');
      if (full && points.length >= 2) full.innerHTML = chartHtml(points, t('chart_full'));
    } catch (e) { live.innerHTML = `<div class="err" style="padding:16px;text-align:center">${t('error')}</div>`; }
  })();

  // ── Tabelas ordenáveis / filtráveis (linhas estáticas com data-*) ──
  const countLabel = n => LANG === 'en' ? `${n} items` : `${n} itens`;
  $$('table.sortable').forEach(tbl => {
    const tbody = tbl.tBodies[0]; let key = tbl.dataset.sort || null, dir = -1;
    const sort = () => {
      if (!key) return;
      const rows = [...tbody.rows];
      rows.sort((a, b) => {
        const av = a.dataset[key], bv = b.dataset[key];
        const an = parseFloat(av), bn = parseFloat(bv);
        const cmp = (!isNaN(an) && !isNaN(bn)) ? an - bn : (av == null || av === '' ? -1 : bv == null || bv === '' ? 1 : String(av).localeCompare(String(bv)));
        return cmp * dir;
      });
      rows.forEach(r => tbody.appendChild(r));
      $$('th', tbl).forEach(th => th.classList.toggle('sorted', th.dataset.k === key));
    };
    $$('th[data-k]', tbl).forEach(th => th.addEventListener('click', () => { const k = th.dataset.k; dir = (key === k) ? -dir : (th.classList.contains('str') ? 1 : -1); key = k; sort(); }));
    const input = tbl.dataset.filter ? $(tbl.dataset.filter) : null;
    if (input) {
      const counter = tbl.dataset.count ? $(tbl.dataset.count) : null;
      const apply = () => {
        const q = input.value.trim().toLowerCase(); let n = 0;
        [...tbody.rows].forEach(r => { const show = !q || (r.dataset.q || r.textContent).toLowerCase().includes(q); r.classList.toggle('hidden', !show); if (show) n++; });
        if (counter) counter.textContent = countLabel(n);
      };
      input.addEventListener('input', apply); apply();
    }
  });
  $$('[data-filter-list]').forEach(input => {
    const list = $(input.dataset.filterList); if (!list) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      list.classList.toggle('hidden', !q);
      $$('li', list).forEach(li => li.classList.toggle('hidden', !li.textContent.toLowerCase().includes(q)));
    });
  });

  // ── Pix ──
  const PIX_PAYLOAD = '00020101021126580014br.gov.bcb.pix0136a729db7b-f840-4293-95fb-1020278f4ee85204000053039865802BR5908EDELRICH6006BRASIL62070503***6304CBEA';
  const pixModal = $('#pixModal');
  if (pixModal) {
    $('#pixCode').textContent = PIX_PAYLOAD;
    const closePix = () => pixModal.classList.add('hidden');
    $$('[data-pix]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); pixModal.classList.remove('hidden'); }));
    $('#pixClose').addEventListener('click', closePix);
    pixModal.addEventListener('click', e => { if (e.target === pixModal) closePix(); });
    $('#pixCopyBtn').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(PIX_PAYLOAD); $('#pixCopyBtn').textContent = t('copied'); setTimeout(() => $('#pixCopyBtn').textContent = t('copy'), 1500); }
      catch { prompt('Pix:', PIX_PAYLOAD); }
    });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeItem(); pixModal && pixModal.classList.add('hidden'); } });

  applyCurrency(); refreshChip();
  window.tbh = { get cur() { return CUR; }, lang: LANG, money, moneyBrl, netCents, volNum, fmtQty,
    fetchSnapshot, openItemDetail, itemUrl, on, applyCurrency, refreshChip, ls, $, $$ };
})();
