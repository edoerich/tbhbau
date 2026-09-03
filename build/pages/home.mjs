import { page } from '../layout.mjs';
import { esc, moneyBrl, fmtQty, fmtInt, fmtPct, fmtDateLong } from '../lib.mjs';
import { hlBlock, faq, itemLink } from '../ui.mjs';

export function render(ctx) {
  const { items, guias } = ctx;
  const priced = items.filter(i => i.lowestBrl > 0);
  const valuable = [...priced].sort((a, b) => b.lowestBrl - a.lowestBrl).slice(0, 6);
  const traded = items.filter(i => i.vol > 0).sort((a, b) => b.vol - a.vol).slice(0, 6);
  const toSell = items.filter(i => i.buyCents && i.buyCount).sort((a, b) => b.buyCents - a.buyCents).slice(0, 6);
  const movers = items.filter(i => i.d7 != null && i.vol >= 3 && i.lowestBrl >= 20);
  const ups = [...movers].sort((a, b) => b.d7 - a.d7).slice(0, 6);
  const downs = [...movers].sort((a, b) => a.d7 - b.d7).slice(0, 6);
  const volTotal = items.reduce((a, i) => a + i.vol, 0);

  const side = `<div class="side">
    <div class="k">O mercado hoje · ${fmtDateLong(ctx.now)}</div>
    <div class="row"><span>Itens negociáveis acompanhados</span><span class="v">${fmtInt(items.length)}</span></div>
    <div class="row"><span>Unidades negociadas nas últimas 24h</span><span class="v">${fmtInt(volTotal)}</span></div>
    ${valuable[0] ? `<div class="row"><span>Mais valioso: ${itemLink(ctx, valuable[0], { icon: false })}</span><span class="v">${moneyBrl(valuable[0].lowestBrl)}</span></div>` : ''}
    ${traded[0] ? `<div class="row"><span>Mais negociado: ${itemLink(ctx, traded[0], { icon: false })}</span><span class="v">${fmtQty(traded[0].vol)}/24h</span></div>` : ''}
    ${ups[0] ? `<div class="row"><span>Maior alta em 7 dias: ${itemLink(ctx, ups[0], { icon: false })}</span><span class="v">${fmtPct(ups[0].d7)}</span></div>` : ''}
    ${downs[0] && downs[0].d7 < 0 ? `<div class="row"><span>Maior queda em 7 dias: ${itemLink(ctx, downs[0], { icon: false })}</span><span class="v down">${fmtPct(downs[0].d7)}</span></div>` : ''}
    <div style="margin-top:10px;font-size:13px"><a href="/boletim/">Ler o boletim da semana →</a></div>
  </div>`;

  const qas = [
    ['O que é o tbhbau?', 'Um site independente sobre a economia do TBH: Task Bar Hero no Mercado Steam: preços de todos os itens negociáveis, histórico, liquidez, guias e um avaliador de baú gratuito.'],
    ['Os preços são em tempo real?', 'Não. Cada item é revisitado a cada 30 minutos, aproximadamente. Confira sempre o valor na Steam antes de vender.'],
    ['Por que a venda imediata é menor que o anúncio?', 'O anúncio é o preço de quem está <i>vendendo</i> (você entraria na fila). A venda imediata é a maior ordem de <i>compra</i> ativa: o valor que você recebe vendendo na hora.'],
    ['Os valores descontam a taxa da Steam?', 'Os preços mostrados são os do Mercado. A Steam cobra cerca de 13% sobre a venda (5% Steam + 10% do jogo); o avaliador e as páginas de item mostram também o valor líquido.'],
    ['Meu save é enviado para algum servidor?', 'Não. No avaliador, o save é decifrado e lido só no seu navegador, e fica guardado apenas nele. Você pode removê-lo quando quiser.'],
    ['De onde vêm os preços em reais?', 'São os preços regionais da Steam para o Brasil, lidos diretamente do Mercado, não uma conversão de dólar por câmbio.'],
  ];
  const f = faq(qas);

  const body = `
<section class="hero">
  <div>
    <h1>O Mercado Steam do TBH: Task Bar Hero, explicado</h1>
    <p class="lead">Preço, histórico e liquidez de <b>${fmtInt(items.length)} itens</b> negociáveis, atualizados o dia inteiro. Guias para vender melhor e um avaliador que diz quanto vale o seu baú, sem enviar o save pra lugar nenhum.</p>
    <div class="ctas"><a class="btn" href="/avaliador/">Avaliar meu baú</a><a class="btn ghost" href="/mercado/">Explorar o mercado</a></div>
  </div>
  ${side}
</section>

<h2>Destaques de hoje</h2>
<div class="grid c3">
  ${hlBlock(ctx, '💎 Mais valiosos', valuable, i => moneyBrl(i.lowestBrl))}
  ${hlBlock(ctx, '🔥 Mais negociados (24h)', traded, i => fmtQty(i.vol))}
  ${hlBlock(ctx, '⚡ Melhores pra vender agora', toSell, i => moneyBrl(i.buyCents))}
  ${hlBlock(ctx, '📈 Maiores altas (7 dias)', ups.filter(i => i.d7 > 0), i => fmtPct(i.d7))}
  ${hlBlock(ctx, '📉 Maiores quedas (7 dias)', downs.filter(i => i.d7 < 0), i => fmtPct(i.d7), { cls: 'down' })}
</div>
<p class="muted" style="font-size:13px;margin-top:8px">Valores em R$ (menor venda). Clique num item para ver o histórico completo, o order book ao vivo e os itens relacionados. Todos os itens no <a href="/mercado/">explorador do mercado</a> e no <a href="/itens/">índice por tipo</a>.</p>

<h2>Guias</h2>
<div class="grid c3">
  ${guias.map(g => `<a class="card" href="/guias/${g.slug}/"><h3>${esc(g.short)}</h3><p>${esc(g.summary)}</p></a>`).join('')}
</div>

<h2>Como funciona o avaliador</h2>
<div class="grid c3 steps">
  <div class="card"><h3>Abra o jogo uma vez</h3><p>Isso gera o arquivo <code>SaveFile_Live.es3</code> na pasta do TBH no seu computador.</p></div>
  <div class="card"><h3>Arraste o save no avaliador</h3><p>O arquivo é decifrado e lido no seu navegador. Nada é enviado a nenhum servidor.</p></div>
  <div class="card"><h3>Veja o valor e os 4 melhores</h3><p>Valor total em R$ e US$, venda imediata, líquido após taxa e o painel Top 4 pra lançar na próxima janela de 8 horas.</p></div>
</div>
<p style="margin-top:12px"><a class="btn" href="/avaliador/">Ir para o avaliador</a></p>

<h2>Perguntas frequentes</h2>
${f.html}
<p class="muted" style="margin-top:20px;font-size:14px">O tbhbau é um projeto independente, sem vínculo com a Valve/Steam ou com os desenvolvedores do TBH. <a href="/sobre/">Saiba mais sobre o site</a>.</p>`;

  const ld = [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'tbhbau', url: 'https://tbhbau.com.br/', description: 'Preços, histórico e ferramentas do Mercado Steam para TBH: Task Bar Hero.', inLanguage: 'pt-BR' }, f.ld];
  return [{ path: 'index.html', sitemap: { priority: 1.0, changefreq: 'daily' }, html: page({
    path: '/', active: '/', updatedAt: ctx.updatedAt, jsonld: ld,
    title: 'tbhbau · Preços e mercado do TBH: Task Bar Hero na Steam',
    description: `Preços, histórico e liquidez de ${items.length} itens do TBH: Task Bar Hero no Mercado Steam, guias para vender melhor e um avaliador gratuito do valor do seu baú.`,
    body }) }];
}
