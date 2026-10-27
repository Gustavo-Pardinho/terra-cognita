# Armadilhas já pagas

Defeitos que custaram tempo de verdade. Três deles morderam mais de uma vez. Leia antes de
mexer no mapa ou no CSS.

---

## 1. Estilo escopado não alcança HTML inserido por `innerHTML`

**Mordeu três vezes.** O Astro carimba um atributo de escopo nos elementos do template;
elementos criados em tempo de execução não o recebem, então regras como `.inspetor dd`
simplesmente não se aplicam — o conteúdo aparece como texto cru sem formatação.

**Solução:** `:global()` nos seletores internos.

Aconteceu com os rótulos do mapa, com o corpo do inspetor e com as fichas da barra do
tempo. Se algo inserido por script aparecer sem estilo, é isto.

---

## 2. `display` do autor vence o `[hidden]` do navegador

Uma regra como `.baralho__notas { display: flex }` **sobrepõe** o
`[hidden] { display: none }` da folha do navegador, e o atributo `hidden` deixa de
esconder. Os botões de resposta do baralho apareciam antes de virar a carta.

**Solução:** declarar explicitamente `.classe[hidden] { display: none; }` sempre que a
classe tiver `display` e o elemento usar `hidden`.

---

## 3. As regras do `public/_headers` são cumulativas, não exclusivas

Uma regra `/*` com `Cache-Control` **soma** com a regra específica e produz dois
`max-age` no mesmo cabeçalho:

```
cache-control: public, max-age=0, must-revalidate, public, max-age=31536000, immutable
```

O cliente obedece o primeiro, e o cache longo vira nada. Os 345 ladrilhos revalidavam a
cada carga — exatamente o contrário do que a regra existia para fazer.

**Solução:** declarar `Cache-Control` só em caminho específico, nunca em `/*`.

---

## 4. `new URL()` percent-codifica as chaves do esquema de ladrilho

`new URL('/dados/relevo/{z}/{x}/{y}.png', origin)` vira
`/dados/relevo/%7Bz%7D/%7Bx%7D/%7By%7D.png`, e o MapLibre passa a pedir um arquivo com
esse nome literal — recebendo a **página 404 em HTML, que ele engole sem reportar erro**.

O relevo em ladrilhos nunca chegou a pintar no código real; só nas verificações de
console, onde eu concatenava a URL à mão. O console ficava limpo.

**Solução:** concatenar a URL crua. E, para achar defeito assim, **ler as requisições de
rede**, não o console.

---

## 5. Aba de segundo plano suspende o `requestAnimationFrame`

Este não é bug do projeto, mas custou horas de investigação e vai voltar a confundir.

O MapLibre carrega o stylesheet dentro de `requestAnimationFrame`. Em aba de segundo
plano — ou em Chrome headless sem vsync — o rAF fica suspenso, o estilo nunca carrega e o
mapa aparece **vazio, sem erro nenhum no console**. Os marcadores HTML aparecem mesmo
assim, o que torna o sintoma ainda mais confuso: rótulos sobre o nada.

Sintomas de que é isto, e não defeito real:
- `mapa.isStyleLoaded()` retorna `false` e `mapa.getStyle()` retorna `undefined`
- `document.visibilityState === 'hidden'`
- nenhum erro no console

**Verificação visual exige janela em primeiro plano.** Em automação, o contorno é
substituir `requestAnimationFrame` por `setTimeout` e reaplicar o estilo.

---

## 6. Ano não leva separador de milhar

`1822`, nunca `1.818`. O formatador precisa saber que aquilo é ano — usar
`formato: 'ano'` no `Fato`. Erro clássico de atlas automatizado: ano é rótulo, não
quantidade.

---

## 7. O formatador não pode impor precisão

Arredondar `8509360.85` para `8.509.360,9` **descarta dígito significativo de um valor
declarado como exato**, o que contradiz diretamente a promessa de procedência. O
formatador preserva as casas que o próprio valor carrega, com teto de três.

---

## 8. Português gerado precisa da preposição certa

«pertence Distrito Federal» e «fronteira com Uruguai» faltavam a preposição, que em
português muda com o artigo de cada topônimo: «ao Acre», «à Bahia», «a Minas Gerais»,
«com o Uruguai», «com a Argentina». Nenhum molde único serve.

**Solução adotada:** inverter, com o nome primeiro — `«{nome}: qual é a sigla?»`,
`«{nome}: faz fronteira terrestre com o Brasil?»`. Correto para todos os casos, e melhor
como pista de carta.

---

## 9. Ordenação estável não desempata

`filaDoDia` ordenava por erros menos acertos, que é zero para toda carta nova. A
ordenação estável então caía na ordem do arquivo de origem, e um baralho novo abria sempre
nas mesmas cartas — no Rio Grande do Sul, primeira unidade federativa do arquivo.

**Solução:** desempate sorteado.

---

## 10. Um laço que apagava o próprio resultado

No gerador de ladrilhos, um laço criava diretórios por `y` e depois os removia. Como os
caminhos são `{z}/{x}/{y}.png`, isso apagaria ladrilhos legítimos sempre que uma
coordenada `x` coincidisse numericamente com uma `y` — o que acontece o tempo todo.

Foi pego antes de rodar, por releitura. Vale o hábito.

---

## 11. Natural Earth traz homônimos e perde diacríticos

- **Dois «Natal» e dois «Vila Velha»** punham rótulo de cidade no meio da Amazônia.
  Solução: deduplicar por nome, ficando o de maior população.
- **«Braco Menor»** em vez de «Braço Menor» — alguns topônimos chegam sem cedilha. O
  índice mostra como a fonte grava, porque corrigir à mão criaria uma segunda versão do
  dado que divergiria da carta na primeira atualização. A correção certa é no acervo, com
  nome alternativo registrado.
- **Duas siglas «AR»** nas subdivisões do Chile (La Araucanía e Los Ríos). Vai estourar se
  o Chile ganhar prancha.
