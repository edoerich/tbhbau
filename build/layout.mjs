// Casca das páginas: head, barra de navegação, rodapé, modais. Cada página passa só o miolo.
import { esc, SITE, AD_CLIENT, AD_SLOT, fmtDateTime } from './lib.mjs';

export const NAV = [['/', 'Início'], ['/mercado/', 'Mercado'], ['/itens/', 'Itens'], ['/avaliador/', 'Avaliador'], ['/guias/', 'Guias'], ['/boletim/', 'Boletim']];

export function adUnit() {
  return `<aside class="adslot" aria-label="anúncio"><div class="lbl">Publicidade</div>
<ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="${AD_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script></aside>`;
}

// trilha: [[url, label], ..., [null, atual]]
export function breadcrumb(trail) {
  const html = `<nav class="crumbs" aria-label="Você está em">${trail.map(([u, l]) => u ? `<a href="${u}">${esc(l)}</a>` : `<span>${esc(l)}</span>`).join(' › ')}</nav>`;
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map(([u, l], i) => ({ '@type': 'ListItem', position: i + 1, name: l, ...(u ? { item: SITE + u } : {}) })) };
  return { html, ld };
}

export function page({ path, title, description, body, active = null, langToggle = false, noindex = false, jsonld = [], scripts = [], updatedAt = null, ogType = 'website' }) {
  const canonical = SITE + path;
  const ld = [].concat(jsonld).filter(Boolean).map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex,follow">' : ''}
<meta property="og:type" content="${ogType}"><meta property="og:site_name" content="tbhbau"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:locale" content="pt_BR">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}" crossorigin="anonymous"></script>
${ld}
</head>
<body>
<header class="topbar">
  <div class="wrap">
    <a class="brand" href="/"><span class="logo">B</span>tbhbau</a>
    <button class="navbtn" id="navToggle" aria-label="menu">☰</button>
    <nav class="nav" aria-label="principal">${NAV.map(([u, l]) => `<a href="${u}"${u === active ? ' class="on"' : ''}>${l}</a>`).join('')}</nav>
    <div class="tools">
      <a id="saveChip" class="chip hidden" href="/avaliador/" title="Seu save fica só no seu navegador">💾 <span id="saveChipName"></span></a>
      ${langToggle ? '<div class="toggle" id="langToggle"><button data-lang="pt" class="on">PT</button><button data-lang="en">EN</button></div>' : ''}
      <div class="toggle" id="curToggle" title="Moeda dos preços de anúncio"><button data-cur="brl" class="on">R$</button><button data-cur="usd">US$</button></div>
    </div>
  </div>
</header>
<main class="wrap">
${body}
</main>
<footer class="site"><div class="wrap">
  <div class="cols">
    <div>
      <h4>tbhbau</h4>
      <p style="margin:0 0 6px">Preços, histórico e ferramentas do Mercado Steam para <b>TBH: Task Bar Hero</b>. Feito por <b>edelrich</b>. Conteúdo informativo, sem vínculo oficial com a Valve/Steam ou com os desenvolvedores do TBH.</p>
      ${updatedAt ? `<p class="updated" style="margin:0">Dados do Mercado Steam atualizados em ${fmtDateTime(updatedAt)}. Página gerada em ${fmtDateTime(Date.now())}.</p>` : ''}
    </div>
    <div>
      <h4>Navegar</h4>
      ${NAV.map(([u, l]) => `<a href="${u}">${l}</a>`).join('')}
    </div>
    <div>
      <h4>Sobre o site</h4>
      <a href="/sobre/">Sobre</a><a href="/contato/">Contato</a><a href="/privacidade/">Privacidade</a><a href="/termos/">Termos de uso</a>
      <a href="#" data-pix>☕ Apoiar via Pix</a>
      <a href="https://github.com/edoerich/tbhbau" target="_blank" rel="noopener">Código no GitHub</a>
    </div>
  </div>
  <div class="small">Baseado no projeto <a href="https://github.com/lezards/giba-steam-market" target="_blank" rel="noopener" style="display:inline">giba-steam-market</a> (MIT). Os valores são estimativas a partir de dados públicos da Steam e podem variar.</div>
</div></footer>

<div id="pixModal" class="modal hidden">
  <div class="modal-box">
    <button id="pixClose" class="modal-x" aria-label="fechar">×</button>
    <h3 style="margin:0 0 4px">Apoiar via Pix ☕</h3>
    <p class="muted" style="margin:0 0 12px">Escaneie o QR no app do banco, ou copie o código.</p>
    <img src="/pix-qr.svg" alt="QR Code Pix" class="pix-qr">
    <div class="pix-copy"><code id="pixCode"></code></div>
    <button id="pixCopyBtn" class="btn">Copiar código Pix</button>
  </div>
</div>
<div id="itemModal" class="modal hidden">
  <div class="modal-box modal-wide">
    <button id="itemClose" class="modal-x" aria-label="fechar">×</button>
    <div class="idet-head">
      <img id="idetIcon" class="idet-icon" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" style="display:none">
      <div style="flex:1"><div id="idetName" class="idet-name"></div><div id="idetType" class="muted" style="font-size:13px"></div></div>
      <div style="display:flex;flex-direction:column;gap:4px;font-size:13px;text-align:right"><a id="idetPage" class="hidden" href="#">página do item →</a><a id="idetLink" href="#" target="_blank" rel="noopener">ver na Steam ↗</a></div>
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
