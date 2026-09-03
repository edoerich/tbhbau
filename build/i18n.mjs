// Internacionalização do build: strings PT/EN, rotas por idioma e formatadores por locale.
// Cada gerador recebe ctx.i = mk(L) e usa i.t('chave', ...args), i.money(), i.fmtInt(), i.route('market') etc.
import { RARITY_PT, TYPE_PT, moneyBrl, money as moneyRaw, esc, netCents } from './lib.mjs';

export const LANGS = ['pt', 'en'];
export const HTML_LANG = { pt: 'pt-BR', en: 'en' };
export const LOCALE = { pt: 'pt-BR', en: 'en-US' };

export const ROUTES = {
  pt: { home: '/', market: '/mercado/', items: '/itens/', type: '/tipo/', item: '/item/', evaluator: '/avaliador/', guides: '/guias/', bulletin: '/boletim/', about: '/sobre/', contact: '/contato/', terms: '/termos/', privacy: '/privacidade/' },
  en: { home: '/en/', market: '/en/market/', items: '/en/items/', type: '/en/type/', item: '/en/item/', evaluator: '/en/evaluator/', guides: '/en/guides/', bulletin: '/en/bulletin/', about: '/en/about/', contact: '/en/contact/', terms: '/en/terms/', privacy: '/en/privacy/' },
};

// [singular, plural]
export const TYPE_EN = {
  Helmet: ['Helmet', 'Helmets'], Gloves: ['Gloves', 'Gloves'], Shield: ['Shield', 'Shields'], Armor: ['Armor', 'Armor'], Arrow: ['Arrow', 'Arrows'], Boots: ['Boots', 'Boots'],
  Staff: ['Staff', 'Staves'], Orb: ['Orb', 'Orbs'], Bracer: ['Bracer', 'Bracers'], Amulet: ['Amulet', 'Amulets'], Ring: ['Ring', 'Rings'], Earing: ['Earring', 'Earrings'],
  Bow: ['Bow', 'Bows'], Bolt: ['Bolt', 'Bolts'], Hatchet: ['Hatchet', 'Hatchets'], Crossbow: ['Crossbow', 'Crossbows'], Axe: ['Axe', 'Axes'], Scepter: ['Scepter', 'Scepters'],
  Sword: ['Sword', 'Swords'], Tome: ['Tome', 'Tomes'],
  'Decoration Material': ['Decoration material', 'Decoration materials'], 'Crafting Material': ['Crafting material', 'Crafting materials'],
  'Offering Material': ['Offering material', 'Offering materials'], 'Inscription Material': ['Inscription material', 'Inscription materials'],
  'Engraving Material': ['Engraving material', 'Engraving materials'], Soulstone: ['Soulstone', 'Soulstones'],
};
const LIQ = { pt: { alta: 'alta', media: 'média', baixa: 'baixa', nenhuma: 'nenhuma' }, en: { alta: 'high', media: 'medium', baixa: 'low', nenhuma: 'none' } };

