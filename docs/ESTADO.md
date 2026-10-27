# Estado em 27/10/2026

Números conferidos no site no ar, não de memória.

## Páginas

| Rota | O que é | Estado |
|---|---|---|
| `/` | folha de rosto: as quatro lentes e a rota de fases | pronta |
| `/atlas` | o mapa-mãe em folha inteira | pronta |
| `/tempo` | eixo proporcional dos marcos e corte sincrônico, cruzando as pranchas | pronta |
| `/regioes` | índice das pranchas de região e a hierarquia planejada | pronta |
| `/regioes/brasil` | prancha de país, 8 blocos | pronta, 0 pendências |
| `/regioes/bolivia` | prancha de país, 8 blocos | pronta, 0 pendências |
| `/rede` | grafo de relações nas posições geográficas reais | pronta |
| `/estudar` | baralho de repetição espaçada e trilhas | pronta |
| `/indice` | gazeteiro | pronta |
| `/metodo` | fontes, licenças e política editorial | pronta |
| `/verbetes` | **não existe** — marcada como fase futura no leme | — |

## Acervo

- **74 fatos** entre as duas pranchas, **zero** pendentes de verificação
- **32 acervos** cadastrados em `src/lib/fontes.ts`, **23 em uso**
- Brasil: 39 fatos, 15 fontes · Bolívia: 35 fatos, 9 fontes

## O que o ano comanda no mapa

- Capitais em vigor (plural: a Bolívia tem duas simultâneas)
- Linha de Tordesilhas: invisível antes de 1494, em vigor até 1750, traço apagado depois
- Territórios com data: Acre (ganho do Brasil / perda da Bolívia em 1903) e Litoral
  (perda da Bolívia para o Chile em 1904)
- Vigência da própria entidade política

**Ainda não varia:** fronteiras, subdivisões e nomes de cidade são os de hoje. Fronteira
histórica exige geometria datada, e só duas existem.

## Estudo

- **82 cartas** geradas do acervo, em 5 tipos (siglas, macrorregiões, cronologia, capitais,
  limítrofes). Nenhuma escrita à mão.
- **1 trilha** de 7 etapas, cada uma apontando para um permalink completo
- **124 verbetes** no índice de lugares, com busca insensível a acento

## Dados estáticos

```
public/dados/
  relevo/{z}/{x}/{y}.png     345 ladrilhos, z3–z7, 4,2 MB
  relevo.json                descritor da pirâmide
  paises.geojson             13 contornos sul-americanos com slug
  {pais}-subdivisoes.geojson brasil, bolivia, chile
  {pais}-cidades.geojson      brasil, bolivia, chile
  hidrografia.geojson
  graticulado.geojson
```

Chile está recortado **não por ter prancha**, mas porque a geometria do Litoral boliviano
está no arquivo de subdivisões dele.

## Tamanho

407 arquivos versionados · 5.780 linhas de código · 6,2 MB de dados estáticos ·
15 commits

## Verificado no ar

Todas as rotas em 200. Ladrilhos servindo PNG indexado com
`cache-control: public, max-age=31536000, immutable`. HTML com
`max-age=0, must-revalidate`. Prancha de 404 própria respondendo no lugar do erro
genérico da plataforma. Sitemap com as rotas e robots.txt apontando para o endereço certo.

## O único recurso que nunca testei em janela real

Tudo foi verificado por medição, mas a aba de automação roda em segundo plano, onde o
Chrome suspende o `requestAnimationFrame`. O **arraste do controle de ano com o mouse** e
a **troca de projeção** foram confirmados por você olhando, não por mim. Se algo parecer
estranho nesses dois, desconfie primeiro deles.
