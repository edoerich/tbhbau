import { page, breadcrumb } from '../layout.mjs';

export function render(ctx) {
  const { i } = ctx, R = i.routes;
  const bc = breadcrumb(i, [[R.home, i.t('nav_home')], [null, i.t('ev_crumb')]]);
  const th = i.t('ev_th');
  const body = `
${bc.html}
<h1>${i.t('ev_h1')}</h1>
<p class="lead">${i.t('ev_sub')}</p>

<div id="drop">
  <div>${i.t('ev_drop')}</div>
  <small><span>${i.t('ev_path_pre')}</span> <code id="savePath">%USERPROFILE%\\AppData\\LocalLow\\TesseractStudio\\TaskbarHero</code></small>
  <div><button id="copyPath" class="copybtn" type="button" data-i18n="copy_path">${i.t('ev_copy')}</button></div>
  <span class="badge">${i.t('ev_badge')}</span>
</div>
<input id="file" type="file" accept=".es3" class="hidden">
<div id="loadedBar" class="loaded-bar hidden">
  <span>✓ <span>${i.t('ev_loaded')}</span> <b id="loadedName"></b></span>
  <button id="removeSave" class="linkbtn" type="button">${i.t('ev_remove')}</button>
</div>
<div id="status" class="note hidden"></div>

<section id="result" class="hidden">
  <div class="stats" id="summary"></div>
  <div id="disclaimer" class="disclaimer hidden"></div>
  <div id="top4" class="top4 hidden"></div>
  <div class="controls">
    <input id="q" type="search" placeholder="${i.t('ev_q_ph')}">
    <span class="muted" id="count"></span>
  </div>
  <div class="tablewrap"><table id="tbl">
    <thead><tr>
      <th></th><th data-s="name">${th[0]}</th><th data-s="kind">${th[1]}</th>
      <th class="num" data-s="qty">${th[2]}</th>
      <th class="num" data-s="listing">${th[3]}</th>
      <th class="num" data-s="instant">${th[4]}</th>
      <th data-s="buyCount">${th[5]}</th>
      <th class="num" data-s="subtotal">${th[6]}</th>
    </tr></thead>
    <tbody></tbody>
  </table></div>
  <div id="extra"></div>
</section>

<section id="intro" class="prose">
  <h2>${i.t('ev_how_h')}</h2>
  <ol>${i.t('ev_how_p')}</ol>
  <p>${i.t('ev_how_extra')}</p>
  <h2>${i.t('ev_priv_h')}</h2>
  <p>${i.t('ev_priv_p', R.privacy)}</p>
  <p>${i.t('ev_priv_more', ctx.guideUrl('como-vender'), ctx.guideUrl('anuncio-vs-venda-imediata'))}</p>
</section>`;

  return [{ path: R.evaluator.slice(1) + 'index.html', sitemap: { priority: 0.9, changefreq: 'weekly' }, html: page({
    i, path: R.evaluator, alt: ctx.altRoute('evaluator'), active: 'evaluator', updatedAt: ctx.updatedAt, jsonld: [bc.ld,
      { '@context': 'https://schema.org', '@type': 'WebApplication', name: i.t('ev_app_name'), url: 'https://tbhbau.com.br' + R.evaluator, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' } }],
    scripts: ['/assets/avaliador.js'],
    title: i.t('ev_title'), description: i.t('ev_desc'), body }) }];
}
