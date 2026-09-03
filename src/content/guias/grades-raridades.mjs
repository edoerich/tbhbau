export default {
  slug: 'grades-raridades',
  title: 'Grades e raridades do TBH: o que valoriza cada item',
  short: 'Grades e raridades do TBH',
  description: 'Entenda as grades (raridades) do TBH: Task Bar Hero, a diferença entre materiais e equipamentos, e o que faz um item valer mais ou menos no Mercado da Steam.',
  summary: 'As grades de raridade, materiais vs equipamentos, e os fatores de demanda e oferta que realmente movem o preço no mercado.',
  date: '2026-07-26',
  body: `
<p class="lead">Por que dois itens do mesmo tipo podem valer preços tão diferentes? A resposta está na grade, no nível e na demanda. Este guia explica o que realmente move o preço no Mercado Steam.</p>
<h2>O que é a "grade" de um item</h2>
<p>No TBH, cada item tem uma <b>grade</b> (também chamada de raridade), que indica o quão poderoso e incomum ele é. Quanto mais alta a grade, mais raro tende a ser o item e, em geral, maior o valor. Nos itens negociáveis na Steam, as grades que aparecem são estas, ordenadas pelo preço mediano observado no mercado:</p>
<table>
  <tr><th>Grade</th><th>Como aparece no nome</th><th>Preço típico</th></tr>
  <tr><td>Lendária</td><td>(Legendary)</td><td>centavos</td></tr>
  <tr><td>Imortal</td><td>(Immortal)</td><td>centavos</td></tr>
  <tr><td>Arcana</td><td>(Arcana)</td><td>centavos a poucos reais</td></tr>
  <tr><td>Beyond</td><td>(Beyond)</td><td>menos de R$ 1 até dezenas de reais</td></tr>
  <tr><td>Celestial</td><td>(Celestial)</td><td>alguns reais até centenas</td></tr>
  <tr><td>Divina</td><td>(Divine)</td><td>dezenas a mais de mil reais</td></tr>
  <tr><td>Cósmica</td><td>(Cosmic)</td><td>as mais caras do jogo</td></tr>
</table>
<p>Atenção: <b>grade alta nem sempre significa preço alto</b>. Um item topo de linha que quase ninguém quer pode valer menos que um material comum de altíssima demanda. A raridade é só um dos fatores. Na <a href="/itens/">lista de itens</a> dá pra ver o preço mediano de cada grade com os dados atuais.</p>
<h2>Materiais vs equipamentos</h2>
<p>Os itens negociáveis do TBH se dividem, na prática, em dois grupos:</p>
<h3>Materiais</h3>
<p>São recursos com nome próprio (como gemas, minérios e componentes). Costumam ter <b>preço baixo por unidade</b>, mas <b>volume e liquidez altíssimos</b>: milhares são negociados por dia. Vender materiais é rápido e fácil, e no conjunto eles somam um bom valor.</p>
<h3>Equipamentos</h3>
<p>São peças como armas, armaduras e acessórios, identificadas por tipo, grade e nível (por exemplo, <code>Immortal - Lv. 60</code>). Podem valer <b>bem mais por unidade</b>, mas costumam ter <b>menos compradores</b>, então a liquidez é menor e a venda pode demorar.</p>
{{AD}}
<h2>O que realmente move o preço</h2>
<p>Além da grade, três fatores pesam bastante:</p>
<ul>
  <li><b>Demanda:</b> o item é usado em builds populares, receitas de crafting ou eventos? Alta demanda sustenta o preço.</li>
  <li><b>Oferta:</b> se o item cai fácil no jogo, o mercado enche e o preço cai. Itens escassos seguram valor.</li>
  <li><b>Nível e tipo (para equipamentos):</b> a mesma arma em nível mais alto costuma valer mais, e certos tipos são mais procurados.</li>
</ul>
<div class="tip">💡 Um item só é <b>negociável na Steam</b> se o próprio jogo o marca como comercializável. Muitos itens de grade baixa não podem ir para o Mercado. No avaliador, eles aparecem separados como "sem mercado".</div>
<h2>Como ler o valor no mercado</h2>
<p>Ao abrir a página de um item no tbhbau, você vê os indicadores que resumem o valor: <b>menor venda</b> (o anúncio mais barato), <b>mediana</b> (um preço típico recente), <b>volume 24h</b> (quantos foram vendidos no dia), o <b>histórico</b> de preço e o <b>order book</b> completo, com todas as ordens de compra e venda por preço. Juntos, eles mostram não só quanto o item vale, mas quão fácil é vendê-lo.</p>
<p>Com isso em mãos, dá para decidir com clareza: os itens de <b>maior valor de venda imediata</b> merecem prioridade na sua janela de 4 itens a cada 8 horas, e é exatamente isso que o painel <b>“Top 4 pra lançar”</b> do <a href="/avaliador/">avaliador</a> calcula para você.</p>`,
};
