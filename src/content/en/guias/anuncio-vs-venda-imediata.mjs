export default {
  id: 'anuncio-vs-venda-imediata', slug: 'listing-vs-instant-sell',
  title: 'Listing vs instant sell: which strategy is best?',
  short: 'Listing vs instant sell',
  description: 'Understand the difference between the listing (lowest ask) and the instant sell (highest buy order) on the TBH Steam Market, what spread and liquidity are, and when to wait or sell right away.',
  summary: 'The difference between the listing price and the highest buy order, what spread and liquidity mean, and when it pays to wait or to sell instantly.',
  date: '2026-07-26',
  body: `
<p class="lead">They are two different prices for the same item, and picking the right one changes how much (and how fast) you get paid. This guide explains the difference simply and shows when each one pays off.</p>
<h2>The two sides of the market</h2>
<p>Every item on the Steam Market has <b>two prices</b> at the same time, because two sides are trading:</p>
<ul>
  <li><b>Listing (lowest ask):</b> the cheapest price someone is <b>asking</b> to sell for. If you list near that value, you join the queue and sell when your turn comes.</li>
  <li><b>Instant sell (highest buy order / best bid):</b> the highest price someone is <b>offering</b> to buy right now. If you accept it, the sale is immediate.</li>
</ul>
<p>The listing is almost always <b>higher</b> than the instant sell. That difference has a name.</p>
<h2>Spread: the distance between the two</h2>
<p>The <b>spread</b> is the gap between the lowest sell listing and the highest buy order. It is usually shown as an amount and as a percentage. A real example from a cheap item:</p>
<table>
  <tr><th>Indicator</th><th>Value</th></tr>
  <tr><td>Lowest ask (listing)</td><td>R$ 0.05</td></tr>
  <tr><td>Highest bid (instant sell)</td><td>R$ 0.04</td></tr>
  <tr><td>Spread</td><td>R$ 0.01 (about 22%)</td></tr>
</table>
<p>A wide spread means selling instantly costs a lot relative to listing. A narrow spread means the two sides are close, so selling instantly "hurts" very little.</p>
{{AD}}
<h2>Liquidity: can you sell fast?</h2>
<p>A pretty price is useless if nobody is buying. <b>Liquidity</b> measures how many active buy orders exist for that item. Items with many orders (high liquidity) sell instantly with no effort. Items with few or no orders can take days to sell, even when listed cheaply.</p>
<div class="tip">On tbhbau, every item shows its <b>liquidity</b> (high, medium, low or none) and the number of buy orders. Popular materials usually have very high liquidity; rare equipment, much less. See it in the <a href="{{market}}">market explorer</a>.</div>
<h2>When to list and when to sell instantly</h2>
<table>
  <tr><th>Situation</th><th>Best choice</th></tr>
  <tr><td>You want the money now</td><td>Instant sell</td></tr>
  <tr><td>Narrow spread (small difference)</td><td>Instant sell (you lose almost nothing)</td></tr>
  <tr><td>Expensive item with a wide spread</td><td>List and wait</td></tr>
  <tr><td>Low liquidity</td><td>List and be patient</td></tr>
  <tr><td>Several identical items to move</td><td>Mix: some instantly, some listed</td></tr>
</table>
<p>A good rule: for <b>low-value, high-liquidity</b> items (most materials), selling instantly is practical and the loss is minimal. For <b>expensive items</b>, compare the spread and consider listing, since the difference in money can be meaningful.</p>
<h2>How tbhbau helps</h2>
<p>When you upload your save to the <a href="{{evaluator}}">evaluator</a>, it shows, for each item, the listing price and the instant sell side by side, plus liquidity. The <b>“Top 4 to list”</b> panel ranks your stash items by instant sell, so you make the most of the 4-items-every-8-hours window with what pays the most right now. And remember the <b>~13% Steam fee</b> when computing your net.</p>`,
};