const STR = {
  pt: {
    // layout
    nav_home: 'Início', nav_market: 'Mercado', nav_items: 'Itens', nav_evaluator: 'Avaliador', nav_guides: 'Guias', nav_bulletin: 'Boletim',
    ad_label: 'Publicidade', crumb_aria: 'Você está em', menu: 'menu',
    foot_about: 'Preços, histórico e ferramentas do Mercado Steam para <b>TBH: Task Bar Hero</b>. Feito por <b>edelrich</b>. Conteúdo informativo, sem vínculo oficial com a Valve/Steam ou com os desenvolvedores do TBH.',
    foot_updated: (u, g) => `Dados do Mercado Steam atualizados em ${u}. Página gerada em ${g}.`,
    foot_nav: 'Navegar', foot_site: 'Sobre o site', foot_about_link: 'Sobre', foot_contact: 'Contato', foot_privacy: 'Privacidade', foot_terms: 'Termos de uso', foot_pix: '☕ Apoiar via Pix', foot_github: 'Código no GitHub',
    foot_based: 'Baseado no projeto <a href="https://github.com/lezards/giba-steam-market" target="_blank" rel="noopener" style="display:inline">giba-steam-market</a> (MIT). Os valores são estimativas a partir de dados públicos da Steam e podem variar.',
    pix_title: 'Apoiar via Pix ☕', pix_desc: 'Escaneie o QR no app do banco, ou copie o código.', pix_copy: 'Copiar código Pix', pix_alt: 'QR Code Pix',
    modal_page: 'página do item →', modal_steam: 'ver na Steam ↗', close: 'fechar',
    chip_title: 'Seu save fica só no seu navegador', cur_title: 'Moeda dos preços de anúncio', lang_title: 'Idioma / Language',
    lang_suggest: url => `This site is also available in English. <a href="${url}">Switch to English →</a>`,
    // ui
    th_item: 'Item', th_type: 'Tipo', th_grade: 'Grade', th_lvl: 'Nível', th_lowest: 'Menor venda', th_median: 'Mediana', th_buy: 'Venda imediata', th_vol: 'Volume 24h', th_spread: 'Spread', th_liq: 'Liquidez', th_d7: '7 dias',
    no_order: 'sem ordem', grade_material: 'Material', grade_of: r => `Grade ${r}`, lvl: n => `Lv. ${n}`, items_n: n => `${n} itens`,
    cta_title: 'Quanto vale o seu baú?', cta_desc: 'Suba o save do TBH e veja o valor item a item, com os 4 melhores para lançar. O arquivo é lido só no seu navegador.', cta_btn: 'Avaliar meu baú',
    sort_hint: 'clique no cabeçalho para ordenar', filter_ph: 'filtrar…',
    // home
    home_title: 'tbhbau · Preços e mercado do TBH: Task Bar Hero na Steam',
    home_desc: n => `Preços, histórico e liquidez de ${n} itens do TBH: Task Bar Hero no Mercado Steam, guias para vender melhor e um avaliador gratuito do valor do seu baú.`,
    home_h1: 'O Mercado Steam do TBH: Task Bar Hero, explicado',
    home_lead: n => `Preço, histórico e liquidez de <b>${n} itens</b> negociáveis, atualizados o dia inteiro. Guias para vender melhor e um avaliador que diz quanto vale o seu baú, sem enviar o save pra lugar nenhum.`,
    home_cta_eval: 'Avaliar meu baú', home_cta_market: 'Explorar o mercado',
    side_title: d => `O mercado hoje · ${d}`, side_items: 'Itens negociáveis acompanhados', side_units: 'Unidades negociadas nas últimas 24h',
    side_top: l => `Mais valioso: ${l}`, side_traded: l => `Mais negociado: ${l}`, side_up: l => `Maior alta em 7 dias: ${l}`, side_down: l => `Maior queda em 7 dias: ${l}`, side_bulletin: 'Ler o boletim da semana →',
    h_highlights: 'Destaques de hoje', hl_valuable: '💎 Mais valiosos', hl_traded: '🔥 Mais negociados (24h)', hl_sell: '⚡ Melhores pra vender agora', hl_ups: '📈 Maiores altas (7 dias)', hl_downs: '📉 Maiores quedas (7 dias)', hl_liquid: '💧 Mais líquidos (ordens de compra)',
    hl_note: (m, i) => `Valores em R$ (menor venda). Clique num item para ver o histórico completo, o order book ao vivo e os itens relacionados. Todos os itens no <a href="${m}">explorador do mercado</a> e no <a href="${i}">índice por tipo</a>.`,
    h_guides: 'Guias', h_how: 'Como funciona o avaliador',
    steps: [['Abra o jogo uma vez', 'Isso gera o arquivo <code>SaveFile_Live.es3</code> na pasta do TBH no seu computador.'], ['Arraste o save no avaliador', 'O arquivo é decifrado e lido no seu navegador. Nada é enviado a nenhum servidor.'], ['Veja o valor e os 4 melhores', 'Valor total em R$ e US$, venda imediata, líquido após taxa e o painel Top 4 pra lançar na próxima janela de 8 horas.']],
    go_eval: 'Ir para o avaliador', h_faq: 'Perguntas frequentes',
    faq: [
      ['O que é o tbhbau?', 'Um site independente sobre a economia do TBH: Task Bar Hero no Mercado Steam: preços de todos os itens negociáveis, histórico, liquidez, guias e um avaliador de baú gratuito.'],
      ['Os preços são em tempo real?', 'Não. Cada item é revisitado a cada 30 minutos, aproximadamente. Confira sempre o valor na Steam antes de vender.'],
      ['Por que a venda imediata é menor que o anúncio?', 'O anúncio é o preço de quem está <i>vendendo</i> (você entraria na fila). A venda imediata é a maior ordem de <i>compra</i> ativa: o valor que você recebe vendendo na hora.'],
      ['Os valores descontam a taxa da Steam?', 'Os preços mostrados são os do Mercado. A Steam cobra cerca de 13% sobre a venda (5% Steam + 10% do jogo); o avaliador e as páginas de item mostram também o valor líquido.'],
      ['Meu save é enviado para algum servidor?', 'Não. No avaliador, o save é decifrado e lido só no seu navegador, e fica guardado apenas nele. Você pode removê-lo quando quiser.'],
      ['De onde vêm os preços em reais?', 'São os preços regionais da Steam para o Brasil, lidos diretamente do Mercado, não uma conversão de dólar por câmbio.'],
    ],
    about_note: a => `O tbhbau é um projeto independente, sem vínculo com a Valve/Steam ou com os desenvolvedores do TBH. <a href="${a}">Saiba mais sobre o site</a>.`,
    site_desc: 'Preços, histórico e ferramentas do Mercado Steam para TBH: Task Bar Hero.',
    // mercado
    mkt_title: n => `Mercado do TBH na Steam: preços de ${n} itens · tbhbau`,
    mkt_desc: n => `Tabela completa dos ${n} itens negociáveis do TBH: Task Bar Hero no Mercado Steam: menor venda, mediana, venda imediata, volume 24h, liquidez e variação em 7 dias.`,
    mkt_h1: 'Mercado do TBH na Steam',
    mkt_lead: n => `Todos os <b>${n} itens</b> negociáveis do TBH: Task Bar Hero no Mercado da Comunidade Steam, com menor venda, mediana, venda imediata, volume e liquidez. Clique no nome para abrir a página do item, com histórico e order book ao vivo.`,
    mkt_updated: d => `Atualizado em ${d}. Cada item é revisitado a cada ~30 minutos; não é tempo real.`,
    h_panorama: 'Panorama',
    panorama: o => `Dos ${o.n} itens acompanhados, ${o.withVol} tiveram pelo menos uma venda nas últimas 24 horas, somando ${o.volTotal} unidades negociadas. ${o.cheap} itens custam menos de R$ 1,00, o que é típico dos materiais e dos equipamentos de grade baixa; na outra ponta, os equipamentos de grade Cósmica e Divina concentram os maiores preços. ${o.top ? `O item mais caro do momento é ${o.top}, anunciado a partir de ${o.topPrice}.` : ''}`,
    columns_note: g => `Para entender as colunas: <b>menor venda</b> é o anúncio mais barato; <b>mediana</b> é um preço típico recente; <b>venda imediata</b> é a maior ordem de compra ativa (o que você recebe vendendo na hora); <b>liquidez</b> é a quantidade de ordens de compra. Mais detalhes em <a href="${g}">anúncio vs venda imediata</a>.`,
    h_all_items: 'Todos os itens', mkt_search_ph: 'buscar item no mercado…',
    // itens / tipo
    items_title: 'Todos os itens do TBH negociáveis na Steam, por tipo e grade · tbhbau',
    items_desc: n => `Índice dos ${n} itens do TBH: Task Bar Hero com mercado na Steam, organizados por tipo (elmos, espadas, materiais...) e por grade, com preço mediano de cada grade.`,
    items_h1: 'Itens do TBH negociáveis na Steam',
    items_lead: n => `${n} itens com mercado, organizados por tipo e por grade. Cada item tem uma página com preço atual, histórico, order book ao vivo e itens relacionados.`,
    items_search_ph: 'buscar item pelo nome…', items_search_hint: 'digite para ver os resultados',
    h_by_type: 'Por tipo', type_card: (n, lo, hi) => `${n} itens${lo ? ` · de ${lo} a ${hi}` : ''}`,
    h_by_grade: 'Por grade',
    grade_intro: g => `A grade aparece entre parênteses no nome do item, por exemplo <code>(Divine)</code>. A tabela abaixo mostra quantos itens de cada grade têm mercado, o preço mediano atual e os níveis em que a grade existe. Entenda o que valoriza cada item no guia de <a href="${g}">grades e raridades</a>.`,
    th_items: 'Itens', th_median_price: 'Preço mediano', th_levels: 'Níveis', th_top: 'Mais caro',
    h_materials: 'Materiais',
    materials_p: n => `${n} materiais (decoração, criação, gravação, inscrição, oferenda e pedras da alma) não têm grade nem nível. Costumam ser baratos por unidade, mas giram muito volume e vendem na hora. Veja os mais negociados:`,
    hl_mat_traded: '🔥 Materiais mais negociados (24h)', hl_mat_expensive: '💎 Materiais mais caros',
    type_title: pl => `${pl} do TBH no Mercado Steam: preços e liquidez · tbhbau`,
    type_desc: (n, pl, med) => `${n} ${pl.toLowerCase()} do TBH: Task Bar Hero com mercado na Steam: menor venda, mediana, venda imediata, volume e liquidez${med ? `, preço mediano ${med}` : ''}.`,
    type_h1: pl => `${pl} do TBH no Mercado Steam`,
    type_intro_mat: (n, pl, vol) => `Há ${n} ${pl.toLowerCase()} do TBH: Task Bar Hero negociáveis no Mercado Steam. São recursos sem grade nem nível, usados dentro do jogo, e costumam vender rápido: nas últimas 24 horas foram ${vol} unidades negociadas neste grupo.`,
    type_intro_eq: o => `Há ${o.n} ${o.pl.toLowerCase()} do TBH: Task Bar Hero negociáveis no Mercado Steam, em ${o.ng} grades (${o.grades}) e níveis de ${o.lo} a ${o.hi}. ${o.f ? 'A' : 'O'} mesm${o.f ? 'a' : 'o'} ${o.sg.toLowerCase()} em grade e nível mais altos costuma valer bem mais, mas com menos compradores.`,
    type_price_line: o => `O preço mediano do grupo é ${o.med}. ${o.top ? `${o.f ? 'A' : 'O'} mais car${o.f ? 'a' : 'o'} é ${o.top}, a partir de ${o.topPrice}` : ''}${o.cheap ? `, e ${o.f ? 'a' : 'o'} mais barat${o.f ? 'a' : 'o'} é ${o.cheap}, por ${o.cheapPrice}` : ''}. ${o.traded ? `${o.f ? 'A' : 'O'} mais negociad${o.f ? 'a' : 'o'} nas últimas 24 horas foi ${o.traded}, com ${o.tradedVol} unidades.` : ''}`,
    type_h_all: n => `Todos os itens (${n})`, h_other_types: 'Outros tipos',
    // item
    item_title: name => `${name}: preço no Mercado Steam (TBH) · tbhbau`,
    item_desc_mat: o => `${o.name}: material do TBH: Task Bar Hero no Mercado Steam. Menor venda ${o.price}${o.buy ? `, venda imediata ${o.buy}` : ''}${o.vol ? `, ${o.vol} vendidos em 24h` : ''}. Histórico de preço, order book e liquidez.`,
    item_desc_eq: o => `${o.name}: ${o.type.toLowerCase()} ${o.rarity} nível ${o.lvl} do TBH no Mercado Steam. Menor venda ${o.price}${o.buy ? `, venda imediata ${o.buy}` : ''}${o.vol ? `, ${o.vol} vendidos em 24h` : ''}. Histórico de preço, order book e itens relacionados.`,
    item_meta_eq: (r, typeLink, lvl) => `Grade ${r} · ${typeLink} · Nível ${lvl}`,
    k_lowest: 'Menor venda', s_lowest: 'anúncio mais barato', k_median: 'Mediana', s_median: 'preço típico recente', k_buy: 'Venda imediata', s_buy: 'maior ordem de compra', live: '· ao vivo',
    k_net: 'Você recebe (líquido)', s_net: 'após taxa ~13%', k_liq: 'Liquidez', s_liq: l => `ordens de compra · ${l}`, k_vol: 'Volume 24h', s_vol: 'unidades vendidas', k_spread: 'Spread', s_spread: 'anúncio − venda imediata', k_d7: '7 dias', s_d30: p => `30 dias: ${p}`, s_d7: 'variação da menor venda',
    item_updated: d => `Dados atualizados em ${d}. A venda imediata, a liquidez e o order book abaixo são consultados ao vivo quando a página abre.`,
    h_price: 'Preço e mercado', h_history: 'Histórico de preço', chart_title: 'Histórico — menor venda (R$), últimos 30 dias', chart_meta: (n, d) => `${n} pontos · desde ${d}`,
    chart_empty: '📈 Coletando histórico… o gráfico aparece conforme os preços forem registrados.', chart_alt: 'Histórico de menor venda em reais',
    h_ob: 'Order book ao vivo', ob_note: 'Ordens de compra e venda por preço, direto da Steam (região Brasil). Barras mostram a quantidade em cada nível.', ob_loading: 'carregando order book…',
    h_how_sell: f => `Como vender ${f ? 'esta' : 'este'} item`,
    read_also: (a, b, c) => `Leia também: <a href="${a}">como vender itens do TBH na Steam</a> · <a href="${b}">anúncio vs venda imediata</a> · <a href="${c}">grades e raridades</a>.`,
    rel_family: f => `Mesma família: ${f}`, rel_same: (pl, r, lvl) => `${pl} ${r} Lv. ${lvl}`, rel_top: pl => `${pl} mais valiosos`,
    tools: 'Ferramentas', tool_eval: 'Quanto vale o meu baú?', tool_market: 'Explorar o mercado', tool_all: pl => `Todos os ${pl.toLowerCase()}`, tool_bulletin: 'Boletim da semana',
    prose: (it, o) => {
      const p = [];
      let s1 = it.isMaterial
        ? `<b>${o.name}</b> é um ${o.type.toLowerCase()} do TBH: Task Bar Hero, um recurso usado dentro do jogo que também pode ser enviado para o inventário Steam e vendido no Mercado da Comunidade.`
        : `<b>${o.name}</b> é ${o.f ? 'uma' : 'um'} ${o.type.toLowerCase()} de nível ${it.lvl} e grade <b>${o.rarity}</b> do TBH: Task Bar Hero, negociável no Mercado da Comunidade Steam.`;
      if (it.lowestBrl != null) s1 += ` No momento, a menor venda (o anúncio mais barato) está em <b>${o.brl}</b>${o.usd ? ` (${o.usd} na loja em dólar)` : ''}${o.median ? `, com mediana recente de ${o.median}.` : '.'}`;
      else if (o.usd) s1 += ` No momento, a menor venda está em ${o.usd} na loja em dólar; o preço em reais ainda não foi lido.`;
      p.push(s1);
      let s2 = '';
      if (o.hasBuy) {
        s2 = `Existem <b>${o.buyCount} ordens de compra</b> ativas (liquidez ${o.liq}). A maior paga <b>${o.buy}</b>: é a <b>venda imediata</b>, o que você recebe vendendo agora, sem esperar. Descontada a taxa da Steam de cerca de 13%, sobram aproximadamente <b>${o.net}</b> líquidos por unidade.`;
        if (o.spread) s2 += ` O spread entre anúncio e venda imediata é de ${o.spread} (${o.spreadPct}%)${o.spreadN > 25 ? ', alto: se puder esperar, anunciar tende a render mais' : o.spreadN < 8 ? ', pequeno: vender na hora custa pouco' : ''}.`;
      } else s2 = 'No momento não há ordens de compra ativas, então não existe venda imediata: quem quiser vender precisa anunciar e aguardar um comprador.';
      s2 += it.vol > 0 ? ` Nas últimas 24 horas foram negociadas <b>${o.vol} unidades</b>.` : ' Não houve vendas registradas nas últimas 24 horas.';
      p.push(s2);
      if (o.h) {
        let s3 = `Acompanhamos este item desde ${o.first}, com ${o.n} leituras de preço.`;
        if (o.d7 != null) s3 += ` Nos últimos 7 dias a menor venda ${o.d7 >= 0 ? 'subiu' : 'caiu'} <b>${o.d7abs}</b> (de ${o.ask7} para ${o.brl}), oscilando entre ${o.min7} e ${o.max7}.`;
        if (o.d30 != null) s3 += ` Em 30 dias a variação foi de <b>${o.d30s}</b>, com mínima de ${o.min30} e máxima de ${o.max30}${o.volAvg ? `, e média de ${o.volAvg} unidades vendidas por dia` : ''}.`;
        p.push(s3);
      } else p.push('Começamos a registrar o histórico deste item há pouco tempo; o gráfico aparece conforme as leituras se acumulam.');
      return p;
    },
    tips: (it, o) => {
      const li = [];
      if (o.hasBuy) {
        if (o.spreadN != null && o.spreadN < 10) li.push('O spread é pequeno: <b>vender na hora</b> (bater na ordem de compra) perde pouco em relação ao anúncio e resolve na hora.');
        else li.push('Se não tiver pressa, <b>anuncie perto da menor venda</b> e espere; a venda imediata paga menos. Se quiser o dinheiro agora, aceite a maior ordem de compra.');
        if (it.buyCount >= 500) li.push('Liquidez alta: há muitas ordens de compra, então vender rápido é fácil mesmo em quantidade.');
        else if (it.buyCount < 50) li.push('Liquidez baixa: poucas ordens de compra. Vendendo várias unidades de uma vez, o preço da venda imediata cai rápido.');
      } else li.push('Sem ordens de compra no momento: anuncie um pouco abaixo da menor venda e tenha paciência.');
      if (it.lowestBrl != null && it.lowestBrl >= 1000) li.push('Item de valor: confira o order book ao vivo e a taxa de ~13% antes de decidir. Em itens caros, a diferença em reais entre anunciar e vender na hora pesa.');
      li.push(`Lembre da mecânica do TBH: só <b>4 itens a cada 8 horas</b> saem do jogo para a Steam. Priorize os de maior venda imediata na sua janela; o <a href="${o.evalUrl}">avaliador</a> calcula isso pelo seu save.`);
      return li;
    },
    // boletim
    bul_title: w => `Boletim do mercado do TBH: altas, quedas e melhores vendas (${w}) · tbhbau`,
    bul_desc: 'Resumo da semana no Mercado Steam do TBH: Task Bar Hero: maiores altas e quedas em 7 dias, itens mais negociados, melhores vendas imediatas e mais valiosos, com dados atualizados.',
    bul_h1: 'Boletim do mercado do TBH', bul_crumb: 'Boletim do mercado',
    bul_lead: w => `Semana de ${w}. O que subiu, o que caiu, o que mais girou e o que vale mais a pena vender agora no Mercado Steam do TBH: Task Bar Hero, a partir dos dados que coletamos continuamente.`,
    bul_generated: (d, n) => `Gerado automaticamente com dados de ${d}${n ? ` e histórico de ${n} itens` : ''}. Regerado diariamente.`,
    h_summary: 'Resumo',
    bul_s1: o => `Dos ${o.n} itens acompanhados, ${o.withVol} registraram vendas nas últimas 24 horas, num total de ${o.volTotal} unidades, e ${o.withBuy} têm pelo menos uma ordem de compra ativa. ${o.topTypes ? `Os tipos que mais giraram foram ${o.topTypes}.` : ''}`,
    bul_s2: o => `Entre os ${o.movers} itens com preço acima de R$ 0,20 e vendas recentes, ${o.upsN} subiram e ${o.downsN} caíram em relação a 7 dias atrás. ${o.up ? `A maior alta foi de ${o.up} (${o.upPct}, agora a ${o.upPrice})` : ''}${o.down ? `${o.up ? ' e a maior queda, de' : 'A maior queda foi de'} ${o.down} (${o.downPct}, a ${o.downPrice})` : ''}.`,
    bul_s2_none: 'As variações de 7 dias aparecem assim que o histórico acumular uma semana de leituras.',
    bul_s3: o => `Para quem quer vender na hora, a melhor venda imediata com liquidez razoável é ${o.link}, pagando ${o.buy} (cerca de ${o.net} líquidos após a taxa). Lembre que o TBH libera apenas 4 itens a cada 8 horas para a Steam: use o <a href="${o.evalUrl}">avaliador</a> para ranquear os do seu baú.`,
    h_ups: '📈 Maiores altas em 7 dias', ups_note: 'Itens com menor venda a partir de R$ 0,20 e pelo menos 3 vendas em 24h, para tirar ruído de itens sem mercado.',
    h_downs: '📉 Maiores quedas em 7 dias', h_traded: '🔥 Mais negociados nas últimas 24 horas', h_sell: '⚡ Melhores para vender agora', sell_note: 'Maior ordem de compra ativa, entre itens com pelo menos 10 ordens.', h_valuable: '💎 Mais valiosos',
    bul_read: (a, b, m) => `Como ler estes números: <a href="${a}">anúncio vs venda imediata</a> · <a href="${b}">grades e raridades</a>. Todos os itens no <a href="${m}">mercado</a>.`,
    empty_list: 'Ainda não há dados suficientes para esta lista.', th_net: 'Líquido',
    // guias
    guides_title: 'Guias do TBH: vender no Mercado Steam, estratégias e raridades · tbhbau',
    guides_desc: 'Guias práticos sobre o TBH: Task Bar Hero e o Mercado da Steam: como vender itens, anúncio vs venda imediata, grades e raridades, taxa da Steam e a janela de 4 itens a cada 8 horas.',
    guides_h1: 'Guias do TBH e do Mercado Steam', guides_lead: 'Tudo o que você precisa para entender e aproveitar ao máximo o valor do seu baú no <b>TBH: Task Bar Hero</b>.',
    h_guide_data: 'Dados que acompanham os guias',
    guide_data_p: (m, i, b) => `Os guias usam os mesmos números do resto do site: o <a href="${m}">mercado completo</a>, as <a href="${i}">páginas de cada item</a> com histórico e order book, e o <a href="${b}">boletim semanal</a> com altas, quedas e melhores vendas.`,
    by: (a, d) => `Por ${a} · ${d}`, h_read_also: 'Leia também',
    // avaliador
    ev_title: 'Avaliador de baú do TBH: valor do seu save no Mercado Steam · tbhbau',
    ev_desc: 'Suba o save do TBH: Task Bar Hero e veja o valor do seu baú no Mercado Steam em reais e dólar, a venda imediata e os 4 melhores itens pra lançar. Lido só no navegador.',
    ev_crumb: 'Avaliador de baú', ev_h1: 'Avaliador de baú',
    ev_sub: 'Suba seu <code>SaveFile_Live.es3</code> e veja o valor do seu baú no Mercado Steam. <b>O save é lido 100% no seu navegador; nada é enviado pra nenhum servidor.</b>',
    ev_drop: 'Arraste o <b>SaveFile_Live.es3</b> aqui, ou <b>clique para escolher</b>', ev_path_pre: 'O save fica em:', ev_copy: '📋 copiar caminho', ev_badge: '🔒 processado localmente · read-only',
    ev_loaded: 'Save carregado:', ev_remove: '🗑️ remover', ev_q_ph: 'filtrar item…',
    ev_th: ['Item', 'Tipo', 'Qtd', 'Anúncio un.', 'Venda imediata (R$)', 'Liquidez', 'Subtotal anúncio'],
    ev_how_h: 'Como funciona',
    ev_how_p: '<li>Abra o jogo pelo menos uma vez para gerar o save (<code>SaveFile_Live.es3</code>).</li><li>Arraste o arquivo para a área acima (ou clique para escolher).</li><li>O site decifra o save no seu navegador e cruza os itens com uma cópia atualizada dos preços do Mercado Steam.</li><li>Veja o valor total, item a item, e o painel <b>Top 4 pra lançar</b> com as vendas imediatas mais lucrativas para a sua próxima janela de 4 itens a cada 8 horas.</li>',
    ev_how_extra: 'Cada linha da tabela abre o detalhe do item, com order book ao vivo e histórico de preço. Os preços de anúncio podem ser vistos em R$ ou US$ pelo seletor da barra; a venda imediata é sempre em R$, porque vem do order book da região Brasil.',
    ev_priv_h: 'Privacidade',
    ev_priv_p: p => `Seu save é lido e decifrado <b>100% no navegador</b> (Web Crypto). Nunca é enviado a nenhum servidor; fica guardado só no seu navegador para recarregar quando você volta, e dá pra remover no botão "remover". O projeto é de código aberto e apenas <b>lê</b> o arquivo: não altera o save nem o jogo. Veja a <a href="${p}">política de privacidade</a>.`,
    ev_priv_more: (a, b) => `Quer entender os números antes de vender? Leia <a href="${a}">como vender itens do TBH na Steam</a> e <a href="${b}">anúncio vs venda imediata</a>.`,
    ev_app_name: 'Avaliador de baú do TBH',
  },
  en: {
    nav_home: 'Home', nav_market: 'Market', nav_items: 'Items', nav_evaluator: 'Evaluator', nav_guides: 'Guides', nav_bulletin: 'Bulletin',
    ad_label: 'Advertisement', crumb_aria: 'You are here', menu: 'menu',
    foot_about: 'Prices, history and tools for the <b>TBH: Task Bar Hero</b> Steam Market. Made by <b>edelrich</b>. Informational content, not affiliated with Valve/Steam or the TBH developers.',
    foot_updated: (u, g) => `Steam Market data updated ${u}. Page generated ${g}.`,
    foot_nav: 'Browse', foot_site: 'About the site', foot_about_link: 'About', foot_contact: 'Contact', foot_privacy: 'Privacy', foot_terms: 'Terms of use', foot_pix: '☕ Support via Pix', foot_github: 'Code on GitHub',
    foot_based: 'Based on the <a href="https://github.com/lezards/giba-steam-market" target="_blank" rel="noopener" style="display:inline">giba-steam-market</a> project (MIT). Values are estimates from public Steam data and may vary.',
    pix_title: 'Support via Pix ☕', pix_desc: 'Pix is a Brazilian instant payment system. Scan the QR in your bank app, or copy the code.', pix_copy: 'Copy Pix code', pix_alt: 'Pix QR Code',
    modal_page: 'item page →', modal_steam: 'view on Steam ↗', close: 'close',
    chip_title: 'Your save stays in your browser only', cur_title: 'Currency for listing prices', lang_title: 'Language / Idioma',
    lang_suggest: url => `Este site também existe em português. <a href="${url}">Ver em português →</a>`,
    th_item: 'Item', th_type: 'Type', th_grade: 'Grade', th_lvl: 'Level', th_lowest: 'Lowest ask', th_median: 'Median', th_buy: 'Instant sell', th_vol: '24h volume', th_spread: 'Spread', th_liq: 'Liquidity', th_d7: '7 days',
    no_order: 'no order', grade_material: 'Material', grade_of: r => `${r} grade`, lvl: n => `Lv. ${n}`, items_n: n => `${n} items`,
    cta_title: 'How much is your stash worth?', cta_desc: 'Upload your TBH save and see the value item by item, with the best 4 to list. The file is read only in your browser.', cta_btn: 'Evaluate my stash',
    sort_hint: 'click a header to sort', filter_ph: 'filter…',
    home_title: 'tbhbau · TBH: Task Bar Hero Steam Market prices',
    home_desc: n => `Prices, history and liquidity for ${n} TBH: Task Bar Hero items on the Steam Market, guides to sell better and a free evaluator for your stash value.`,
    home_h1: 'The TBH: Task Bar Hero Steam Market, explained',
    home_lead: n => `Price, history and liquidity for <b>${n} tradable items</b>, updated all day long. Guides to sell better and an evaluator that tells you what your stash is worth, without sending your save anywhere.`,
    home_cta_eval: 'Evaluate my stash', home_cta_market: 'Explore the market',
    side_title: d => `The market today · ${d}`, side_items: 'Tradable items tracked', side_units: 'Units traded in the last 24h',
    side_top: l => `Most valuable: ${l}`, side_traded: l => `Most traded: ${l}`, side_up: l => `Biggest 7-day gain: ${l}`, side_down: l => `Biggest 7-day drop: ${l}`, side_bulletin: 'Read this week\'s bulletin →',
    h_highlights: 'Today\'s highlights', hl_valuable: '💎 Most valuable', hl_traded: '🔥 Most traded (24h)', hl_sell: '⚡ Best to sell right now', hl_ups: '📈 Biggest gains (7 days)', hl_downs: '📉 Biggest drops (7 days)', hl_liquid: '💧 Most liquid (buy orders)',
    hl_note: (m, i) => `Listing prices in US$ (switch to R$ in the top bar); instant sell values are in BRL, from the Brazil-region order book. Click an item for its full history, live order book and related items. All items in the <a href="${m}">market explorer</a> and in the <a href="${i}">index by type</a>.`,
    h_guides: 'Guides', h_how: 'How the evaluator works',
    steps: [['Open the game once', 'This creates the <code>SaveFile_Live.es3</code> file in the TBH folder on your computer.'], ['Drop the save on the evaluator', 'The file is decrypted and read in your browser. Nothing is sent to any server.'], ['See the value and the best 4', 'Total value in US$ and R$, instant sell, net after fees and the Top 4 panel for your next 8-hour window.']],
    go_eval: 'Go to the evaluator', h_faq: 'Frequently asked questions',
    faq: [
      ['What is tbhbau?', 'An independent site about the TBH: Task Bar Hero economy on the Steam Market: prices for every tradable item, history, liquidity, guides and a free stash evaluator.'],
      ['Are prices real-time?', 'No. Each item is revisited roughly every 30 minutes. Always check the value on Steam before selling.'],
      ['Why is instant sell lower than the listing?', 'The listing is the price of someone <i>selling</i> (you would join the queue). Instant sell is the highest active <i>buy</i> order: what you get by selling right now.'],
      ['Do values include the Steam fee?', 'Prices shown are Market prices. Steam takes about 13% on each sale (5% Steam + 10% game); the evaluator and item pages also show the net amount.'],
      ['Is my save uploaded to a server?', 'No. In the evaluator, the save is decrypted and read only in your browser and stored only there. You can remove it at any time.'],
      ['Why are some values in BRL?', 'Instant sell, median and history come from the Brazil-region order book, which we track directly. Listing prices are available in both US$ and R$; use the toggle in the top bar.'],
    ],
    about_note: a => `tbhbau is an independent project, not affiliated with Valve/Steam or the TBH developers. <a href="${a}">Learn more about the site</a>.`,
    site_desc: 'Prices, history and tools for the TBH: Task Bar Hero Steam Market.',
    mkt_title: n => `TBH Steam Market: prices for ${n} items · tbhbau`,
    mkt_desc: n => `Full table of the ${n} tradable TBH: Task Bar Hero items on the Steam Market: lowest ask, median, instant sell, 24h volume, liquidity and 7-day change.`,
    mkt_h1: 'TBH Steam Market',
    mkt_lead: n => `All <b>${n} tradable items</b> from TBH: Task Bar Hero on the Steam Community Market, with lowest ask, median, instant sell, volume and liquidity. Click a name to open the item page, with history and a live order book.`,
    mkt_updated: d => `Updated ${d}. Each item is revisited every ~30 minutes; not real-time.`,
    h_panorama: 'Overview',
    panorama: o => `Of the ${o.n} items tracked, ${o.withVol} had at least one sale in the last 24 hours, for a total of ${o.volTotal} units traded. ${o.cheap} items cost less than R$ 1.00 (about US$ 0.20), which is typical of materials and low-grade equipment; at the other end, Cosmic and Divine grade equipment holds the highest prices. ${o.top ? `The most expensive item right now is ${o.top}, listed from ${o.topPrice}.` : ''}`,
    columns_note: g => `Reading the columns: <b>lowest ask</b> is the cheapest listing; <b>median</b> is a typical recent price; <b>instant sell</b> is the highest active buy order (what you get selling right now); <b>liquidity</b> is the number of buy orders. More in <a href="${g}">listing vs instant sell</a>.`,
    h_all_items: 'All items', mkt_search_ph: 'search the market…',
    items_title: 'All tradable TBH items on Steam, by type and grade · tbhbau',
    items_desc: n => `Index of the ${n} TBH: Task Bar Hero items with a Steam market, organized by type (helmets, swords, materials...) and by grade, with the median price of each grade.`,
    items_h1: 'Tradable TBH items on Steam',
    items_lead: n => `${n} items with a market, organized by type and by grade. Every item has a page with current price, history, live order book and related items.`,
    items_search_ph: 'search item by name…', items_search_hint: 'type to see results',
    h_by_type: 'By type', type_card: (n, lo, hi) => `${n} items${lo ? ` · from ${lo} to ${hi}` : ''}`,
    h_by_grade: 'By grade',
    grade_intro: g => `The grade appears in parentheses in the item name, for example <code>(Divine)</code>. The table below shows how many items of each grade have a market, the current median price and the levels the grade exists in. Learn what drives item value in the <a href="${g}">grades and rarities</a> guide.`,
    th_items: 'Items', th_median_price: 'Median price', th_levels: 'Levels', th_top: 'Most expensive',
    h_materials: 'Materials',
    materials_p: n => `${n} materials (decoration, crafting, engraving, inscription, offering and soulstones) have no grade or level. They are usually cheap per unit but move a lot of volume and sell instantly. The most traded:`,
    hl_mat_traded: '🔥 Most traded materials (24h)', hl_mat_expensive: '💎 Most expensive materials',
    type_title: pl => `TBH ${pl} on the Steam Market: prices and liquidity · tbhbau`,
    type_desc: (n, pl, med) => `${n} TBH: Task Bar Hero ${pl.toLowerCase()} with a Steam market: lowest ask, median, instant sell, volume and liquidity${med ? `, median price ${med}` : ''}.`,
    type_h1: pl => `TBH ${pl} on the Steam Market`,
    type_intro_mat: (n, pl, vol) => `There are ${n} TBH: Task Bar Hero ${pl.toLowerCase()} tradable on the Steam Market. They are in-game resources with no grade or level, and they tend to sell fast: ${vol} units were traded in this group in the last 24 hours.`,
    type_intro_eq: o => `There are ${o.n} TBH: Task Bar Hero ${o.pl.toLowerCase()} tradable on the Steam Market, across ${o.ng} grades (${o.grades}) and levels ${o.lo} to ${o.hi}. The same ${o.sg.toLowerCase()} at a higher grade and level is usually worth much more, but with fewer buyers.`,
    type_price_line: o => `The group's median price is ${o.med}. ${o.top ? `The most expensive is ${o.top}, from ${o.topPrice}` : ''}${o.cheap ? `, and the cheapest is ${o.cheap}, at ${o.cheapPrice}` : ''}. ${o.traded ? `The most traded in the last 24 hours was ${o.traded}, with ${o.tradedVol} units.` : ''}`,
    type_h_all: n => `All items (${n})`, h_other_types: 'Other types',
    item_title: name => `${name}: Steam Market price (TBH) · tbhbau`,
    item_desc_mat: o => `${o.name}: TBH: Task Bar Hero material on the Steam Market. Lowest ask ${o.price}${o.buy ? `, instant sell ${o.buy}` : ''}${o.vol ? `, ${o.vol} sold in 24h` : ''}. Price history, order book and liquidity.`,
    item_desc_eq: o => `${o.name}: ${o.rarity} level ${o.lvl} ${o.type.toLowerCase()} from TBH on the Steam Market. Lowest ask ${o.price}${o.buy ? `, instant sell ${o.buy}` : ''}${o.vol ? `, ${o.vol} sold in 24h` : ''}. Price history, order book and related items.`,
    item_meta_eq: (r, typeLink, lvl) => `${r} grade · ${typeLink} · Level ${lvl}`,
    k_lowest: 'Lowest ask', s_lowest: 'cheapest listing', k_median: 'Median (R$)', s_median: 'typical recent price', k_buy: 'Instant sell (R$)', s_buy: 'highest buy order', live: '· live',
    k_net: 'You receive (net)', s_net: 'after ~13% fee', k_liq: 'Liquidity', s_liq: l => `buy orders · ${l}`, k_vol: '24h volume', s_vol: 'units sold', k_spread: 'Spread', s_spread: 'ask − instant sell', k_d7: '7 days', s_d30: p => `30 days: ${p}`, s_d7: 'lowest ask change',
    item_updated: d => `Data updated ${d}. Instant sell, liquidity and the order book below are fetched live when the page opens.`,
    h_price: 'Price and market', h_history: 'Price history', chart_title: 'History — lowest ask (R$), last 30 days', chart_meta: (n, d) => `${n} points · since ${d}`,
    chart_empty: '📈 Collecting history… the chart appears as prices get recorded.', chart_alt: 'Lowest ask history in BRL',
    h_ob: 'Live order book', ob_note: 'Buy and sell orders by price, straight from Steam (Brazil region, values in R$). Bars show the quantity at each level.', ob_loading: 'loading order book…',
    h_how_sell: () => 'How to sell this item',
    read_also: (a, b, c) => `Read also: <a href="${a}">how to sell TBH items on Steam</a> · <a href="${b}">listing vs instant sell</a> · <a href="${c}">grades and rarities</a>.`,
    rel_family: f => `Same family: ${f}`, rel_same: (pl, r, lvl) => `${r} ${pl} Lv. ${lvl}`, rel_top: pl => `Most valuable ${pl.toLowerCase()}`,
    tools: 'Tools', tool_eval: 'What is my stash worth?', tool_market: 'Explore the market', tool_all: pl => `All ${pl.toLowerCase()}`, tool_bulletin: 'This week\'s bulletin',
    prose: (it, o) => {
      const p = [];
      let s1 = it.isMaterial
        ? `<b>${o.name}</b> is a ${o.type.toLowerCase()} from TBH: Task Bar Hero, an in-game resource that can also be sent to your Steam inventory and sold on the Community Market.`
        : `<b>${o.name}</b> is a level ${it.lvl}, <b>${o.rarity}</b> grade ${o.type.toLowerCase()} from TBH: Task Bar Hero, tradable on the Steam Community Market.`;
      if (o.usd) s1 += ` Right now the lowest ask (cheapest listing) is <b>${o.usd}</b>${it.lowestBrl != null ? ` in the US store and ${o.brl} in the Brazilian store` : ''}${o.median ? `, with a recent median of ${o.median} (BRL).` : '.'}`;
      else if (it.lowestBrl != null) s1 += ` Right now the lowest ask (cheapest listing) is <b>${o.brl}</b> in the Brazilian store${o.median ? `, with a recent median of ${o.median}.` : '.'}`;
      p.push(s1);
      let s2 = '';
      if (o.hasBuy) {
        s2 = `There are <b>${o.buyCount} active buy orders</b> (${o.liq} liquidity). The highest pays <b>${o.buy}</b>: that is the <b>instant sell</b>, what you get by selling right now without waiting (Brazil-region order book, in BRL). After Steam's ~13% fee, you keep roughly <b>${o.net}</b> per unit.`;
        if (o.spread) s2 += ` The spread between the ask and the instant sell is ${o.spread} (${o.spreadPct}%)${o.spreadN > 25 ? ', which is wide: if you can wait, listing tends to pay more' : o.spreadN < 8 ? ', which is narrow: selling instantly costs little' : ''}.`;
      } else s2 = 'There are no active buy orders right now, so there is no instant sell: sellers need to list and wait for a buyer.';
      s2 += it.vol > 0 ? ` <b>${o.vol} units</b> were traded in the last 24 hours.` : ' No sales were recorded in the last 24 hours.';
      p.push(s2);
      if (o.h) {
        let s3 = `We have tracked this item since ${o.first}, with ${o.n} price readings.`;
        if (o.d7 != null) s3 += ` Over the last 7 days the lowest ask ${o.d7 >= 0 ? 'rose' : 'fell'} <b>${o.d7abs}</b> (from ${o.ask7} to ${o.brl}), ranging between ${o.min7} and ${o.max7}.`;
        if (o.d30 != null) s3 += ` Over 30 days the change was <b>${o.d30s}</b>, with a low of ${o.min30} and a high of ${o.max30}${o.volAvg ? `, and an average of ${o.volAvg} units sold per day` : ''}.`;
        p.push(s3);
      } else p.push('We started recording this item\'s history recently; the chart appears as readings accumulate.');
      return p;
    },
    tips: (it, o) => {
      const li = [];
      if (o.hasBuy) {
        if (o.spreadN != null && o.spreadN < 10) li.push('The spread is narrow: <b>selling instantly</b> (hitting the buy order) loses little versus listing and is done right away.');
        else li.push('If you are not in a hurry, <b>list near the lowest ask</b> and wait; instant sell pays less. If you want the money now, accept the highest buy order.');
        if (it.buyCount >= 500) li.push('High liquidity: there are many buy orders, so selling fast is easy even in quantity.');
        else if (it.buyCount < 50) li.push('Low liquidity: few buy orders. Selling several units at once pushes the instant sell price down quickly.');
      } else li.push('No buy orders right now: list slightly below the lowest ask and be patient.');
      if (it.lowestBrl != null && it.lowestBrl >= 1000) li.push('High-value item: check the live order book and the ~13% fee before deciding. On expensive items, the difference between listing and selling instantly adds up.');
      li.push(`Remember the TBH mechanic: only <b>4 items every 8 hours</b> leave the game for Steam. Prioritize the highest instant sell in each window; the <a href="${o.evalUrl}">evaluator</a> computes that from your save.`);
      return li;
    },
    bul_title: w => `TBH market bulletin: gains, drops and best sells (${w}) · tbhbau`,
    bul_desc: 'Weekly summary of the TBH: Task Bar Hero Steam Market: biggest 7-day gains and drops, most traded items, best instant sells and most valuable items, with fresh data.',
    bul_h1: 'TBH market bulletin', bul_crumb: 'Market bulletin',
    bul_lead: w => `Week of ${w}. What went up, what went down, what moved the most and what is worth selling right now on the TBH: Task Bar Hero Steam Market, from the data we collect continuously.`,
    bul_generated: (d, n) => `Generated automatically from data as of ${d}${n ? ` and history for ${n} items` : ''}. Regenerated daily.`,
    h_summary: 'Summary',
    bul_s1: o => `Of the ${o.n} items tracked, ${o.withVol} recorded sales in the last 24 hours, for a total of ${o.volTotal} units, and ${o.withBuy} have at least one active buy order. ${o.topTypes ? `The types that moved the most were ${o.topTypes}.` : ''}`,
    bul_s2: o => `Among the ${o.movers} items priced above R$ 0.20 with recent sales, ${o.upsN} went up and ${o.downsN} went down versus 7 days ago. ${o.up ? `The biggest gain was ${o.up} (${o.upPct}, now at ${o.upPrice})` : ''}${o.down ? `${o.up ? ' and the biggest drop was' : 'The biggest drop was'} ${o.down} (${o.downPct}, at ${o.downPrice})` : ''}.`,
    bul_s2_none: '7-day changes appear once the history has accumulated a full week of readings.',
    bul_s3: o => `For those who want to sell right now, the best instant sell with reasonable liquidity is ${o.link}, paying ${o.buy} (about ${o.net} net after fees). Remember that TBH only releases 4 items every 8 hours to Steam: use the <a href="${o.evalUrl}">evaluator</a> to rank the ones in your stash.`,
    h_ups: '📈 Biggest gains in 7 days', ups_note: 'Items with a lowest ask of at least R$ 0.20 and at least 3 sales in 24h, to filter out noise from items without a market.',
    h_downs: '📉 Biggest drops in 7 days', h_traded: '🔥 Most traded in the last 24 hours', h_sell: '⚡ Best to sell right now', sell_note: 'Highest active buy order, among items with at least 10 orders.', h_valuable: '💎 Most valuable',
    bul_read: (a, b, m) => `How to read these numbers: <a href="${a}">listing vs instant sell</a> · <a href="${b}">grades and rarities</a>. All items in the <a href="${m}">market</a>.`,
    empty_list: 'Not enough data for this list yet.', th_net: 'Net',
    guides_title: 'TBH guides: selling on the Steam Market, strategies and rarities · tbhbau',
    guides_desc: 'Practical guides about TBH: Task Bar Hero and the Steam Market: how to sell items, listing vs instant sell, grades and rarities, the Steam fee and the 4-items-every-8-hours window.',
    guides_h1: 'TBH and Steam Market guides', guides_lead: 'Everything you need to understand and make the most of your stash value in <b>TBH: Task Bar Hero</b>.',
    h_guide_data: 'Data behind the guides',
    guide_data_p: (m, i, b) => `The guides use the same numbers as the rest of the site: the <a href="${m}">full market</a>, the <a href="${i}">item pages</a> with history and order book, and the <a href="${b}">weekly bulletin</a> with gains, drops and best sells.`,
    by: (a, d) => `By ${a} · ${d}`, h_read_also: 'Read also',
    ev_title: 'TBH stash evaluator: your save\'s value on the Steam Market · tbhbau',
    ev_desc: 'Upload your TBH: Task Bar Hero save and see your stash value on the Steam Market in dollars and reais, the instant sell and the best 4 items to list. Read only in your browser.',
    ev_crumb: 'Stash evaluator', ev_h1: 'Stash evaluator',
    ev_sub: 'Upload your <code>SaveFile_Live.es3</code> and see your stash value on the Steam Market. <b>The save is read 100% in your browser; nothing is sent to any server.</b>',
    ev_drop: 'Drag your <b>SaveFile_Live.es3</b> here, or <b>click to choose</b>', ev_path_pre: 'Your save is located at:', ev_copy: '📋 copy path', ev_badge: '🔒 processed locally · read-only',
    ev_loaded: 'Save loaded:', ev_remove: '🗑️ remove', ev_q_ph: 'filter item…',
    ev_th: ['Item', 'Type', 'Qty', 'Listing ea.', 'Instant sell (R$)', 'Liquidity', 'Listing subtotal'],
    ev_how_h: 'How it works',
    ev_how_p: '<li>Open the game at least once to generate the save (<code>SaveFile_Live.es3</code>).</li><li>Drag the file onto the area above (or click to choose it).</li><li>The site decrypts the save in your browser and matches items against an up-to-date copy of Steam Market prices.</li><li>See the total value, item by item, and the <b>Top 4 to list</b> panel with the most profitable instant sells for your next 4-items-every-8-hours window.</li>',
    ev_how_extra: 'Each table row opens the item detail, with a live order book and price history. Listing prices can be shown in US$ or R$ with the toggle in the top bar; instant sell is always in R$ because it comes from the Brazil-region order book.',
    ev_priv_h: 'Privacy',
    ev_priv_p: p => `Your save is read and decrypted <b>100% in the browser</b> (Web Crypto). It is never sent to any server; it is kept only in your browser so it reloads when you come back, and you can remove it with the "remove" button. The project is open source and only <b>reads</b> the file: it never changes your save or the game. See the <a href="${p}">privacy policy</a>.`,
    ev_priv_more: (a, b) => `Want to understand the numbers before selling? Read <a href="${a}">how to sell TBH items on Steam</a> and <a href="${b}">listing vs instant sell</a>.`,
    ev_app_name: 'TBH stash evaluator',
  },
};

