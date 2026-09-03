// Páginas institucionais (PT). Cada uma: slug, title, description, body (HTML).
export default [
  {
    slug: 'sobre', title: 'Sobre o tbhbau', nav: 'Sobre',
    description: 'O que é o tbhbau, quem faz, de onde vêm os dados do Mercado Steam do TBH: Task Bar Hero e como o site é mantido.',
    body: `
<p class="lead">O <b>tbhbau</b> é um site independente e gratuito sobre a economia do <b>TBH: Task Bar Hero</b> no Mercado da Comunidade Steam: preços, histórico, liquidez e ferramentas para quem quer entender o que vale o seu baú e vender melhor.</p>
<h2>O que você encontra aqui</h2>
<ul>
  <li><b><a href="/mercado/">Mercado</a>:</b> todos os itens negociáveis do TBH com menor venda, mediana, venda imediata, volume e liquidez, atualizados continuamente.</li>
  <li><b><a href="/itens/">Itens</a>:</b> uma página para cada item, com histórico de preço, order book ao vivo e itens relacionados; e uma página por tipo (elmos, espadas, materiais...).</li>
  <li><b><a href="/avaliador/">Avaliador de baú</a>:</b> suba o save do jogo e veja o valor do seu baú, item a item, com os 4 melhores para lançar na próxima janela. O save é lido só no seu navegador.</li>
  <li><b><a href="/guias/">Guias</a>:</b> como vender, anúncio vs venda imediata, grades e raridades.</li>
  <li><b><a href="/boletim/">Boletim</a>:</b> um resumo da semana no mercado: altas, quedas, mais negociados e melhores para vender.</li>
</ul>
<h2>De onde vêm os dados</h2>
<p>Os preços vêm dos endpoints públicos do Mercado da Comunidade Steam. Um serviço nosso consulta a Steam em rotação gentil, respeitando os limites dela, e mantém uma cópia consolidada dos dados que todos os visitantes usam. Cada item é revisitado a cada 30 minutos, aproximadamente, e o histórico de preço é gravado por nós a partir dessas leituras. Os valores <b>não são em tempo real</b>: confira sempre na Steam antes de vender.</p>
<p>Os preços em reais são os preços regionais da Steam para o Brasil, não uma conversão de dólar por câmbio. Por isso o mesmo item pode ter relações diferentes entre R$ e US$.</p>
<h2>Quem faz</h2>
<p>O tbhbau é feito por <b>edelrich</b>, jogador do TBH, como projeto pessoal. O código é aberto e está no <a href="https://github.com/edoerich/tbhbau" target="_blank" rel="noopener">GitHub</a>, baseado no projeto <a href="https://github.com/lezards/giba-steam-market" target="_blank" rel="noopener">giba-steam-market</a> (licença MIT). O site é mantido com anúncios discretos e doações via Pix.</p>
<h2>Independência</h2>
<p>O tbhbau não tem vínculo com a Valve/Steam nem com os desenvolvedores do TBH: Task Bar Hero. Nomes e imagens dos itens pertencem aos seus respectivos donos e são usados apenas para identificar os itens.</p>
<p>Fale com a gente pela página de <a href="/contato/">contato</a>.</p>`,
  },
  {
    slug: 'contato', title: 'Contato', nav: 'Contato',
    description: 'Fale com o tbhbau: sugestões, correções de dados, parcerias e dúvidas sobre o site.',
    body: `
<p class="lead">Achou um preço errado, um item faltando, tem uma sugestão ou quer conversar sobre o site? Escreva pra gente.</p>
<div class="card" style="max-width:520px">
  <p style="margin:0 0 6px"><b>E-mail:</b> <a href="mailto:contato@tbhbau.com.br">contato@tbhbau.com.br</a></p>
  <p style="margin:0 0 6px"><b>Código e issues:</b> <a href="https://github.com/edoerich/tbhbau/issues" target="_blank" rel="noopener">github.com/edoerich/tbhbau</a></p>
  <p style="margin:0" class="muted">Respondemos normalmente em alguns dias. Não é suporte oficial do jogo nem da Steam.</p>
</div>
<h2>Antes de escrever</h2>
<ul>
  <li><b>Preço diferente da Steam:</b> os dados são atualizados a cada ~30 minutos por item. Uma diferença pequena e momentânea é esperada. Se persistir por horas, avise com o nome do item.</li>
  <li><b>Item não aparece no avaliador:</b> só itens negociáveis na Steam têm preço. Itens sem mercado ficam listados separados.</li>
  <li><b>Save não carrega:</b> confira se é o arquivo <code>SaveFile_Live.es3</code> do TBH. O arquivo nunca sai do seu computador, então não conseguimos vê-lo; descreva o erro mostrado na tela.</li>
</ul>
<p>Gostou do site? Você pode <a href="#" data-pix>apoiar via Pix</a>. Obrigado!</p>`,
  },
  {
    slug: 'termos', title: 'Termos de uso', nav: 'Termos',
    description: 'Termos de uso do tbhbau.com.br: natureza informativa dos dados, isenção de responsabilidade e regras de uso.',
    body: `
<p class="muted">Última atualização: 3 de setembro de 2026</p>
<h2>1. O serviço</h2>
<p>O tbhbau.com.br ("site") publica informações sobre preços e negociação de itens do jogo TBH: Task Bar Hero no Mercado da Comunidade Steam e oferece uma ferramenta gratuita de avaliação de baú. O uso do site é livre e gratuito.</p>
<h2>2. Natureza das informações</h2>
<p>Todos os valores exibidos são <b>estimativas</b> obtidas de dados públicos da Steam, atualizadas periodicamente e sujeitas a atraso e erro. O site não garante exatidão, disponibilidade ou atualidade dos dados. Decisões de compra e venda são de inteira responsabilidade do usuário. O site não é uma corretora nem intermedeia transações.</p>
<h2>3. Ferramenta de avaliação</h2>
<p>O arquivo de save carregado no avaliador é processado apenas no navegador do usuário e não é enviado ao site. A ferramenta apenas lê o arquivo e não altera o jogo nem o save. O uso é por conta e risco do usuário.</p>
<h2>4. Propriedade intelectual</h2>
<p>TBH: Task Bar Hero, Steam e os nomes e imagens dos itens pertencem aos seus respectivos titulares. O site não tem vínculo com a Valve nem com os desenvolvedores do jogo. O código do site é aberto sob licença MIT; os textos originais do site podem ser citados com link para a fonte.</p>
<h2>5. Uso aceitável</h2>
<p>É proibido usar o site para atividades ilegais, sobrecarregar a infraestrutura (raspagem agressiva, ataques) ou tentar obter dados de outros usuários. Podemos limitar o acesso em caso de abuso.</p>
<h2>6. Anúncios e terceiros</h2>
<p>O site exibe anúncios de terceiros (Google AdSense) e contém links externos. Não nos responsabilizamos pelo conteúdo ou pelas práticas desses terceiros. Veja a <a href="/privacidade/">política de privacidade</a>.</p>
<h2>7. Alterações</h2>
<p>Estes termos podem mudar a qualquer momento; a versão vigente é sempre a publicada nesta página. Dúvidas: <a href="/contato/">contato</a>.</p>`,
  },
  {
    slug: 'privacidade', title: 'Política de Privacidade', nav: 'Privacidade',
    description: 'Política de privacidade do tbhbau.com.br: o save é processado só no navegador, sem cadastro, e uso de cookies de anúncios do Google AdSense.',
    body: `
<p class="muted">Última atualização: 3 de setembro de 2026 · site: <code>tbhbau.com.br</code></p>
<p>O <b>tbhbau.com.br</b> publica informações sobre o Mercado Steam do jogo <b>TBH: Task Bar Hero</b> e oferece uma ferramenta gratuita que estima o valor do seu baú. Esta página explica como seus dados são (ou não) tratados.</p>
<h2>1. Seu arquivo de save</h2>
<p>O arquivo <code>SaveFile_Live.es3</code> que você carrega no avaliador é lido e processado <b>inteiramente no seu navegador</b>. Ele <b>nunca é enviado nem compartilhado</b> com nenhum servidor, nosso ou de terceiros.</p>
<p>Para sua comodidade, o save fica guardado <b>apenas no armazenamento local do seu navegador</b> (no seu próprio dispositivo), para recarregar automaticamente quando você volta. Você pode removê-lo a qualquer momento pelo botão <b>"remover"</b> no avaliador ou limpando os dados do navegador.</p>
<h2>2. Dados pessoais</h2>
<p>Não solicitamos cadastro, login nem coletamos dados pessoais identificáveis (nome, e-mail etc.) para usar o site. Não vendemos nem compartilhamos dados de usuários. Preferências como moeda e idioma ficam salvas só no seu navegador.</p>
<h2>3. Preços do mercado</h2>
<p>Os preços exibidos vêm de um arquivo de cotações que atualizamos periodicamente a partir de endpoints públicos do Mercado da Steam. Esse arquivo é igual para todos os visitantes e não contém nada seu.</p>
<h2>4. Cookies e anúncios (Google AdSense)</h2>
<p>Este site exibe anúncios por meio do <b>Google AdSense</b>. Para isso, o Google e seus parceiros podem usar cookies e identificadores para exibir anúncios com base em suas visitas a este e a outros sites.</p>
<ul>
  <li>O Google usa o cookie <code>DART</code> e tecnologias semelhantes para personalizar anúncios.</li>
  <li>Você pode desativar a publicidade personalizada nas <a href="https://adssettings.google.com" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.</li>
  <li>Saiba mais em <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Como o Google usa cookies em anúncios</a>.</li>
  <li>Para opções de terceiros, consulte <a href="https://www.aboutads.info" target="_blank" rel="noopener">aboutads.info</a>.</li>
</ul>
<h2>5. LGPD</h2>
<p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), como não coletamos dados pessoais identificáveis, não há tratamento de dados a solicitar acesso ou exclusão referente à ferramenta. O uso de cookies de publicidade é de responsabilidade do Google AdSense, conforme as políticas acima.</p>
<h2>6. Isenção</h2>
<p>Os valores são estimativas com base em dados públicos da Steam e podem variar. Este site não tem vínculo oficial com a Valve/Steam nem com os desenvolvedores do TBH: Task Bar Hero. É baseado no projeto de código aberto <a href="https://github.com/lezards/giba-steam-market" target="_blank" rel="noopener">giba-steam-market</a> (licença MIT).</p>
<h2>7. Contato</h2>
<p>Dúvidas sobre esta política: <a href="mailto:contato@tbhbau.com.br">contato@tbhbau.com.br</a>.</p>`,
  },
];
