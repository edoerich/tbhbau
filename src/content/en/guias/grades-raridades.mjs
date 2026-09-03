export default {
  id: 'grades-raridades', slug: 'grades-and-rarities',
  title: 'TBH grades and rarities: what makes each item valuable',
  short: 'TBH grades and rarities',
  description: 'Understand the grades (rarities) in TBH: Task Bar Hero, the difference between materials and equipment, and what makes an item worth more or less on the Steam Market.',
  summary: 'The rarity grades, materials vs equipment, and the supply and demand factors that really move prices on the market.',
  date: '2026-07-26',
  body: `
<p class="lead">Why can two items of the same type have such different prices? The answer lies in grade, level and demand. This guide explains what really moves prices on the Steam Market.</p>
<h2>What an item's "grade" is</h2>
<p>In TBH, every item has a <b>grade</b> (also called rarity) that indicates how powerful and uncommon it is. The higher the grade, the rarer the item tends to be and, in general, the higher its value. Among items tradable on Steam, these are the grades, ordered by the median price observed on the market:</p>
<table>
  <tr><th>Grade</th><th>In the item name</th><th>Typical price</th></tr>
  <tr><td>Legendary</td><td>(Legendary)</td><td>cents</td></tr>
  <tr><td>Immortal</td><td>(Immortal)</td><td>cents</td></tr>
  <tr><td>Arcana</td><td>(Arcana)</td><td>cents to a few dollars</td></tr>
  <tr><td>Beyond</td><td>(Beyond)</td><td>under a dollar up to tens of dollars</td></tr>
  <tr><td>Celestial</td><td>(Celestial)</td><td>a few dollars up to hundreds</td></tr>
  <tr><td>Divine</td><td>(Divine)</td><td>tens to hundreds of dollars</td></tr>
  <tr><td>Cosmic</td><td>(Cosmic)</td><td>the most expensive in the game</td></tr>
</table>
<p>Careful: <b>a high grade does not always mean a high price</b>. A top-tier item almost nobody wants can be worth less than a common material in very high demand. Rarity is only one factor. The <a href="{{items}}">items index</a> shows the current median price of each grade.</p>
<h2>Materials vs equipment</h2>
<p>In practice, tradable TBH items fall into two groups:</p>
<h3>Materials</h3>
<p>Resources with their own names (gems, ores, components). They usually have a <b>low unit price</b> but <b>very high volume and liquidity</b>: thousands are traded per day. Selling materials is fast and easy, and together they add up to a good amount.</p>
<h3>Equipment</h3>
<p>Pieces like weapons, armor and accessories, identified by type, grade and level (for example, <code>Immortal - Lv. 60</code>). They can be worth <b>much more per unit</b>, but usually have <b>fewer buyers</b>, so liquidity is lower and the sale can take longer.</p>
{{AD}}
<h2>What really moves the price</h2>
<p>Beyond grade, three factors weigh heavily:</p>
<ul>
  <li><b>Demand:</b> is the item used in popular builds, crafting recipes or events? High demand supports the price.</li>
  <li><b>Supply:</b> if the item drops easily in the game, the market floods and the price falls. Scarce items hold value.</li>
  <li><b>Level and type (for equipment):</b> the same weapon at a higher level is usually worth more, and certain types are more sought after.</li>
</ul>
<div class="tip">💡 An item is only <b>tradable on Steam</b> if the game itself flags it as marketable. Many low-grade items cannot go to the Market. In the evaluator, they are listed separately as "no market".</div>
<h2>How to read value on the market</h2>
<p>When you open an item page on tbhbau, you see the indicators that summarize its value: <b>lowest ask</b> (the cheapest listing), <b>median</b> (a typical recent price), <b>24h volume</b> (how many sold that day), the price <b>history</b> and the full <b>order book</b>, with every buy and sell order by price. Together they show not only what the item is worth, but how easy it is to sell.</p>
<p>With that in hand, the decision is clear: items with the <b>highest instant sell</b> deserve priority in your 4-items-every-8-hours window, and that is exactly what the <b>“Top 4 to list”</b> panel in the <a href="{{evaluator}}">evaluator</a> computes for you.</p>`,
};