export function mk(L) {
  const S = STR[L], loc = LOCALE[L], R = ROUTES[L];
  const t = (k, ...a) => { const v = S[k] ?? STR.pt[k]; if (v == null) return k; return typeof v === 'function' ? v(...a) : v; };
  const tz = { timeZone: 'America/Sao_Paulo' };
  return {
    L, S, t, lang: HTML_LANG[L], R, routes: R,
    route: k => R[k],
    fmtInt: n => Number(n).toLocaleString(loc),
    fmtPct: p => (p > 0 ? '+' : '') + (L === 'pt' ? p.toFixed(1).replace('.', ',') : p.toFixed(1)) + '%',
    fmtDate: ts => new Date(ts).toLocaleDateString(loc, { day: '2-digit', month: '2-digit', year: 'numeric', ...tz }),
    fmtDateLong: ts => new Date(ts).toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric', ...tz }),
    fmtDateTime: ts => new Date(ts).toLocaleString(loc, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', ...tz }) + (L === 'pt' ? ' (Brasília)' : ' (Brasília time, UTC−3)'),
    money: (cents, cur = 'brl') => moneyRaw(cents, cur),
    moneyBrl,
    // preço "preferido" de um item no idioma: EN prefere US$ (anúncio), PT prefere R$
    price: it => L === 'en' ? (it.usdCents ? moneyRaw(it.usdCents, 'usd') : (it.lowestBrl != null ? moneyBrl(it.lowestBrl) : '—')) : (it.lowestBrl != null ? moneyBrl(it.lowestBrl) : (it.usdCents ? moneyRaw(it.usdCents, 'usd') : '—')),
    // span com as duas moedas; texto inicial na moeda do idioma (common.js troca conforme a preferência salva)
    moneySpan: (brl, usd, cls = '') => {
      if (brl == null && usd == null) return '<span class="money">—</span>';
      const attrs = [brl != null ? `data-brl="${brl}"` : '', usd != null ? `data-usd="${usd}"` : ''].filter(Boolean).join(' ');
      const txt = (L === 'en' && usd != null) ? moneyRaw(usd, 'usd') : (brl != null ? moneyBrl(brl) : moneyRaw(usd, 'usd'));
      return `<span class="money ${cls}" ${attrs}>${txt}</span>`;
    },
    typeName: (ty, plural = false) => L === 'en' ? (TYPE_EN[ty] || [ty, ty])[plural ? 1 : 0] : (TYPE_PT[ty] || [ty, ty, 'm'])[plural ? 1 : 0],
    typeFem: ty => L === 'pt' && (TYPE_PT[ty] || [0, 0, 'm'])[2] === 'f',
    rarity: r => r ? (L === 'en' ? r : RARITY_PT[r]) : '',
    liq: k => LIQ[L][k] || LIQ[L].nenhuma,
    esc, netCents,
  };
}
