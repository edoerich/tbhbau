import { page, breadcrumb } from '../layout.mjs';
import { moneyBrl, fmtQty, fmtInt, fmtPct, fmtDateTime } from '../lib.mjs';
import { hlBlock, itemsTable, cta } from '../ui.mjs';

export function render(ctx) {
  const { items } = ctx;
  const bc = breadcrumb([['/', 'Início'], [null, 'Mercado']]);
  const priced = items.filter(i => i.lowestBrl > 0);
  const valuable = [...priced].sort((a, b) => b.lowestBrl - a.lowestBrl).slice(0, 6);
  const traded = items.filter(i => i.vol > 0).sort((a, b) => b.vol - a.vol).slice(0, 6);
  const toSell = items.filter(i => i.buyCents && i.buyCount).sort((a, b) => b.buyCents - a.buyCents).slice(0, 6);
  const liquid = items.filter(i => i.buyCount > 0).sort((a, b) => b.buyCount - a.buyCount).slice(0, 6);
  const movers = items.filter(i => i.d7 != null && i.vol >= 3 && i.lowestBrl >= 20);
  const ups = [...movers].sort((a, b) => b.d7 - a.d7).slice(0, 6).filter(i => i.d7 > 0);
  const downs = [...movers].sort((a, b) => a.d7 - b.d7).slice(0, 6).filter(i => i.d7 < 0);
  const withVol = items.filter(i => i.vol > 0).length;
  const volTotal = items.reduce((a, i) => a + i.vol, 0);
  const cheap = priced.filter(i => i.lowestBrl < 100).length;

  const rows = [...items].sort((a, b) => (b.lowestBrl ?? -1) - (a.lowestBrl ?? -1));
  const body = `
${bc.html}
<h1>Mercado do TBH na Steam</h1>
<p class="lead">Todos os <b>${fmtInt(items.length)} itens</b> negociáveis do TBH: Task Bar Hero no Mercado da Comunidade Steam, com menor venda, mediana, venda imediata, volume e liquidez. Clique no nome para abrir a página do item, com histórico e order book ao vivo.</p>
<p class="updated">Atualizado em ${fmtDateTime(ctx.updatedAt)}. Cada item é revisitado a cada ~30 minutos; não é tempo real.</p>

<div class="grid c3" style="margin-top:18px">
  ${hlBlock(ctx, '💎 Mais valiosos', valuable, i => moneyBrl(i.lowestBrl))}
  ${hlBlock(ctx, '🔥 Mais negociados (24h)', traded, i => fmtQty(i.vol))}
  ${hlBlock(ctx, '⚡ Melhores pra vender agora', toSell, i => moneyBrl(i.buyCents))}
  ${hlBlock(ctx, '💧 Mais líquidos (ordens de compra)', liquid, i => fmtInt(i.buyCount))}
  ${hlBlock(ctx, '📈 Maiores altas (7 dias)', ups, i => fmtPct(i.d7))}
  ${hlBlock(ctx, '📉 Maiores quedas (7 dias)', downs, i => fmtPct(i.d7), { cls: 'down' })}
</div>

<h2>Panorama</h2>
<p>Dos ${fmtInt(items.length)} itens acompanhados, ${fmtInt(withVol)} tiveram pelo menos uma venda nas últimas 24 horas, somando ${fmtInt(volTotal)} unidades negociadas. ${fmtInt(cheap)} itens custam menos de R$ 1,00, o que é típico dos materiais e dos equipamentos de grade baixa; na outra ponta, os equipamentos de grade Cósmica e Divina concentram os maiores preços. ${valuable[0] ? `O item mais caro do momento é <a href="${ctx.itemUrl(valuable[0])}">${valuable[0].name}</a>, anunciado a partir de ${moneyBrl(valuable[0].lowestBrl)}.` : ''}</p>
<p>Para entender as colunas: <b>menor venda</b> é o anúncio mais barato; <b>mediana</b> é um preço típico recente; <b>venda imediata</b> é a maior ordem de compra ativa (o que você recebe vendendo na hora); <b>liquidez</b> é a quantidade de ordens de compra. Mais detalhes em <a href="/guias/anuncio-vs-venda-imediata/">anúncio vs venda imediata</a>.</p>

<h2>Todos os itens</h2>
<div class="controls">
  <input id="mktSearch" type="search" placeholder="buscar item no mercado…">
  <span class="muted" id="mktCount">${items.length} itens</span>
  <span class="muted" style="font-size:12.5px">clique no cabeçalho para ordenar</span>
</div>
${itemsTable(ctx, rows, { sort: 'lowest', filter: '#mktSearch', count: '#mktCount', id: 'mktTbl' })}
${cta()}`;

  return [{ path: 'mercado/index.html', sitemap: { priority: 0.9, changefreq: 'daily' }, html: page({
    path: '/mercado/', active: '/mercado/', updatedAt: ctx.updatedAt, jsonld: [bc.ld],
    title: `Mercado do TBH na Steam: preços de ${items.length} itens · tbhbau`,
    description: `Tabela completa dos ${items.length} itens negociáveis do TBH: Task Bar Hero no Mercado Steam: menor venda, mediana, venda imediata, volume 24h, liquidez e variação em 7 dias.`,
    body }) }];
}
