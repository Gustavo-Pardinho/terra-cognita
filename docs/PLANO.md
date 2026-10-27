# Plano até o fim do projeto

Um atlas nunca fica pronto. «Fim do projeto» aqui significa: a estrutura completa, com as
quatro lentes e as dez seções funcionando, de modo que só reste acumular conteúdo. Este
arquivo lista o que falta e **por que nesta ordem**.

---

## A. Terceira prancha de país, fora da América do Sul — *primeiro*

**Candidato: Portugal.**

A segunda prancha generalizou o molde; a terceira diz se ele já está estável. Portugal
foi escolhido por quebrar o que a Bolívia não quebrou:

- **Extensão do relevo.** A pirâmide assada cobre só a América do Sul
  (`lon -74..-34, lat -34..6`). Portugal obriga a assar outra região e revela tudo que
  ainda está preso ao recorte sul-americano — inclusive a `CAIXA` da lente Rede e o
  `paises.geojson`, que hoje tem treze países de um continente só.
- **Território não contíguo.** Açores e Madeira. Nenhuma prancha testou isso.
- **Laço histórico com o Brasil.** Tordesilhas e a transferência da corte em 1808 passam a
  ser declaráveis dos dois lados, como já acontece com o Acre.

**Por que primeiro:** é muito mais barato descobrir o que o molde ainda não suporta na
terceira prancha do que na vigésima. E tudo depois disso assume o molde estável.

**Riscos conhecidos:** `scripts/preparar-relevo.mjs` tem a caixa cravada; vai precisar
virar parâmetro. A lente Rede supõe um continente só.

---

## B. A lente Verbete — *a maior lacuna*

A única das quatro lentes que não existe, e a que mais serve ao estudo de história,
geopolítica, ideologias e filosofia. **Hoje o atlas tem muito mapa e pouco texto.**

As doze disciplinas previstas na arquitetura original: história, geografia, geopolítica,
política, economia, ideologias, arqueologia, filosofia, religiões, línguas, ciência e
técnica, e cartografia (a história do próprio mapa).

**Depende de A** porque os verbetes vão apontar para pranchas, e mudar o molde depois de
escrever cem links custa caro.

**Decisão ainda em aberto:** o formato. MDX em `src/content/` com coleção tipada é o
caminho natural no Astro, e a pasta `src/content` chegou a existir e foi removida quando
ficou vazia. O verbete precisa poder citar `<Dado>` do acervo, e isso em MDX exige expor
o registro ao componente.

---

## C. Busca com paleta de comandos (⌘K) — *depois de B*

Com verbetes e dezenas de pranchas, navegar sem busca desmorona. Uma entrada só para
item, verbete, coordenada (`-22.9 -43.2`), ano (`1648`) e comando
(`projeção: equal earth`).

É barato: o índice se gera em build, como o gazeteiro já faz. Mas só faz sentido quando
houver o que buscar.

---

## D. Comparar — *precisa de pelo menos três pranchas*

- Dois lugares lado a lado na **escala verdadeira**, não na que a projeção sugere
- Duas épocas do mesmo lugar, com cortina de arraste
- Dois indicadores sobre o mesmo recorte, com dispersão ao lado do mapa

Com duas pranchas a comparação é pobre. Entra depois de A.

---

## E. Glossário

Termos de todas as disciplinas, cada um com link para onde é usado em contexto e, quando
couber, com um mapa mínimo que o explica. Barato, e acompanha os verbetes.

---

## F. Caderno, coleções e exportação — *valor menor do que parece*

- **Prancha em PDF A3:** barato, é folha de estilo de impressão. Vale fazer.
- **Caderno e coleções:** viáveis em `localStorage`, mas sem sincronização valem pouco.
  **Decidir se vale antes de construir** — pode ser que não valha.
- **Imagem anotada para exportação:** caro, e o ganho sobre o permalink é pequeno.

---

## G. Domínio próprio

`terracognita.org` nunca foi registrado. Quando for:

1. Registrar e apontar para o Worker em Settings → Domains & Routes
2. Definir `SITE_URL=https://terracognita.org` nas variáveis do build

O endereço canônico já vem do ambiente justamente para isso. Sem a variável, o build usa
o endereço do Workers, que é o correto por enquanto.

---

## O gargalo real: escrita, não código

Vale encarar isto de frente antes de planejar duzentas pranchas.

O mapa é trabalho finito e boa parte já está feita. **Os verbetes não são.** Cada prancha
de país leva algumas horas de pesquisa e conferência — a do Brasil levou uma rodada
inteira de verificação que achou seis erros, a da Bolívia achou dois.

Antes de escalar, duas perguntas a responder:

1. **Quantas pranchas por semana você sustenta?** O site deve parecer completo nesse
   ritmo, com lacunas declaradas em vez de páginas vazias — que é o que ele já faz hoje
   em `/regioes` e `/404`.
2. **A conferência entra no fluxo ou vira dívida?** A regra que funcionou foi: escrever
   com `verificar: true` e conferir numa rodada própria. Isso só funciona enquanto a
   rodada de fato acontece. Duas pranchas em zero pendências são o padrão a manter.

---

## O que NÃO fazer

Decidido e vale manter:

- **Conta de usuário.** O atlas não quer guardar dado de ninguém.
- **Gamificação** — cronômetro, sequência de dias, ranking.
- **Bate-papo ou comentários.**
- **Servidor de qualquer tipo.** Cada um deles custa manutenção e desvia do que o atlas é.
- **Acervo com cláusula não comercial novo**, a menos que conscientemente. Já há dois, e
  eles prendem o projeto à forma sem fins comerciais.
