# Decisões e o porquê de cada uma

O código se relê. O raciocínio que levou a ele, não — e é por isso que este arquivo
existe. Cada decisão abaixo foi tomada contra uma alternativa concreta, e a alternativa
está registrada junto.

---

## 1. O nome: Terra Cognita

O mapa histórico marcava o desconhecido como *terra incognita*. Um atlas é a operação
inversa: o trabalho paciente de transformar o incógnito em conhecido. O nome diz o que o
site faz, não o que ele é, e o latim atravessa idiomas sem tradução.

**Descartados:** Cosmographia (nome real da disciplina renascentista que juntava mapa,
história e economia — prestígio, mas uma sílaba a mais), Meridiano (mais leve e mais
brasileiro, seria a escolha se a intenção fosse menos erudita) e Orbis (colide com um
projeto acadêmico conhecido de geografia romana).

---

## 2. A identidade vem da convenção cartográfica, não do design de produto

Atlas impressos têm uma linguagem visual de quatro séculos: rampa de altitude,
graticulado, neatline duplo, cartucho de título, barra de escala, numeração de prancha e
uma hierarquia de rótulo que diz o tipo do lugar pela forma da letra. Nada disso é
ornamento — tudo carrega informação.

**O erro que quase cometi:** a primeira tentativa derivou para «papel creme + serifa +
terracota», que é o visual genérico que todo gerador de IA produz. O mundo visual real de
um atlas é a **rampa hipsométrica** e o **azul batimétrico**, não papel creme.

