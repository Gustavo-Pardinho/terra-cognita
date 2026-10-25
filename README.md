# Terra Cognita

Atlas de estudo do mundo. Geografia, história, geopolítica, economia, ideias e
vestígios tratados como camadas de um mesmo mapa — com fonte em toda afirmação.

**Estado: Fase 2** — o tempo. O mapa-mãe da Fase 1 ganhou um controle de ano, e a
vigência de cada item passa a decidir o que aparece.

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

O relevo é uma pirâmide de 345 ladrilhos PNG (z3–z7, 4,2 MB) assada de um DEM real
(Terrarium/Mapzen): altitude decodificada, faixas hipsométricas dos tokens e
sombreamento com luz do noroeste.

Cada nível é montado como **um mosaico com borda de um ladrilho**, sombreado inteiro e só
então fatiado. É o que elimina a costura: o gradiente na borda de um ladrilho enxerga o
vizinho. Fatiar primeiro e sombrear depois produz uma grade visível de emendas.

Os ladrilhos são PNG indexado: a prancha usa ~160 cores — a rampa vezes os degraus de
sombra —, o que cabe numa paleta de 256 e torna o PNG-8 **sem perda**, três vezes menor
que o RGB. O escritor está em `scripts/preparar-relevo.mjs` (zlib + CRC32, sem
dependência nova); `pngjs` entra só para ler as telhas de origem.

O zoom máximo do mapa é 8 porque o DEM assado vai até z7. Um atlas não blefa além da
resolução do seu dado.

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

## O tempo

Mover o ano não troca de página: troca o que está em vigor. Cada item do acervo carrega
a própria `vigencia`, e nada no código sabe o que é uma capital — a sequência
Salvador (1549–1763) → Rio de Janeiro (1763–1960) → Brasília (1960–) move o marcador
porque é isso que as datas dizem.

A **linha de Tordesilhas** é a primeira camada histórica. Ela é o caso exemplar da
PR. 05: o tratado fixa o limite a 370 léguas a oeste de Cabo Verde, e qual meridiano é
isso depende da légua e da ilha de referência — ambas disputadas à época. Desenhar uma
linha fina ali seria inventar precisão que a fonte não tem, então o mapa desenha a
**faixa inteira** de incerteza, com o traçado tradicional pontilhado dentro. Antes de
1494 ela não existe; de 1494 a 1750 vigora; depois fica como traço histórico apagado.

A página `/tempo` traz o eixo proporcional dos marcos — nele se vê que 1888 e 1889 são
colados e que entre 1763 e 1822 há meio século de silêncio nesta prancha — e o corte
sincrônico, que responde o que uma lista cronológica não responde: *o que mais estava
valendo neste ano?*

O que **ainda não varia**: fronteiras, estados e nomes de cidade são os de hoje.
Fronteira histórica exige geometria datada, que o acervo ainda não tem, e desenhar a de
hoje fingindo ser a de 1650 seria o erro que este atlas existe para não cometer.

## Permalink de estado

O endereço guarda centro, zoom, projeção, camadas ligadas e o ano:

```
#z=5.4&lat=-23.55&lon=-46.63&proj=mercator&cam=relevo,rotulos,tissot&ano=1650
```

`ano` só é gravado quando o leitor sai do presente, e links da Fase 1 sem ele continuam
abrindo normalmente.

Formato legível de propósito, para poder ser editado à mão e explicado numa aula.
A gravação usa `replaceState` — arrastar o mapa não deve encher o histórico. A Fase 2
acrescenta `ano` aqui sem quebrar os links já existentes.

## Indicatriz de Tissot

Círculos de raio verdadeiro constante (500 km) sobre a superfície da esfera, calculados
por fórmula de destino geodésico em `src/lib/estado-mapa.ts`. Em Mercator eles incham com
a latitude; na ortográfica mudam de forma mas não de área. É a aula de distorção mais
direta que um atlas pode dar.

## Limites conhecidos

- `ufs.geojson` tem 582 kB sem compressão. GeoJSON comprime muito bem; o host de
  produção serve com gzip/brotli, mas em `astro dev` o peso aparece cru.
- O MapLibre pesa 286 kB comprimidos, carregados só nas pranchas que têm mapa.
- Os 345 ladrilhos de relevo estão versionados para o repositório ser executável logo
  após o clone. Regerar a pirâmide reescreve todos eles — rode `npm run relevo` só quando
  a rampa ou a extensão mudarem de fato.
- O inspetor sabe o que o acervo sabe. Para unidades federativas ainda não há item no
  acervo, então ele declara a lacuna em vez de inventar dado.

## Notas de verificação

O mapa carrega o estilo dentro de `requestAnimationFrame`. Em aba de segundo plano ou
em Chrome headless sem vsync o rAF fica suspenso, e o mapa aparece vazio — é artefato do
ambiente, não defeito. Verificação visual precisa de janela em primeiro plano.
