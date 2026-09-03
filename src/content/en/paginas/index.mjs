// Institutional pages (EN). key pairs each page with its PT counterpart (ROUTES).
export default [
  {
    key: 'about', slug: 'about', title: 'About tbhbau', nav: 'About',
    description: 'What tbhbau is, who makes it, where the TBH: Task Bar Hero Steam Market data comes from and how the site is maintained.',
    body: `
<p class="lead"><b>tbhbau</b> is an independent, free site about the <b>TBH: Task Bar Hero</b> economy on the Steam Community Market: prices, history, liquidity and tools for anyone who wants to know what their stash is worth and sell better.</p>
<h2>What you will find here</h2>
<ul>
  <li><b><a href="{{market}}">Market</a>:</b> every tradable TBH item with lowest ask, median, instant sell, volume and liquidity, updated continuously.</li>
  <li><b><a href="{{items}}">Items</a>:</b> a page for every item, with price history, live order book and related items; and a page per type (helmets, swords, materials...).</li>
  <li><b><a href="{{evaluator}}">Stash evaluator</a>:</b> upload your game save and see your stash value item by item, with the best 4 to list in the next window. The save is read only in your browser.</li>
  <li><b><a href="{{guides}}">Guides</a>:</b> how to sell, listing vs instant sell, grades and rarities.</li>
  <li><b><a href="{{bulletin}}">Bulletin</a>:</b> a weekly summary of the market: gains, drops, most traded and best sells.</li>
</ul>
<h2>Where the data comes from</h2>
<p>Prices come from the public endpoints of the Steam Community Market. A service of ours queries Steam in a gentle rotation, respecting its limits, and keeps a consolidated copy of the data that every visitor uses. Each item is revisited roughly every 30 minutes, and the price history is recorded by us from those readings. Values are <b>not real-time</b>: always check on Steam before selling.</p>
<p>Listing prices are shown in US dollars (US store) and Brazilian reais (Brazil store, Steam's regional pricing, not a currency conversion). Instant sell, median and history come from the Brazil-region order book, which is the one we track, so they are in BRL.</p>
<h2>Who makes it</h2>
<p>tbhbau is made by <b>edelrich</b>, a TBH player, as a personal project. The code is open source on <a href="https://github.com/edoerich/tbhbau" target="_blank" rel="noopener">GitHub</a>, based on the <a href="https://github.com/lezards/giba-steam-market" target="_blank" rel="noopener">giba-steam-market</a> project (MIT license). The site is supported by unobtrusive ads and donations.</p>
<h2>Independence</h2>
<p>tbhbau is not affiliated with Valve/Steam or the developers of TBH: Task Bar Hero. Item names and images belong to their respective owners and are used only to identify the items.</p>
<p>Get in touch through the <a href="{{contact}}">contact</a> page.</p>`,
  },
  {
    key: 'contact', slug: 'contact', title: 'Contact', nav: 'Contact',
    description: 'Contact tbhbau: suggestions, data corrections, partnerships and questions about the site.',
    body: `
<p class="lead">Found a wrong price, a missing item, have a suggestion or want to talk about the site? Write to us.</p>
<div class="card" style="max-width:520px">
  <p style="margin:0 0 6px"><b>E-mail:</b> <a href="mailto:contato@tbhbau.com.br">contato@tbhbau.com.br</a></p>
  <p style="margin:0 0 6px"><b>Code and issues:</b> <a href="https://github.com/edoerich/tbhbau/issues" target="_blank" rel="noopener">github.com/edoerich/tbhbau</a></p>
  <p style="margin:0" class="muted">We usually reply within a few days. This is not official support for the game or for Steam. Portuguese and English are fine.</p>
</div>
<h2>Before writing</h2>
<ul>
  <li><b>Price differs from Steam:</b> data is updated every ~30 minutes per item. A small, momentary difference is expected. If it persists for hours, let us know the item name.</li>
  <li><b>Item missing from the evaluator:</b> only items tradable on Steam have a price. Items without a market are listed separately.</li>
  <li><b>Save won't load:</b> make sure it is the TBH <code>SaveFile_Live.es3</code> file. The file never leaves your computer, so we cannot see it; describe the error shown on screen.</li>
</ul>
<p>Like the site? You can <a href="#" data-pix>support it via Pix</a> (Brazilian instant payment). Thank you!</p>`,
  },
  {
    key: 'terms', slug: 'terms', title: 'Terms of use', nav: 'Terms',
    description: 'Terms of use for tbhbau.com.br: informational nature of the data, disclaimer and usage rules.',
    body: `
<p class="muted">Last updated: September 3, 2026</p>
<h2>1. The service</h2>
<p>tbhbau.com.br ("the site") publishes information about prices and trading of items from the game TBH: Task Bar Hero on the Steam Community Market and offers a free stash evaluation tool. Use of the site is free of charge.</p>
<h2>2. Nature of the information</h2>
<p>All values shown are <b>estimates</b> obtained from public Steam data, updated periodically and subject to delay and error. The site does not guarantee the accuracy, availability or timeliness of the data. Buying and selling decisions are entirely the user's responsibility. The site is not a broker and does not intermediate transactions.</p>
<h2>3. Evaluation tool</h2>
<p>The save file loaded into the evaluator is processed only in the user's browser and is not sent to the site. The tool only reads the file and does not change the game or the save. Use is at the user's own risk.</p>
<h2>4. Intellectual property</h2>
<p>TBH: Task Bar Hero, Steam and the item names and images belong to their respective owners. The site is not affiliated with Valve or the game's developers. The site's code is open source under the MIT license; the site's original texts may be quoted with a link to the source.</p>
<h2>5. Acceptable use</h2>
<p>Using the site for illegal activities, overloading the infrastructure (aggressive scraping, attacks) or attempting to obtain other users' data is prohibited. We may limit access in case of abuse.</p>
<h2>6. Ads and third parties</h2>
<p>The site displays third-party ads (Google AdSense) and contains external links. We are not responsible for the content or practices of those third parties. See the <a href="{{privacy}}">privacy policy</a>.</p>
<h2>7. Changes</h2>
<p>These terms may change at any time; the current version is always the one published on this page. Questions: <a href="{{contact}}">contact</a>.</p>`,
  },
  {
    key: 'privacy', slug: 'privacy', title: 'Privacy Policy', nav: 'Privacy',
    description: 'Privacy policy for tbhbau.com.br: the save is processed only in the browser, no sign-up, and use of Google AdSense advertising cookies.',
    body: `
<p class="muted">Last updated: September 3, 2026 · site: <code>tbhbau.com.br</code></p>
<p><b>tbhbau.com.br</b> publishes information about the Steam Market of the game <b>TBH: Task Bar Hero</b> and offers a free tool that estimates the value of your stash. This page explains how your data is (or is not) handled.</p>
<h2>1. Your save file</h2>
<p>The <code>SaveFile_Live.es3</code> file you load into the evaluator is read and processed <b>entirely in your browser</b>. It is <b>never sent to or shared</b> with any server, ours or third parties'.</p>
<p>For convenience, the save is kept <b>only in your browser's local storage</b> (on your own device), so it reloads automatically when you come back. You can remove it at any time with the <b>"remove"</b> button in the evaluator or by clearing your browser data.</p>
<h2>2. Personal data</h2>
<p>We do not require sign-up or login and do not collect personally identifiable data (name, e-mail, etc.) to use the site. We do not sell or share user data. Preferences such as currency and language are stored only in your browser.</p>
<h2>3. Market prices</h2>
<p>The prices shown come from a price file we update periodically from public Steam Market endpoints. That file is the same for every visitor and contains nothing of yours.</p>
<h2>4. Cookies and ads (Google AdSense)</h2>
<p>This site displays ads through <b>Google AdSense</b>. For that, Google and its partners may use cookies and identifiers to show ads based on your visits to this and other sites.</p>
<ul>
  <li>Google uses the <code>DART</code> cookie and similar technologies to personalize ads.</li>
  <li>You can opt out of personalized advertising in <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google's Ads Settings</a>.</li>
  <li>Learn more at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">How Google uses cookies in advertising</a>.</li>
  <li>For third-party options, see <a href="https://www.aboutads.info" target="_blank" rel="noopener">aboutads.info</a>.</li>
</ul>
<h2>5. Data protection</h2>
<p>In line with Brazil's LGPD and similar regulations, since we do not collect personally identifiable data, there is no data processing to request access to or deletion of regarding the tool. Advertising cookies are the responsibility of Google AdSense, under the policies above.</p>
<h2>6. Disclaimer</h2>
<p>Values are estimates based on public Steam data and may vary. This site is not affiliated with Valve/Steam or the developers of TBH: Task Bar Hero. It is based on the open source project <a href="https://github.com/lezards/giba-steam-market" target="_blank" rel="noopener">giba-steam-market</a> (MIT license).</p>
<h2>7. Contact</h2>
<p>Questions about this policy: <a href="mailto:contato@tbhbau.com.br">contato@tbhbau.com.br</a>.</p>`,
  },
];
