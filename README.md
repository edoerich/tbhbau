# tbhbau — o Mercado Steam do TBH: Task Bar Hero

Site independente e gratuito sobre a economia do **TBH: Task Bar Hero** no Mercado da Comunidade Steam:
preços, histórico e liquidez de todos os itens negociáveis, boletim semanal, guias e um **avaliador de baú**
que lê o save do jogo **100% no navegador** (nada é enviado a nenhum servidor).

Produção: **https://tbhbau.com.br** · API/dados: `https://api.tbhbau.com.br`

## Arquitetura

```
worker.mjs   (VM)  → consulta a Steam em rotação gentil e mantém public/data/snapshot.json + public/data/history/<item>.json
server.mjs   (VM)  → serve o snapshot com CORS + /api/item (order book ao vivo) + /api/history + /api/history-summary
build.mjs    (CI)  → gera o site estático em dist/ a partir do snapshot + histórico (Cloudflare Pages roda no deploy)
src/         → CSS e JS do cliente (common.js: moeda, modal de item, tabelas; avaliador.js: leitura do save)
src/content/ → guias e páginas institucionais (módulos .mjs com HTML)
build/       → layout, componentes e um gerador por seção (home, mercado, itens/tipo, item, boletim, guias, páginas)
public/      → assets copiados como estão (tbh-save.js, pix-qr.svg, ads.txt, data/*.json)
```

Páginas geradas: home, `/mercado/`, `/itens/`, `/tipo/<tipo>/` (26), `/item/<slug>/` (uma por item, ~900),
`/avaliador/`, `/guias/` + 3 guias, `/boletim/`, `/sobre/`, `/contato/`, `/termos/`, `/privacidade/`,
`sitemap.xml`, `robots.txt`, `_redirects` (URLs antigas → novas).

## Rodar local

```bash
node build.mjs                      # gera dist/ (usa a API ao vivo; --offline usa só public/data)
STATIC_DIR=dist node server.mjs     # http://localhost:5270 servindo o build
node worker.mjs                     # (opcional) atualiza public/data/snapshot.json em rotação contínua
```

## Deploy

- **Site:** Cloudflare Pages. Build command `node build.mjs`, output directory `dist`, Node 20 (`.node-version`).
  Um *Deploy Hook* chamado por cron diário na VM regera as páginas com dados frescos.
- **Worker + API:** VM (Oracle Cloud Free) com dois serviços systemd (`tbhbau-worker`, `tbhbau-api`).
  Após `git push`: `ssh VM; cd ~/tbhbau && git pull && sudo systemctl restart tbhbau-worker tbhbau-api`.

## Créditos

Feito por **edelrich**. Baseado no projeto open source
[giba-steam-market](https://github.com/lezards/giba-steam-market) (licença MIT).