- **Paleta de dados:** rampa hipsométrica de 15 faixas (`--h-abismo` #0A2133 →
  `--h-neve` #D9D4CC), **idêntica nos dois temas**, porque cor de altitude é dado.
- **Base:** prancha noturna #0E1A24 (azul batimétrico, nunca preto) / cartolina #E7E9E3
  (papel frio de viés verde, **não creme**).
- **Acento:** latão #D9972B, a lâmpada sobre a mesa de mapas. Magenta de agrimensor
  #C4327E só para marca ativa, foco e disputa.
- **Tipografia:** Iowan Old Style (texto e display) + Avenir Next (interface) + Menlo
  (coordenadas, anos, escalas). Faces do sistema, sem webfont — fallback silencioso é
  pior que a segunda escolha.
- **Hierarquia de rótulo de mapa:** versal espaçada = região, redonda = cidade (corpo
  pela população), itálico serifado azul = água, monoespaçada = cota e coordenada.
- **Geometria:** raio zero em tudo. Prancha de atlas não tem canto arredondado.

`src/styles/tokens.css` é a fonte única. Nenhum componente declara cor, corpo ou espaço
literal.

---

## 3. Um só acervo, quatro lentes

**A decisão estrutural do projeto.** Organizar por disciplina — uma seção de história,
uma de geografia, uma de economia — produziria dez acervos paralelos que repetem os
mesmos fatos e divergem na primeira correção. A Revolução de 1848 é história, política,
economia e geografia urbana ao mesmo tempo.

Em vez disso guarda-se **uma coisa só** — item com geometria, vigência, relações e
fontes — e olha-se de **quatro maneiras**:

| Lente | Pergunta | Estado |
|---|---|---|
| Mapa | onde | pronta (`/atlas`) |
| Tempo | quando | pronta (`/tempo`) |
| Rede | com quem | pronta (`/rede`) |
| Verbete | por quê | **não construída** |

A disciplina deixa de ser gaveta e passa a ser filtro.

---

## 4. Procedência por afirmação, não por rodapé

A diferença entre este atlas e um blog com mapas bonitos é uma só: **toda afirmação sabe
de onde veio**. Isso precisava estar no modelo de dados desde o primeiro dia, porque
retroalimentar fonte em mil verbetes depois é inviável.

- Todo valor exibido é um `Fato`: valor, unidade, ano, precisão e **fonte**.
- `<Dado>` é o único caminho para pôr número na tela, e exige a fonte.
- Citar fonte não cadastrada em `src/lib/fontes.ts` **quebra o build**.
- Valor com `verificar: true` aparece na lista de pendências da prancha, visível ao
  leitor. A lista de incertezas conhecidas é parte do método, não defeito a esconder.

**Isso se provou.** A primeira rodada de conferência do Brasil achou seis valores errados
e quatro fontes mal atribuídas — todos entre os que o mecanismo apontava. A da Bolívia
achou dois, ambos com cara de precisos.

### Cinco regras editoriais

1. **Fonte por afirmação**, não por verbete.
2. **Disputa mostrada como disputa**, com as reivindicações e quem as faz.
3. **Incerteza explícita** — data aproximada desenhada como aproximada.
4. **Divergência preservada** quando as fontes discordam.
5. **Erro com histórico** — correção visível e datada, nunca edição silenciosa.

A regra 4 já foi exercida quatro vezes: municípios do Brasil (5.569 em lei contra 5.571
na série estatística), municípios da Bolívia (314/327/340, divergência temporal), PIB
boliviano em dólares (câmbio oficial contra paralelo) e PIB per capita boliviano (o censo
encolheu o denominador).

---

## 5. Nenhum servidor, nunca

Um atlas que fica caro no segundo mês não vira fonte de estudo para ninguém.

- **Relevo:** pirâmide de 345 ladrilhos PNG indexados (z3–z7, 4,2 MB), assada em build de
  um DEM real. Nenhum servidor de ladrilho em tempo de execução.
- **Rótulos:** marcadores HTML, não texto do motor. Nenhum servidor de glifo — e, de
  quebra, é o que permite usar a tipografia real do atlas, já que nenhum servidor de
  glifo reproduz Iowan itálico para hidrografia.
- **Consulta:** GeoJSON estático. Sem banco de dados.
- **Progresso de estudo:** `localStorage`. Sem conta de usuário, e não vai haver — o
  atlas não quer guardar dado de ninguém. O preço é que não atravessa máquinas, e a
  página diz isso antes de o leitor estudar cem cartas.

**PMTiles foi descartado:** o pacote do npm só lê, e escrever o formato à mão seria um
formato novo para manter sem ganho real sobre arquivos estáticos.

---

## 6. O molde de prancha, e o que a segunda prancha ensinou

A prancha de país tem **oito blocos fixos**: perfil físico, povo, sistema político,
economia, história, posição geopolítica, questões abertas e leitura adicional.

O Brasil provou o molde. A **Bolívia foi escolhida para quebrá-lo**, não por ser
interessante — e quebrou em quatro pontos, cada um virando uma distinção que o Brasil
sozinho nunca revelaria:

1. **Duas capitais ao mesmo tempo.** O molde supunha sucessão. Sucre é capital
   constitucional desde 1825 e La Paz é sede de governo desde 1899, simultaneamente.
   Daí o campo `funcao`.
2. **Campo que não se aplica ≠ campo que falta.** A Bolívia é mediterrânea: `litoral` vem
   `null` e a prancha declara «não se aplica — país mediterrâneo». Deixar em branco
   pareceria dado ausente, quando a falta de litoral é o fato que mais a condiciona.
3. **Perda de território, não só ganho.** `Territorio` ganhou `sentido` e `contraparte`.
   E ganhou `origem`, porque **território perdido não está no arquivo de subdivisões de
   quem o perdeu**: o Acre está no do Brasil, o Litoral está no do Chile.
4. **Nem todo país tem classificação oficial de biomas.** O Brasil tem o mapa do IBGE com
   seis; a Bolívia não tem equivalente. Derivar uma contagem de ecorregiões estrangeiras
   daria ao leitor um número com aparência oficial que nenhum órgão do país publicou.

A prancha de país deixou de ser página e virou **rota dinâmica** (`[pais].astro`) sobre o
registro em `src/data/paises/index.ts`. Acrescentar um país é acrescentar um arquivo e
uma linha.

---

## 7. Incerteza desenhada como incerteza

Dois casos exemplares, e os dois valem como precedente:

- **Linha de Tordesilhas:** o tratado fixa o limite a 370 léguas a oeste de Cabo Verde, e
  qual meridiano é isso depende da légua e da ilha de referência — ambas disputadas à
  época. O mapa desenha a **faixa inteira** de incerteza, com o traçado tradicional
  pontilhado dentro. Uma linha fina ali inventaria precisão que a fonte não tem.
- **Território em disputa:** hachura cruzada gerada em canvas, com limite próprio. O
  contorno nacional **não é redesenhado** antes da data de incorporação, porque a
  fronteira daquela época era ela mesma disputada.

---

## 8. Licenças por camada

- **Código** (`src/`, `scripts/`): MIT.
- **Conteúdo e dados** (verbetes, `src/data/`, `public/dados/`): CC BY-SA 4.0.

O CompartilhaIgual **não foi escolha estética**: o MapBiomas é CC BY-SA e a cláusula se
propaga para obra derivada.

**A ressalva que importa saber antes de crescer:** SlaveVoyages (CC BY-NC, em uso) e
David Rumsey (CC BY-NC-SA, cadastrado para as camadas históricas) prendem o produto de
dados à forma **sem fins comerciais**, mesmo com o código em MIT. Se um dia precisar
deixar de ser, esses dois teriam de ser trocados por equivalentes permissivos.

---

## 9. Pilha técnica, e por quê

| Escolha | Razão |
|---|---|
| Astro 5 | verbete gerado estaticamente, mapa como ilha interativa |
| MapLibre GL | aberto, sem chave de API, sem custo por visualização |
| Cloudflare Workers com assets estáticos | caminho que a Cloudflare mantém; Pages ficou para trás |
| `.node-version` em vez de variável no painel | configuração que mora no painel é configuração que ninguém lembra que existe |
| `SITE_URL` por ambiente | domínio próprio ainda não existe; declarar um que não resolve serve sitemap quebrado |

**Verificação automática a cada push** roda `astro check` e `astro build`. Como citar
fonte não cadastrada quebra o build, a regra de procedência passa a ser aplicada pela
máquina e não pela disciplina de quem escreve.
