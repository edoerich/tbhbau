// Casca das páginas (PT/EN): head com hreflang, barra de navegação, rodapé, modais. Cada página passa só o miolo.
import { esc, SITE, AD_CLIENT, AD_SLOT } from './lib.mjs';
import { ROUTES, HTML_LANG } from './i18n.mjs';

export const NAV_KEYS = [['home', 'nav_home'], ['market', 'nav_market'], ['items', 'nav_items'], ['evaluator', 'nav_evaluator'], ['guides', 'nav_guides'], ['bulletin', 'nav_bulletin']];

export function adUnit(i) {
  return `<aside class="adslot" aria-label="${i.t('ad_label')}"><div class="lbl">${i.t('ad_label')}</div>
<ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="${AD_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script></aside>`;
}

// trilha: [[url, label], ..., [null, atual]]
export function breadcrumb(i, trail) {
  const html = `<nav class="crumbs" aria-label="${i.t('crumb_aria')}">${trail.map(([u, l]) => u ? `<a href="${u}">${esc(l)}</a>` : `<span>${esc(l)}</span>`).join(' › ')}</nav>`;
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map(([u, l], n) => ({ '@type': 'ListItem', position: n + 1, name: l, ...(u ? { item: SITE + u } : {}) })) };
  return { html, ld };
}

// path: URL desta página; alt: URL da mesma página no outro idioma (null se não existir)
export function page({ i, path, alt = null, title, description, body, active = null, noindex = false, jsonld = [], scripts = [], updatedAt = null, ogType = 'website' }) {
  const L = i.L, other = L === 'pt' ? 'en' : 'pt';
  const canonical = SITE + path;
  const ld = [].concat(jsonld).filter(Boolean).map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const hreflang = alt ? `<link rel="alternate" hreflang="${HTML_LANG[L]}" href="${canonical}">
<link rel="alternate" hreflang="${HTML_LANG[other]}" href="${SITE + alt}">
<link rel="alternate" hreflang="x-default" href="${SITE + (L === 'pt' ? path : alt)}">` : '';
  const R = ROUTES[L];
  const langLinks = `<div class="toggle" id="langToggle" title="${i.t('lang_title')}">` +
    (L === 'pt' ? `<a class="on" href="${path}" hreflang="pt-BR" data-setlang="pt">PT</a><a href="${alt || ROUTES.en.home}" hreflang="en" data-setlang="en">EN</a>`
                : `<a href="${alt || ROUTES.pt.home}" hreflang="pt-BR" data-setlang="pt">PT</a><a class="on" href="${path}" hreflang="en" data-setlang="en">EN</a>`) + '</div>';
  return `<!DOCTYPE html>
<html lang="${HTML_LANG[L]}" data-lang="${L}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${hreflang}
${noindex ? '<meta name="robots" content="noindex,follow">' : ''}
<meta property="og:type" content="${ogType}"><meta property="og:site_name" content="tbhbau"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:locale" content="${L === 'pt' ? 'pt_BR' : 'en_US'}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@500;700&family=Nunito+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@500;700&display=swap">
<link rel="stylesheet" href="/assets/site.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}" crossorigin="anonymous"></script>
${ld}
</head>
<body>
<header class="topbar">
  <div class="wrap">
    <a class="brand" href="${R.home}"><span class="logo">B</span>tbhbau</a>
    <button class="navbtn" id="navToggle" aria-label="${i.t('menu')}">☰</button>
    <nav class="nav" aria-label="principal">${NAV_KEYS.map(([k, s]) => `<a href="${R[k]}"${k === active ? ' class="on"' : ''}>${i.t(s)}</a>`).join('')}</nav>
    <div class="tools">
      <a id="saveChip" class="chip hidden" href="${R.evaluator}" title="${i.t('chip_title')}">💾 <span id="saveChipName"></span></a>
      ${langLinks}
      <div class="toggle" id="curToggle" title="${i.t('cur_title')}"><button data-cur="brl"${L === 'pt' ? ' class="on"' : ''}>R$</button><button data-cur="usd"${L === 'en' ? ' class="on"' : ''}>US$</button></div>
    </div>
  </div>
</header>
<div id="langBar" class="langbar hidden"><span>${i.t('lang_suggest', alt || ROUTES[other].home)}</span><button id="langBarClose" aria-label="${i.t('close')}">×</button></div>
<main class="wrap">
${body}
</main>
<footer class="site"><div class="wrap">
  <div class="cols">
    <div>
      <h4>tbhbau</h4>
      <p style="margin:0 0 6px">${i.t('foot_about')}</p>
      ${updatedAt ? `<p class="updated" style="margin:0">${i.t('foot_updated', i.fmtDateTime(updatedAt), i.fmtDateTime(Date.now()))}</p>` : ''}
    </div>
    <div>
      <h4>${i.t('foot_nav')}</h4>
      ${NAV_KEYS.map(([k, s]) => `<a href="${R[k]}">${i.t(s)}</a>`).join('')}
    </div>
    <div>
      <h4>${i.t('foot_site')}</h4>
      <a href="${R.about}">${i.t('foot_about_link')}</a><a href="${R.contact}">${i.t('foot_contact')}</a><a href="${R.privacy}">${i.t('foot_privacy')}</a><a href="${R.terms}">${i.t('foot_terms')}</a>
      <a href="#" data-pix>${i.t('foot_pix')}</a>
      <a href="https://github.com/edoerich/tbhbau" target="_blank" rel="noopener">${i.t('foot_github')}</a>
    </div>
  </div>
  <div class="small">${i.t('foot_based')}</div>
</div></footer>

<div id="pixModal" class="modal hidden">
  <div class="modal-box">
    <button id="pixClose" class="modal-x" aria-label="${i.t('close')}">×</button>
    <h3 style="margin:0 0 4px">${i.t('pix_title')}</h3>
    <p class="muted" style="margin:0 0 12px">${i.t('pix_desc')}</p>
    <img src="/pix-qr.svg" alt="${i.t('pix_alt')}" class="pix-qr">
    <div class="pix-copy"><code id="pixCode"></code></div>
    <button id="pixCopyBtn" class="btn">${i.t('pix_copy')}</button>
  </div>
</div>
<div id="itemModal" class="modal hidden">
  <div class="modal-box modal-wide">
    <button id="itemClose" class="modal-x" aria-label="${i.t('close')}">×</button>
    <div class="idet-head">
      <img id="idetIcon" class="idet-icon" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" style="display:none">
      <div style="flex:1"><div id="idetName" class="idet-name"></div><div id="idetType" class="muted" style="font-size:13px"></div></div>
      <div style="display:flex;flex-direction:column;gap:4px;font-size:13px;text-align:right"><a id="idetPage" class="hidden" href="#">${i.t('modal_page')}</a><a id="idetLink" href="#" target="_blank" rel="noopener">${i.t('modal_steam')}</a></div>
    </div>
    <div class="muted" id="idetHint" style="font-size:12px;margin:2px 0 12px"></div>
    <div id="idetIndicators" class="istats"></div>
    <div id="idetBody"></div>
  </div>
</div>
<script src="/assets/common.js"></script>
${scripts.map(s => `<script type="module" src="${s}"></script>`).join('\n')}
</body>
</html>`;
}
