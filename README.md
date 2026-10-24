# Terra Cognita

Atlas de estudo do mundo. Geografia, história, geopolítica, economia, ideias e
vestígios tratados como camadas de um mesmo mapa — com fonte em toda afirmação.

**Estado: Fase 0** — o molde. Uma prancha de país feita de ponta a ponta para provar
que o molde aguenta conteúdo real, antes de escalar.

## Rodar

```sh
npm install
npm run dados     # recorta o Natural Earth para public/dados/ (uma vez)
npm run relevo    # assa a prancha de relevo a partir de um DEM real (uma vez)
npm run dev       # http://localhost:4321
```

Rotas: `/` (folha de rosto) e `/regioes/brasil` (prancha de prova).

## A decisão estrutural

Um só acervo, quatro lentes. Organizar por disciplina produz acervos paralelos que
repetem os mesmos fatos e divergem com o tempo. Aqui se guarda **um** item — com
geometria, vigência, relações e fontes — e se olha de quatro maneiras: Mapa (onde),
Tempo (quando), Rede (com quem), Verbete (por quê). A disciplina é filtro, não gaveta.

## Procedência

Todo valor exibido é um `Fato`: valor, unidade, ano, precisão e **fonte**. O componente
`<Dado>` é o único caminho para pôr um número na tela, e ele exige a fonte — um número
digitado direto no texto não tem como ser renderizado. `criarRegistro()` percorre os
dados da prancha, numera as fontes pela ordem de primeira aparição e monta a lista do pé.

Fonte desconhecida **quebra o build** (`obterFonte` lança). Valor marcado
`verificar: true` ainda não foi conferido contra o documento primário, e a prancha
mostra a pendência ao leitor em vez de escondê-la.

## Mapa sem servidor

O relevo é um PNG indexado assado de um DEM real (Terrarium/Mapzen, z6 ≈ 2,4 km/px):
altitude decodificada, faixas hipsométricas e sombreamento com luz do noroeste.
A imagem é nativa em Mercator, então os cantos da malha de telhas ancoram sem distorção.
São 162 cores — a rampa vezes os degraus de sombra —, o que cabe numa paleta indexada e
torna o PNG-8 **sem perda**, três vezes menor que o RGB (0,69 MB contra 1,90 MB).

Os demais dados geográficos são GeoJSON estático em `public/dados/`, servidos como arquivo.
Não há servidor de ladrilho e não há servidor de glifo: os rótulos são marcadores HTML,
o que permite usar a hierarquia tipográfica real do atlas — versal espaçada para região,
redonda para cidade, itálico serifado azul para água, monoespaçada para coordenada.
Nenhum servidor de glifo reproduz isso.

Custo mensal perto de zero, mesmo com tráfego. Um atlas que fica caro no segundo mês
não vira fonte de estudo para ninguém.

## Estrutura

```
src/styles/tokens.css      sistema visual — fonte única de cor, corpo e espaço
src/styles/prancha.css     anatomia da prancha: neatline, cartucho, grade de margem
src/styles/verbete.css     tipografia de leitura, rótulo cartográfico, procedência
src/lib/fontes.ts          registro de acervos, com licença e data de extração
src/lib/acervo.ts          modelo de item, tipo Fato, registro de referências
src/data/paises/           itens do acervo
src/islands/               ilhas interativas (MapLibre)
scripts/preparar-geodados  recorte do Natural Earth
```

## Limites conhecidos da Fase 0

- O relevo é um raster único de z6. Ao aproximar além de z7 ele borra; a resposta real
  são ladrilhos, e é isso que a Fase 1 resolve.
- `ufs.geojson` tem 582 kB sem compressão. GeoJSON comprime muito bem; o host de
  produção serve com gzip/brotli, mas em `astro dev` o peso aparece cru.
- O MapLibre pesa 286 kB comprimidos, carregados só nas pranchas que têm mapa.

## Notas de verificação

O mapa carrega o estilo dentro de `requestAnimationFrame`. Em aba de segundo plano ou
em Chrome headless sem vsync o rAF fica suspenso, e o mapa aparece vazio — é artefato do
ambiente, não defeito. Verificação visual precisa de janela em primeiro plano.
