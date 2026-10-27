/* =============================================================================
   BOLÍVIA — item do acervo, tipo entidade-politica
   Segunda prancha de país, e a que serviu para testar o molde. Ela o quebrou em
   quatro pontos: duas capitais simultâneas em vez de sucessão, ausência de
   litoral em vez de litoral pequeno, 37 idiomas oficiais em vez de um, e perda
   de território em vez de ganho.

   Valores conferidos em 27/10/2026. A conferência achou dois erros: o eleitorado
   estava 623 votos fora do número do OEP, e o extremo sul estava inteiramente
   errado — é o Cerro Guayaques em Potosí, não uma quebrada em Tarija. Os dois
   tinham cara de precisos e nenhum dos dois era.
   ========================================================================== */

import {
  criarRegistro,
  type Capital, type Fato, type Relacao, type Territorio,
} from '../../lib/acervo';
import type { Marco, PaisItem, PranchaPais } from './prancha';

export interface Bolivia extends PaisItem {}

export const bolivia: Bolivia = {
  slug: 'bolivia',
  tipo: 'entidade-politica',
  nome: 'Bolívia',
  nomeOficial: {
    valor: 'Estado Plurinacional da Bolívia',
    fonte: 'cpe-bolivia-2009',
    precisao: 'exata',
    nota: 'Denominação adotada pela Constituição de 2009, que substituiu «República de Bolivia».',
  },
  nomesAlternativos: ['Alto Peru', 'República de Bolívar', 'República de Bolivia'],
  vigencia: { de: 1825, precisao: 'exata' },
  ponto: [-64.6, -16.3],

  fisico: {
    area: { valor: 1098581, unidade: 'km²', fonte: 'ine-bolivia-geografia', precisao: 'exata',
      nota: 'Pouco mais de um oitavo do território brasileiro — e cerca de 45% do que a Bolívia '
          + 'tinha ao nascer, em 1825.' },
    altitudeMaxima: { valor: 6542, unidade: 'm', fonte: 'ine-bolivia-geografia', precisao: 'exata',
      nota: 'Nevado Sajama, vulcão extinto no altiplano de Oruro. Mais que o dobro do ponto '
          + 'culminante brasileiro.' },
    pontoMaisAlto: { valor: 'Nevado Sajama (Oruro)', fonte: 'ine-bolivia-geografia', precisao: 'exata',
      nota: 'Vulcão extinto no altiplano. O território vai dele aos 70 m da planície do rio Paraguai — '
          + 'mais de 6.400 m de desnível dentro do mesmo país.' },
    fronteiraTerrestre: { valor: 6743, unidade: 'km', fonte: 'ine-bolivia-geografia', precisao: 'aproximada',
      nota: 'Cinco vizinhos: Brasil, Peru, Chile, Argentina e Paraguai. Com três deles a '
          + 'fronteira atual é resultado de território perdido.' },
    // O molde previa litoral porque o Brasil tem. A Bolívia não tem, e a ausência
    // não é um dado faltando: é o dado mais importante da sua geografia política.
    litoral: null,
    extremoNorte: { valor: 'Confluência dos rios Madeira e Abuná (Pando)', fonte: 'ine-bolivia-geografia',
      precisao: 'exata', nota: '9°40′S 65°26′O. O país se estende daqui até 22°53′S.' },
    extremoSul: { valor: 'Cerro Guayaques (Potosí)', fonte: 'ine-bolivia-geografia', precisao: 'exata',
      nota: '22°54′S 67°31′O, no altiplano andino junto à fronteira com o Chile.' },
    // Não há classificação oficial boliviana de biomas equivalente à do IBGE.
    biomas: null,
    maiorBioma: null,
    climaDominante: { valor: 'Sem classe dominante: altiplano frio e árido ao sul, tropical úmido ao norte',
      fonte: 'koppen-beck', precisao: 'aproximada',
      nota: 'O país vai de BWk no altiplano a Af na Amazônia boliviana, com mais de 6.500 m de '
          + 'desnível entre os extremos. Nenhuma classe única descreve o território.' },
  },

  povo: {
    populacao: { valor: 11365333, unidade: 'hab.', ano: 2024, fonte: 'ine-bolivia', precisao: 'exata',
      nota: 'Resultados finais do Censo 2024, divulgados em agosto de 2025. Encontraram cerca de '
          + '880 mil pessoas a menos que as projeções que vinham sendo usadas.' },
    densidade: { valor: 10.3, unidade: 'hab./km²', ano: 2024, fonte: 'ine-bolivia', precisao: 'aproximada',
      nota: 'Menos da metade da densidade brasileira, e igualmente enganosa: a população se '
          + 'concentra no eixo La Paz–Cochabamba–Santa Cruz.' },
    urbanizacao: { valor: 69, unidade: '%', ano: 2024, fonte: 'ine-bolivia', precisao: 'exata',
      nota: '7,85 milhões em área urbana contra 3,52 milhões em área rural — sete bolivianos '
          + 'em cada dez.' },
    idioma: { valor: 'Castelhano e 36 idiomas indígenas', fonte: 'cpe-bolivia-2009', precisao: 'exata',
      nota: 'O art. 5º da Constituição de 2009 declara oficiais o castelhano e todos os idiomas '
          + 'das nações e povos indígena-originário-camponeses, listando 36. É o arranjo '
          + 'linguístico oficial mais plural das Américas.' },
  },

  politica: {
    forma: { valor: 'Estado unitário social de direito plurinacional comunitário', fonte: 'cpe-bolivia-2009', precisao: 'exata',
      nota: 'Unitário com autonomias, não federativo — o oposto do arranjo brasileiro.' },
    sistema: { valor: 'Bicameral — Câmara de Deputados e Câmara de Senadores', fonte: 'cpe-bolivia-2009', precisao: 'exata' },
    constituicao: { valor: '7 de fevereiro de 2009', fonte: 'cpe-bolivia-2009', precisao: 'exata',
      nota: 'Aprovada em referendo de 25 de janeiro de 2009. Refundou o Estado como plurinacional.' },
    unidadesFederativas: { valor: 9, fonte: 'cpe-bolivia-2009', precisao: 'exata',
      nota: 'Nove departamentos. Houve um décimo, Litoral, extinto ao ser cedido ao Chile.' },
    municipios: { valor: 340, ano: 2021, fonte: 'ine-bolivia', precisao: 'aproximada',
      nota: 'Fontes trazem 314, 327 e 340, e a divergência é temporal, não metodológica: a Bolívia vem '
          + 'criando municípios, treze deles por volta de 2020. Cada número está certo para a sua data.' },
    eleitorado: { valor: 7937138, unidade: 'eleitores', ano: 2025, fonte: 'oep-bolivia', precisao: 'exata',
      nota: 'Habilitados nas eleições gerais de 17 de agosto de 2025: 7.567.207 em território nacional e '
          + '369.931 no exterior.' },
  },

  economia: {
    pib: { valor: 52.34, unidade: 'US$ bi', ano: 2023, fonte: 'wdi', precisao: 'exata',
      nota: 'PIB corrente em dólares. Fontes nacionais citam cifras bem menores quando convertem '
          + 'pelo câmbio paralelo, que destoa do oficial — a divergência é cambial, não contábil.' },
    pibPerCapita: { valor: 4274.71, unidade: 'US$', ano: 2023, fonte: 'wdi', precisao: 'exata',
      nota: 'Valor publicado pelo Banco Mundial, que usa a sua própria projeção populacional de '
          + 'cerca de 12,2 milhões. Recalculado com a população do Censo 2024, dá cerca de '
          + 'US$ 4.605 — o censo encolheu o denominador e levantou o per capita.' },
    moeda: { valor: 'Boliviano (BOB)', fonte: 'cpe-bolivia-2009', precisao: 'exata' },
  },

  relacoes: [
    { tipo: 'faz-fronteira-com', alvo: 'brasil',    fonte: 'tratado-petropolis' },
    { tipo: 'faz-fronteira-com', alvo: 'peru',      fonte: 'cpe-bolivia-2009' },
    { tipo: 'faz-fronteira-com', alvo: 'chile',     fonte: 'tratado-paz-1904' },
    { tipo: 'faz-fronteira-com', alvo: 'argentina', fonte: 'cpe-bolivia-2009' },
    { tipo: 'faz-fronteira-com', alvo: 'paraguai',  fonte: 'tratado-chaco-1938' },
  ] satisfies Relacao[],
};

