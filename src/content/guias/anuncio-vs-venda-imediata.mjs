export default {
  slug: 'anuncio-vs-venda-imediata',
  title: 'Anúncio vs venda imediata: qual a melhor estratégia?',
  short: 'Anúncio vs venda imediata',
  description: 'Entenda a diferença entre o anúncio (menor venda) e a venda imediata (maior ordem de compra) no Mercado Steam do TBH, o que são spread e liquidez, e quando vale esperar ou vender na hora.',
  summary: 'A diferença entre o preço de anúncio e a maior ordem de compra, o que são spread e liquidez, e quando vale esperar ou vender na hora.',
  date: '2026-07-26',
  body: `
<p class="lead">São dois preços diferentes para o mesmo item, e escolher o certo muda quanto (e quão rápido) você recebe. Este guia explica a diferença de forma simples e mostra quando cada um compensa.</p>
<h2>Os dois lados do mercado</h2>
<p>Todo item no Mercado Steam tem <b>dois preços</b> ao mesmo tempo, porque existem duas pontas negociando:</p>
<ul>
  <li><b>Anúncio (menor venda / lowest ask):</b> o preço mais barato que alguém está <b>pedindo</b> para vender. Se você anunciar por perto desse valor, entra na fila e vende quando chegar a sua vez.</li>
  <li><b>Venda imediata (maior ordem de compra / best bid):</b> o preço mais alto que alguém está <b>oferecendo</b> para comprar agora. Se você aceitar, a venda é instantânea.</li>
</ul>
<p>Quase sempre o anúncio é <b>mais alto</b> que a venda imediata. Essa diferença tem nome.</p>
<h2>Spread: a distância entre os dois</h2>
<p>O <b>spread</b> é a diferença entre o menor anúncio de venda e a maior ordem de compra. Ele costuma ser mostrado em valor e em porcentagem. Um exemplo real de item barato:</p>
<table>
  <tr><th>Indicador</th><th>Valor</th></tr>
  <tr><td>Menor venda (anúncio)</td><td>R$ 0,05</td></tr>
  <tr><td>Maior compra (venda imediata)</td><td>R$ 0,04</td></tr>
  <tr><td>Spread</td><td>R$ 0,01 (cerca de 22%)</td></tr>
</table>
<p>Um spread grande significa que vender na hora custa caro em relação ao anúncio. Um spread pequeno significa que as duas pontas estão próximas, então vender na hora "dói" pouco.</p>
{{AD}}
<h2>Liquidez: dá pra vender rápido?</h2>
<p>De nada adianta um preço bonito se ninguém está comprando. A <b>liquidez</b> mede quantas ordens de compra ativas existem para aquele item. Itens com muitas ordens (liquidez alta) vendem na hora sem esforço. Itens com poucas ou nenhuma ordem podem levar dias para vender, mesmo anunciados barato.</p>
<div class="tip">No tbhbau, cada item mostra a <b>liquidez</b> (alta, média, baixa ou nenhuma) e o número de ordens de compra. Materiais populares costumam ter liquidez altíssima; equipamentos raros, bem menos. Veja no <a href="/mercado/">explorador do mercado</a>.</div>
<h2>Quando anunciar e quando vender na hora</h2>
<table>
  <tr><th>Situação</th><th>Melhor escolha</th></tr>
  <tr><td>Quer o dinheiro agora</td><td>Venda imediata</td></tr>
  <tr><td>Spread pequeno (pouca diferença)</td><td>Venda imediata (perde quase nada)</td></tr>
  <tr><td>Item caro com spread grande</td><td>Anunciar e esperar</td></tr>
  <tr><td>Liquidez baixa</td><td>Anunciar com paciência</td></tr>
  <tr><td>Vários itens iguais para escoar</td><td>Misturar: alguns na hora, outros anunciados</td></tr>
</table>
<p>Uma boa regra: para itens de <b>baixo valor e alta liquidez</b> (a maioria dos materiais), vender na hora é prático e o prejuízo é mínimo. Para <b>itens caros</b>, vale comparar o spread e considerar anunciar, já que a diferença em reais pode ser relevante.</p>
<h2>Como o tbhbau ajuda</h2>
<p>Ao subir seu save no <a href="/avaliador/">avaliador</a>, você vê, para cada item, o preço de anúncio e o de venda imediata lado a lado, além da liquidez. O painel <b>“Top 4 pra lançar”</b> já ranqueia os itens do seu baú pela venda imediata, então você aproveita a janela de 4 itens a cada 8 horas com o que rende mais na hora. E lembre da <b>taxa da Steam de ~13%</b> ao calcular o líquido.</p>`,
};
