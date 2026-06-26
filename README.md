# tbhbau — Avaliador de baú do TBH: Task Bar Hero

Site gratuito que lê o seu save do **TBH: Task Bar Hero** e mostra o valor do baú no **Mercado da Steam**
em **R$ e US$**, com o preço de **venda imediata** (maior ordem de compra) e os **4 melhores itens pra lançar**
(mecânica de 4 itens a cada 8h).

🔒 **Privacidade:** o save é lido **100% no navegador** (Web Crypto). Nada é enviado a nenhum servidor.

## Arquitetura

- **Frontend estático** (`index.html`, `tbh-save.js`): decifra o `.es3`, cruza com o snapshot e calcula tudo no cliente.
- **Snapshot global** (`data/snapshot.json`): preços (USD/BRL) + ordens de compra dos ~742 itens. Igual pra todos.
- **Worker** (`worker.mjs`): roda numa VM e mantém o `snapshot.json` fresco, consultando os endpoints
  públicos da Steam em rotação gentil (respeitando rate-limit). Zero chamadas à Steam por usuário.
- `server.mjs`: servidor local pra desenvolvimento (serve o estático + um proxy de orderbook opcional).

## Rodar local

```bash
node server.mjs        # http://localhost:5270
node worker.mjs        # atualiza data/snapshot.json (rotação contínua)
```

## Deploy

- **Site:** Cloudflare Pages (estático, sem build). Output: raiz do repositório.
- **Worker:** VM (ex.: Oracle Cloud Free) rodando `node worker.mjs`, servindo `snapshot.json` com CORS;
  o frontend aponta `SNAPSHOT_URL` (em `index.html`) pra essa URL.

## Créditos

Feito por **edelrich**. Baseado no projeto open source
[giba-steam-market](https://github.com/lezards/giba-steam-market) (licença MIT).