/* =============================================================================
   DUAS CAPITAIS AO MESMO TEMPO
   O molde supunha sucessão: uma capital de cada vez, cada qual com a sua
   vigência. A Bolívia tem duas simultâneas com funções distintas, e tratá-las
   como sucessão falsearia o arranjo. Daí o campo `funcao`.
   ========================================================================== */
export const capitais: Capital[] = [
  {
    nome: { valor: 'Sucre', fonte: 'cpe-bolivia-2009', precisao: 'exata' },
    ponto: [-65.2619, -19.0196],
    vigencia: { de: 1825, precisao: 'exata' },
    funcao: 'capital constitucional',
    nota: 'O art. 6º da Constituição nomeia Sucre como capital. Sedia o Tribunal Supremo de '
        + 'Justiça, e nada mais do governo. Chamava-se Chuquisaca e La Plata antes de 1839.',
  },
  {
    nome: { valor: 'La Paz', fonte: 'cpe-bolivia-2009', precisao: 'exata' },
    ponto: [-68.1193, -16.4897],
    vigencia: { de: 1899, precisao: 'exata' },
    funcao: 'sede de governo',
    nota: 'Sedia o Executivo e o Legislativo desde a Guerra Federal de 1898–1899, vencida pelos '
        + 'liberais paceños. A sede mudou; a capital, em lei, não.',
  },
];

