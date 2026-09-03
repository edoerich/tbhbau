import { page, breadcrumb } from '../layout.mjs';

export function render(ctx) {
  const bc = breadcrumb([['/', 'Início'], [null, 'Avaliador de baú']]);
  const body = `
${bc.html}
<h1 data-i18n="h1">Avaliador de baú</h1>
<p class="lead" data-i18n-html="sub">Suba seu <code>SaveFile_Live.es3</code> e veja o valor do seu baú no Mercado Steam. <b>O save é lido 100% no seu navegador; nada é enviado pra nenhum servidor.</b></p>

<div id="drop">
  <div data-i18n-html="drop_main">Arraste o <b>SaveFile_Live.es3</b> aqui, ou <b>clique para escolher</b></div>
  <small><span data-i18n="drop_path_pre">O save fica em:</span> <code id="savePath">%USERPROFILE%\\AppData\\LocalLow\\TesseractStudio\\TaskbarHero</code></small>
  <div><button id="copyPath" class="copybtn" type="button" data-i18n="copy_path">📋 copiar caminho</button></div>
  <span class="badge" data-i18n="drop_badge">🔒 processado localmente · read-only</span>
</div>
<input id="file" type="file" accept=".es3" class="hidden">
<div id="loadedBar" class="loaded-bar hidden">
  <span>✓ <span data-i18n="loaded_pre">Save carregado:</span> <b id="loadedName"></b></span>
  <button id="removeSave" class="linkbtn" type="button" data-i18n="remove_save">🗑️ remover</button>
</div>
<div id="status" class="note hidden"></div>

<section id="result" class="hidden">
  <div class="stats" id="summary"></div>
  <div id="disclaimer" class="disclaimer hidden"></div>
  <div id="top4" class="top4 hidden"></div>
  <div class="controls">
    <input id="q" type="search" data-i18n-ph="q_ph" placeholder="filtrar item…">
    <span class="muted" id="count"></span>
  </div>
  <div class="tablewrap"><table id="tbl">
    <thead><tr>
      <th></th><th data-s="name" data-i18n="th_item">Item</th><th data-s="kind" data-i18n="th_kind">Tipo</th>
      <th class="num" data-s="qty" data-i18n="th_qty">Qtd</th>
      <th class="num" data-s="listing" data-i18n="th_listing">Anúncio un.</th>
      <th class="num" data-s="instant" data-i18n="th_instant">Venda imediata (R$)</th>
      <th data-s="buyCount" data-i18n="th_liq">Liquidez</th>
      <th class="num" data-s="subtotal" data-i18n="th_subtotal">Subtotal anúncio</th>
    </tr></thead>
    <tbody></tbody>
  </table></div>
  <div id="extra"></div>
</section>

<section id="intro" class="prose">
  <h2 data-i18n="how_h">Como funciona</h2>
  <ol data-i18n-html="how_p">
    <li>Abra o jogo pelo menos uma vez para gerar o save (<code>SaveFile_Live.es3</code>).</li>
    <li>Arraste o arquivo para a área acima (ou clique para escolher).</li>
    <li>O site decifra o save no seu navegador e cruza os itens com uma cópia atualizada dos preços do Mercado Steam.</li>
    <li>Veja o valor total, item a item, e o painel <b>Top 4 pra lançar</b> com as vendas imediatas mais lucrativas para a sua próxima janela de 4 itens a cada 8 horas.</li>
  </ol>
  <p data-i18n-html="how_extra">Cada linha da tabela abre o detalhe do item, com order book ao vivo e histórico de preço. Os preços de anúncio podem ser vistos em R$ ou US$ pelo seletor da barra; a venda imediata é sempre em R$, porque vem do order book da região Brasil.</p>
  <h2 data-i18n="priv_h">Privacidade</h2>
  <p data-i18n-html="priv_p">Seu save é lido e decifrado <b>100% no navegador</b> (Web Crypto). Nunca é enviado a nenhum servidor; fica guardado só no seu navegador para recarregar quando você volta, e dá pra remover no botão "remover". O projeto é de código aberto e apenas <b>lê</b> o arquivo: não altera o save nem o jogo. Veja a <a href="/privacidade/">política de privacidade</a>.</p>
  <p data-i18n-html="priv_more">Quer entender os números antes de vender? Leia <a href="/guias/como-vender/">como vender itens do TBH na Steam</a> e <a href="/guias/anuncio-vs-venda-imediata/">anúncio vs venda imediata</a>.</p>
</section>`;

  return [{ path: 'avaliador/index.html', sitemap: { priority: 0.9, changefreq: 'weekly' }, html: page({
    path: '/avaliador/', active: '/avaliador/', updatedAt: ctx.updatedAt, langToggle: true, jsonld: [bc.ld,
      { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Avaliador de baú do TBH', url: 'https://tbhbau.com.br/avaliador/', applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' } }],
    scripts: ['/assets/avaliador.js'],
    title: 'Avaliador de baú do TBH: valor do seu save no Mercado Steam · tbhbau',
    description: 'Suba o save do TBH: Task Bar Hero e veja o valor do seu baú no Mercado Steam em reais e dólar, a venda imediata e os 4 melhores itens pra lançar. Lido só no navegador.',
    body }) }];
}
