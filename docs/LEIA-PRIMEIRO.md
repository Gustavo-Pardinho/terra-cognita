# Terra Cognita — por onde retomar

Atlas de estudo do mundo. Geografia, história, geopolítica, economia, ideias e vestígios
tratados como camadas de um mesmo mapa, com fonte em toda afirmação.

Projeto iniciado em **23/10/2026**, pausado em **27/10/2026** com duas pranchas de país
prontas e o site publicado.

## Onde está tudo

| | |
|---|---|
| Código | este repositório |
| Site no ar | https://terra-cognita.gustavo-pardinho.workers.dev |
| Painel do deploy | dash.cloudflare.com → Compute (Workers) → terra-cognita |
| Licenças | `LICENSE` (código, MIT) e `LICENSE-CONTEUDO.md` (dados, CC BY-SA 4.0) |
| Atribuição dos acervos | `ATRIBUICAO.md` |

## Voltar a rodar em cinco minutos

```sh
npm install
npm run dev        # http://localhost:4321
```

Os geodados e os 345 ladrilhos de relevo **estão versionados**, então o clone já roda. Só
rode `npm run dados` ou `npm run relevo` se precisar regerar — `relevo` baixa um DEM e
leva alguns minutos.

## O que ler, nesta ordem

1. **`DECISOES.md`** — as decisões e o porquê de cada uma. É a parte insubstituível:
   o código se relê, o raciocínio não.
2. **`ESTADO.md`** — o que existe hoje, com números conferidos.
3. **`PLANO.md`** — o que vem depois, em ordem, com a razão da ordem.
4. **`ARMADILHAS.md`** — os defeitos que custaram tempo. Leia antes de mexer no mapa ou
   no CSS; três deles morderam mais de uma vez.

O `README.md` na raiz cobre a parte técnica de operação. Estes arquivos cobrem o que ele
não cobre: a história das decisões e o plano.

> Esta pasta existe em duas cópias: aqui, versionada, e em `Documents/Gustavo/`, fora do
> git. **A cópia do repositório é a canônica** — é a que tem histórico. Se as duas
> divergirem, esta vale.

## O estado em uma linha

Dez páginas no ar, duas pranchas de país com **zero valores pendentes de verificação**,
três das quatro lentes construídas, e um baralho de estudo gerado do próprio acervo.
A lacuna maior é a lente Verbete: o atlas tem muito mapa e pouco texto.