export const capitalAtual = capitais[0]!;

/* =============================================================================
   TERRITÓRIOS PERDIDOS
   O molde só previa ganho, porque o Brasil só ganhou. A Bolívia perdeu cerca de
   55% do que tinha em 1825, e é isso que explica a sua geografia política atual.
   ========================================================================== */
export const territorios: Territorio[] = [
  {
    slug: 'litoral-boliviano',
    nome: { valor: 'Litoral', fonte: 'tratado-paz-1904', precisao: 'exata' },
    uf: 'AN',
    origem: 'chile',
    vigencia: { de: 1825, ate: 1904, precisao: 'exata' },
    sentido: 'perda',
    contraparte: 'Chile',
    nota: 'Departamento costeiro perdido na Guerra do Pacífico. O Chile o administra desde o '
        + 'Pacto de Trégua de 1884 e a cessão virou definitiva no Tratado de Paz de 1904. '
        + 'A geometria desenhada é a da atual Região de Antofagasta, que cobre aproximadamente '
        + 'o antigo Litoral — não é o limite histórico, que o acervo ainda não tem.',
  },
  {
    slug: 'acre-boliviano',
    nome: { valor: 'Acre', fonte: 'tratado-petropolis', precisao: 'exata' },
    uf: 'AC',
    origem: 'brasil',
    vigencia: { de: 1825, ate: 1903, precisao: 'exata' },
    sentido: 'perda',
    contraparte: 'Brasil',
    nota: 'Cedido pelo Tratado de Petrópolis, após ser ocupado por seringueiros brasileiros '
        + 'durante o ciclo da borracha. É o mesmo evento que a prancha do Brasil registra como '
        + 'ganho — e as duas prancheiras citam o mesmo tratado.',
  },
];

export const marcos: Marco[] = [
  {
    ano: { valor: 1825, formato: 'ano', fonte: 'cpe-bolivia-2009', precisao: 'exata' },
    titulo: 'Independência',
    nota: 'O Alto Peru se separa e adota o nome do libertador. Nasce com saída para o mar.',
  },
  {
    ano: { valor: 1879, formato: 'ano', fonte: 'tratado-paz-1904', precisao: 'exata' },
    titulo: 'Guerra do Pacífico',
    nota: 'Aliada ao Peru contra o Chile, a Bolívia perde o controle do Litoral. A derrota '
        + 'define a geografia política do país até hoje.',
  },
  {
    ano: { valor: 1899, formato: 'ano', fonte: 'cpe-bolivia-2009', precisao: 'exata' },
    titulo: 'Guerra Federal e a mudança da sede',
    nota: 'A vitória liberal leva o Executivo e o Legislativo de Sucre para La Paz. A capital '
        + 'constitucional permanece em Sucre, e a duplicidade dura até hoje.',
  },
  {
    ano: { valor: 1903, formato: 'ano', fonte: 'tratado-petropolis', precisao: 'exata' },
    titulo: 'Cessão do Acre',
    nota: 'Cerca de 191 mil km² passam ao Brasil pelo Tratado de Petrópolis, em troca de '
        + 'indenização e da ferrovia Madeira-Mamoré.',
  },
  {
    ano: { valor: 1904, formato: 'ano', fonte: 'tratado-paz-1904', precisao: 'exata' },
    titulo: 'Tratado de Paz com o Chile',
    nota: 'Torna definitiva a perda do Litoral. A Bolívia passa a ser mediterrânea em direito, '
        + 'e não só de fato.',
  },
  {
    ano: { valor: 1932, formato: 'ano', fonte: 'tratado-chaco-1938', precisao: 'exata' },
    titulo: 'Guerra do Chaco',
    nota: 'Três anos de guerra com o Paraguai pelo Chaco Boreal, que se acreditava rico em '
        + 'petróleo. A mais sangrenta da América do Sul no século XX.',
  },
  {
    ano: { valor: 1938, formato: 'ano', fonte: 'tratado-chaco-1938', precisao: 'exata' },
    titulo: 'Tratado de Paz com o Paraguai',
    nota: 'Cerca de 234 mil km² do Chaco passam ao Paraguai. É a última grande perda territorial.',
  },
  {
    ano: { valor: 1952, formato: 'ano', fonte: 'cpe-bolivia-2009', precisao: 'exata' },
    titulo: 'Revolução Nacional',
    nota: 'Nacionalização das minas de estanho, reforma agrária e voto universal, que até então '
        + 'excluía analfabetos — a maioria indígena do país.',
  },
  {
    ano: { valor: 2009, formato: 'ano', fonte: 'cpe-bolivia-2009', precisao: 'exata' },
    titulo: 'Constituição plurinacional',
    nota: 'Refunda o Estado como plurinacional, oficializa 36 idiomas indígenas e reconhece '
        + 'autonomias indígenas originário-camponesas.',
  },
];

/** Perda territorial acumulada — o dado que organiza esta prancha. */
export const perdaTerritorial = {
  proporcao: {
    valor: 55, unidade: '%', fonte: 'tratado-paz-1904',
    precisao: 'estimada',
    nota: 'Proporção do território de 1825 perdida até 1938, somando as cessões a Chile, Brasil, '
        + 'Paraguai, Argentina e Peru. As estimativas variam conforme o que se considera '
        + 'efetivamente controlado em 1825, que era pouco em boa parte da Amazônia e do Chaco.',
  } satisfies Fato<number>,
};

export const registroBolivia = () =>
  criarRegistro({ bolivia, capitais, territorios, marcos, perdaTerritorial });

/* =============================================================================
   A PRANCHA
   ========================================================================== */
export const prancha: PranchaPais = {
  slug: 'bolivia',
  n: 2,
  nome: 'Bolívia',
  regiao: 'América do Sul',
  item: bolivia,
  capitais,
  territorios,
  marcos,
  extras: { 'perdaTerritorial.proporcao': perdaTerritorial.proporcao },
  registro: registroBolivia,
  mapa: { centro: [-64.6, -16.6], zoom: 4.4 },
  prosa: {
    sintese:
      'O país que perdeu mais território do que qualquer outro nas Américas e ficou sem mar. '
      + 'Tem duas capitais ao mesmo tempo, 37 idiomas oficiais e 6.500 metros de desnível '
      + 'entre o altiplano e a Amazônia.',
    fisico:
      'Dois países num só território. O altiplano, acima de 3.600 metros, é frio, árido e '
      + 'densamente povoado desde antes da colônia; as terras baixas do norte e do leste são '
      + 'tropicais úmidas e foram ocupadas tarde. Entre os dois há mais de seis mil metros de '
      + 'desnível, e é esse degrau — não uma fronteira — que divide a Bolívia por dentro. '
      + 'A ausência de litoral não é um dado que falta: é o fato que mais condiciona a sua '
      + 'economia e a sua diplomacia.',
    fisicoNota: {
      t: 'Por que a altitude importa aqui.',
      d: 'Ao contrário do Brasil, a Bolívia tem cordilheira interna, passo de montanha '
       + 'disputável e reserva de água em geleira — e perdeu território justamente onde a '
       + 'montanha encontra o deserto. A guerra pelo Litoral foi uma guerra por nitrato e '
       + 'por porto, travada num dos lugares mais inóspitos do continente.',
    },
    fisicoFalta: {
      t: 'O que falta nesta prancha.',
      d: 'O Chaco cedido ao Paraguai em 1938 não aparece no mapa. Diferente do Litoral e do '
       + 'Acre, ele não corresponde a uma subdivisão só: espalha-se por três departamentos '
       + 'paraguaios e o limite cedido não coincide com nenhum deles. Desenhar um recorte '
       + 'aproximado daria ao leitor uma linha que a fonte não tem.',
    },
    povo:
      'Sete bolivianos em cada dez vivem em área urbana, e quase três quartos da população '
      + 'estão no eixo La Paz–Cochabamba–Santa Cruz. O Censo de 2024 trouxe a surpresa que '
      + 'reorganiza qualquer leitura demográfica do país: encontrou cerca de 880 mil pessoas '
      + 'a menos que as projeções em uso, o que mexe em tudo que se calcula por habitante.',
    politica:
      'Estado unitário com autonomias, não federação — o oposto do arranjo brasileiro. '
      + 'A Constituição de 2009 refundou o país como plurinacional e oficializou 36 idiomas '
      + 'indígenas ao lado do castelhano, o arranjo linguístico oficial mais plural das '
      + 'Américas. E manteve a duplicidade de capitais que a Guerra Federal de 1899 produziu.',
    economiaLeitura:
      'A economia boliviana é lida há um século pela chave do enclave extrativo: prata em '
      + 'Potosí, borracha no Acre, estanho no altiplano, gás em Tarija, lítio em Uyuni. Cada '
      + 'ciclo organizou o território em torno de um ponto de saída, e três das grandes perdas '
      + 'territoriais aconteceram em áreas cujo valor só ficou claro quando já estavam sendo '
      + 'disputadas. Ler isso como maldição dos recursos ou como efeito da posição mediterrânea '
      + 'é escolha interpretativa, e as duas têm literatura séria.',
    economiaNota: {
      t: 'Cuidado com o PIB em dólares.',
      d: 'A Bolívia opera com câmbio oficial fixo e um mercado paralelo que destoa dele, o que '
       + 'torna o PIB em dólares genuinamente ambíguo. Fontes sérias chegam a números bem '
       + 'diferentes sem que nenhuma esteja errada — está medindo outra coisa. E o per capita '
       + 'mudou sozinho quando o censo encolheu o denominador.',
    },
    geopolitica:
      'Cinco vizinhos, e com três deles a fronteira atual é o resultado de território perdido: '
      + 'Chile em 1904, Brasil em 1903, Paraguai em 1938. A reivindicação de acesso soberano ao '
      + 'mar segue viva na política externa boliviana e foi levada à Corte Internacional de '
      + 'Justiça, que em 2018 decidiu que o Chile não tem obrigação jurídica de negociar. '
      + 'A disputa não acabou; mudou de foro.',
    geopoliticaNota: {
      t: 'Uma disputa no presente.',
      d: 'Ao contrário das fronteiras brasileiras, todas assentadas, a questão marítima '
       + 'boliviana é litígio diplomático ativo. O atlas mostra a disputa como disputa também '
       + 'quando ela é contemporânea, não só quando é histórica.',
    },
    destaque: {
      rotulo: 'Território perdido desde 1825',
      caminho: 'perdaTerritorial.proporcao',
      texto: 'do que o país tinha ao nascer, somadas as cessões a Chile, Brasil, Paraguai, '
           + 'Argentina e Peru. É a maior perda territorial proporcional das Américas, e é a '
           + 'chave para ler o mapa atual.',
    },
    questoes: [
      { t: 'Qual é a capital', d: 'Sucre em lei, La Paz na prática. Atlas e enciclopédias discordam entre si, e boa parte simplesmente escreve «La Paz» sem nota. Esta prancha registra as duas com a função de cada uma.' },
      { t: 'Quanto território foi perdido', d: 'Os 55% mais citados dependem de considerar como boliviano em 1825 áreas da Amazônia e do Chaco sobre as quais o Estado não exercia controle efetivo. A cifra é defensável, mas não é uma medição.' },
      { t: 'O limite histórico do Litoral', d: 'A geometria desenhada é a da atual Região de Antofagasta, que apenas aproxima o antigo departamento. O limite de 1825 exigiria cartografia histórica georreferenciada.' },
      { t: 'População antes de 2024', d: 'O censo corrigiu as projeções para baixo em cerca de 880 mil pessoas. Qualquer indicador per capita publicado antes de agosto de 2025 usa o denominador antigo.' },
    ],
    leituras: [
      { t: 'Eduardo Galeano', d: 'As Veias Abertas da América Latina (1971) — o capítulo de Potosí' },
      { t: 'Herbert S. Klein', d: 'A Concise History of Bolivia (2003)' },
      { t: 'Silvia Rivera Cusicanqui', d: 'Oprimidos pero no vencidos (1984)' },
      { t: 'Bruce Farcau', d: 'The Chaco War (1996)' },
    ],
  },
};
