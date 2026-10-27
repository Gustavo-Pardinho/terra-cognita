/* =============================================================================
   BRASIL — item do acervo, tipo entidade-politica
   Prancha de prova. Todos os valores foram conferidos contra a fonte citada em
   26/10/2026 — a primeira rodada encontrou seis números errados e quatro fontes
   mal atribuídas. Ver PR. 05.

   Ao acrescentar valor novo, marque `verificar: true` até conferir no documento
   primário: a prancha mostra a pendência ao leitor em vez de escondê-la, e é
   isso que torna a lista de incertezas parte do método.

   Atenção ao que envelhece: o IBGE republica a área territorial todo ano, e o
   PIB tem estimativa preliminar antes dos dados definitivos. Valor com `ano`
   declarado é valor que precisa ser revisitado.
   ========================================================================== */

import { criarRegistro, type Capital, type Fato, type Relacao, type Territorio, type Vigencia } from '../../lib/acervo';
import type { Marco, PaisItem, PranchaPais } from './prancha';

export interface Pais extends PaisItem {
  fisico: {
    area: Fato<number>;
    altitudeMaxima: Fato<number>;
    pontoMaisAlto: Fato<string>;
    fronteiraTerrestre: Fato<number>;
    litoral: Fato<number>;
    extremoNorte: Fato<string>;
    extremoSul: Fato<string>;
    biomas: Fato<number>;
    maiorBioma: Fato<string>;
    climaDominante: Fato<string>;
  };
  povo: {
    populacao: Fato<number>;
    densidade: Fato<number>;
    urbanizacao: Fato<number>;
    idioma: Fato<string>;
  };
  politica: {
    forma: Fato<string>;
    sistema: Fato<string>;
    constituicao: Fato<string>;
    unidadesFederativas: Fato<number>;
    municipios: Fato<number>;
    eleitorado: Fato<number>;
  };
  economia: {
    pib: Fato<number>;
    pibPerCapita: Fato<number>;
    moeda: Fato<string>;
  };
}

export interface Pais extends PaisItem {
  fisico: {
    area: Fato<number>;
    altitudeMaxima: Fato<number>;
    pontoMaisAlto: Fato<string>;
    fronteiraTerrestre: Fato<number>;
    litoral: Fato<number>;
    extremoNorte: Fato<string>;
    extremoSul: Fato<string>;
    biomas: Fato<number>;
    maiorBioma: Fato<string>;
    climaDominante: Fato<string>;
  };
  povo: {
    populacao: Fato<number>;
    densidade: Fato<number>;
    urbanizacao: Fato<number>;
    idioma: Fato<string>;
  };
  politica: {
    forma: Fato<string>;
    sistema: Fato<string>;
    constituicao: Fato<string>;
    unidadesFederativas: Fato<number>;
    municipios: Fato<number>;
    eleitorado: Fato<number>;
  };
  economia: {
    pib: Fato<number>;
    pibPerCapita: Fato<number>;
    moeda: Fato<string>;
  };
}

export const brasil: Pais = {
  slug: 'brasil',
  tipo: 'entidade-politica',
  nome: 'Brasil',
  nomeOficial: {
    valor: 'República Federativa do Brasil',
    fonte: 'constituicao-1988',
    precisao: 'exata',
    nota: 'Denominação do art. 1º da Constituição de 1988.',
  },
  nomesAlternativos: ['Terra de Santa Cruz', 'Brasil Império', 'Estados Unidos do Brasil'],
  vigencia: { de: 1822, precisao: 'exata' },
  ponto: [-51.9253, -14.235],

  fisico: {
    area: { valor: 8509360.85, unidade: 'km²', ano: 2026, fonte: 'ibge-area', precisao: 'exata',
      nota: 'Portaria IBGE de março de 2026. A área oficial é republicada todo ano conforme os limites '
          + 'municipais são refinados: esta edição recuou 18,7 km² em relação à de 2024.' },
    altitudeMaxima: { valor: 2995.3, unidade: 'm', ano: 2016, fonte: 'ibge-altimetria', precisao: 'exata',
      nota: 'O valor anterior do IBGE era 2.993,78 m. A revisão de 2016 somou 1,52 m ao recalcular com o '
          + 'modelo geoidal MAPGEO2015 — mudou o método de medida, não a montanha.' },
    pontoMaisAlto: { valor: 'Pico da Neblina (AM)', fonte: 'ibge-altimetria', precisao: 'exata',
      nota: 'Serra do Imeri, na fronteira com a Venezuela, dentro da Terra Indígena Yanomami.' },
    fronteiraTerrestre: { valor: 16886, unidade: 'km', fonte: 'itamaraty-limites', precisao: 'aproximada',
      nota: 'Faz fronteira com 9 dos 12 países sul-americanos — só Chile e Equador ficam de fora — mais a '
          + 'Guiana Francesa, que é departamento ultramarino da França e não país sul-americano.' },
    litoral: { valor: 7491, unidade: 'km', fonte: 'ibge-area', precisao: 'aproximada',
      nota: 'Do Oiapoque ao Chuí, medido sem recortes. Com reentrâncias o número é bem maior — o valor '
          + 'depende da escala de medição, que é o paradoxo da linha de costa.' },
    extremoNorte: { valor: 'Nascente do rio Ailã, Monte Caburaí (RR)', fonte: 'ibge-pontos-extremos', precisao: 'exata',
      nota: 'Reconhecido oficialmente em 1998, fica cerca de 84 km ao norte do Oiapoque — que boa parte '
          + 'dos livros escolares ainda ensina como o extremo norte.' },
    extremoSul: { valor: 'Arroio Chuí, Chuí (RS)', fonte: 'ibge-pontos-extremos', precisao: 'exata' },
    biomas: { valor: 6, ano: 2019, fonte: 'ibge-biomas-2019', precisao: 'exata',
      nota: 'Amazônia (49,5% do território), Cerrado (23,3%), Mata Atlântica (13%), Caatinga (10,1%), '
          + 'Pampa (2,3%) e Pantanal (1,8%).' },
    maiorBioma: { valor: 'Amazônia', ano: 2019, fonte: 'ibge-biomas-2019', precisao: 'exata',
      nota: 'Ocupa 49,5% do território — quase metade do país num só bioma.' },
    climaDominante: { valor: 'Aw — tropical de savana', fonte: 'alvares-koppen-2013', precisao: 'exata',
      nota: 'Aw cobre cerca de 33% do território, à frente de Am (~28%) e Af (~22%). A zona tropical A '
          + 'soma 81,4% do país, mas nenhuma classe única o descreve: o território vai de Af a BSh.' },
  },

  povo: {
    populacao: { valor: 203080756, unidade: 'hab.', ano: 2022, fonte: 'ibge-censo-2022', precisao: 'exata',
      nota: 'Data de referência do Censo: 1º de agosto de 2022. Número já revisado pelo IBGE; '
          + 'crescimento de 6,5% sobre o Censo de 2010.' },
    densidade: { valor: 23.9, unidade: 'hab./km²', ano: 2022, fonte: 'ibge-censo-2022', precisao: 'aproximada',
      nota: 'Derivada da população de 2022 sobre a área de 2026. A média nacional descreve mal qualquer '
          + 'lugar real: a população se concentra numa faixa litorânea estreita.' },
    urbanizacao: { valor: 87.4, unidade: '%', ano: 2022, fonte: 'ibge-censo-2022', precisao: 'exata',
      nota: '177,5 milhões de pessoas em área urbana contra 25,6 milhões em área rural.' },
    idioma: { valor: 'Português', fonte: 'constituicao-1988', precisao: 'exata',
      nota: 'Art. 13: idioma oficial. O país reconhece ainda mais de 270 línguas indígenas e Libras.' },
  },

  politica: {
    forma: { valor: 'República federativa presidencialista', fonte: 'constituicao-1988', precisao: 'exata' },
    sistema: { valor: 'Bicameral — Câmara dos Deputados e Senado Federal', fonte: 'constituicao-1988', precisao: 'exata' },
    constituicao: { valor: '5 de outubro de 1988', fonte: 'constituicao-1988', precisao: 'exata',
      nota: 'Sétima constituição do país; a primeira é de 1824.' },
    unidadesFederativas: { valor: 27, fonte: 'constituicao-1988', precisao: 'exata',
      nota: '26 estados e o Distrito Federal.' },
    municipios: { valor: 5569, ano: 2026, fonte: 'ibge-area', precisao: 'exata',
      nota: 'São 5.569 municípios juridicamente constituídos. A série estatística do IBGE costuma trazer '
          + '5.571 porque conta também Brasília, cidade coextensiva ao Distrito Federal, e Fernando de '
          + 'Noronha, distrito estadual de Pernambuco — nenhum dos dois é município em lei. Daí a '
          + 'divergência entre fontes que citam 5.569, 5.570 ou 5.571.' },
    eleitorado: { valor: 156454011, unidade: 'eleitores', ano: 2022, fonte: 'tse-2022', precisao: 'exata',
      nota: 'Aptos a votar nas eleições gerais de 2022, distribuídos pelo país e por 181 localidades no '
          + 'exterior. Alta de 6,21% sobre 2018.' },
  },

  economia: {
    pib: { valor: 10.9, unidade: 'R$ tri', ano: 2023, fonte: 'ibge-pib', precisao: 'aproximada',
      nota: 'Dados definitivos das Contas Nacionais: crescimento de 3,2% em 2023, acima dos 2,9% da '
          + 'estimativa preliminar.' },
    pibPerCapita: { valor: 51693.92, unidade: 'R$', ano: 2023, fonte: 'ibge-pib', precisao: 'exata' },
    moeda: { valor: 'Real (BRL)', fonte: 'ibge-pib', precisao: 'exata' },
  },

  relacoes: [
    { tipo: 'faz-fronteira-com', alvo: 'uruguai',        fonte: 'itamaraty-limites' },
    { tipo: 'faz-fronteira-com', alvo: 'argentina',      fonte: 'itamaraty-limites' },
    { tipo: 'faz-fronteira-com', alvo: 'paraguai',       fonte: 'itamaraty-limites' },
    { tipo: 'faz-fronteira-com', alvo: 'bolivia',        fonte: 'itamaraty-limites' },
    { tipo: 'faz-fronteira-com', alvo: 'peru',           fonte: 'itamaraty-limites' },
    { tipo: 'faz-fronteira-com', alvo: 'colombia',       fonte: 'itamaraty-limites' },
    { tipo: 'faz-fronteira-com', alvo: 'venezuela',      fonte: 'itamaraty-limites' },
    { tipo: 'faz-fronteira-com', alvo: 'guiana',         fonte: 'itamaraty-limites' },
    { tipo: 'faz-fronteira-com', alvo: 'suriname',       fonte: 'itamaraty-limites' },
    { tipo: 'faz-fronteira-com', alvo: 'guiana-francesa', fonte: 'itamaraty-limites' },
    { tipo: 'membro-de', alvo: 'mercosul',  vigencia: { de: 1991 }, fonte: 'itamaraty-limites' },
    { tipo: 'sucede',    alvo: 'imperio-do-brasil', vigencia: { de: 1889 }, fonte: 'constituicao-1988' },
  ] satisfies Relacao[],
};

/**
 * Marcos da linha do tempo — a lente Tempo lendo o mesmo item do acervo.
 *
 * A data de cada marco é um `Fato`: é ela a afirmação que a fonte sustenta.
 * Sem isso a fonte não é validada no build nem entra na lista da prancha, e foi
 * exatamente o buraco que deixou 18 afirmações de 1500 a 1964 citando a
 * Constituição de 1988 como fonte.
 */
/**
 * Territórios com data de incorporação — a primeira geometria datada do acervo.
 *
 * O Acre é o caso mais limpo que os dados sustentam: era boliviano, foi ocupado
 * por seringueiros brasileiros e só passou ao Brasil pelo Tratado de Petrópolis,
 * em 1903. O polígono vem do mesmo arquivo das unidades federativas, então a
 * mudança de fronteira é derivada do acervo, não desenhada à mão.
 *
 * O mapa NÃO redesenha o contorno nacional antes de 1903. A fronteira
 * Brasil-Bolívia daquela época era ela própria disputada — foi essa a causa do
 * conflito —, e traçá-la com os dados de hoje fingiria uma precisão que a fonte
 * não tem. Em vez disso o território aparece hachurado e rotulado como em
 * disputa, que é o que a PR. 05 manda fazer.
 */
export const territorios: Territorio[] = [
  {
    slug: 'acre',
    nome: { valor: 'Acre', fonte: 'tratado-petropolis', precisao: 'exata' },
    uf: 'AC',
    origem: 'brasil',
    vigencia: { de: 1903, precisao: 'exata' },
    sentido: 'ganho',
    contraparte: 'Bolívia',
    nota: 'Território boliviano ocupado por seringueiros brasileiros durante o ciclo da borracha. '
        + 'A Bolívia cedeu-o pelo Tratado de Petrópolis mediante indenização de dois milhões de libras '
        + 'e o compromisso de construir a ferrovia Madeira-Mamoré.',
  },
];

/**
 * Sequência de capitais. É o dado que o controle de ano comanda no mapa: mover
 * o ano move o marcador, porque cada capital carrega a própria vigência.
 * A capital atual é derivada daqui — não há um campo `capital` duplicado no item.
 */
export const capitais: Capital[] = [
  {
    nome: { valor: 'Salvador', fonte: 'ibge-500-anos', precisao: 'exata' },
    ponto: [-38.5108, -12.9777],
    vigencia: { de: 1549, ate: 1763, precisao: 'exata' },
    nota: 'Sede do governo-geral, primeiro aparato administrativo centralizado da colônia.',
  },
  {
    nome: { valor: 'Rio de Janeiro', fonte: 'ibge-500-anos', precisao: 'exata' },
    ponto: [-43.1729, -22.9068],
    vigencia: { de: 1763, ate: 1960, precisao: 'exata' },
    nota: 'A transferência acompanha o deslocamento do eixo econômico do açúcar nordestino para o ouro das Minas.',
  },
  {
    nome: { valor: 'Brasília', fonte: 'constituicao-1988', precisao: 'exata' },
    ponto: [-47.8825, -15.7942],
    vigencia: { de: 1960, precisao: 'exata' },
    nota: 'Inaugurada em 21 de abril de 1960. A mudança para o planalto central é decisão geopolítica de interiorização.',
  },
];

/** A capital em vigor hoje, derivada da sequência. */
export const capitalAtual = capitais[capitais.length - 1]!;

export const marcos: Marco[] = [
  {
    ano: { valor: 1500, formato: 'ano', fonte: 'ibge-500-anos', precisao: 'exata' },
    titulo: 'Chegada da frota de Cabral',
    nota: 'O litoral entra na cartografia europeia; a ocupação indígena do território é de pelo menos 12 mil anos antes.',
  },
  {
    ano: { valor: 1549, formato: 'ano', fonte: 'ibge-500-anos', precisao: 'exata' },
    titulo: 'Governo-geral em Salvador',
    nota: 'Primeira capital e primeiro aparato administrativo centralizado da colônia.',
  },
  {
    ano: { valor: 1763, formato: 'ano', fonte: 'ibge-500-anos', precisao: 'exata' },
    titulo: 'Capital transferida para o Rio de Janeiro',
    nota: 'Deslocamento do eixo econômico do açúcar nordestino para o ouro das Minas.',
  },
  {
    ano: { valor: 1822, formato: 'ano', fonte: 'planalto-leis', precisao: 'exata' },
    titulo: 'Independência',
    nota: 'Ruptura sem fragmentação territorial — o oposto do que ocorreu na América espanhola.',
  },
  {
    ano: { valor: 1888, formato: 'ano', fonte: 'planalto-leis', precisao: 'exata' },
    titulo: 'Abolição da escravidão',
    nota: 'Lei nº 3.353, de 13 de maio. Último país das Américas a abolir.',
  },
  {
    ano: { valor: 1889, formato: 'ano', fonte: 'planalto-leis', precisao: 'exata' },
    titulo: 'Proclamação da República',
    nota: 'Fim do único império duradouro da América do Sul.',
  },
  {
    ano: { valor: 1903, formato: 'ano', fonte: 'tratado-petropolis', precisao: 'exata' },
    titulo: 'Incorporação do Acre',
    nota: 'Última grande alteração do território brasileiro. A Bolívia cede o Acre pelo Tratado de Petrópolis.',
  },
  {
    ano: { valor: 1960, formato: 'ano', fonte: 'planalto-leis', precisao: 'exata' },
    titulo: 'Inauguração de Brasília',
    nota: 'A capital move-se para o planalto central: decisão geopolítica de interiorização.',
  },
  {
    ano: { valor: 1964, formato: 'ano', fonte: 'arquivo-nacional', precisao: 'exata' },
    titulo: 'Golpe militar',
    nota: 'Vinte e um anos de regime autoritário, encerrados em 1985.',
  },
  {
    ano: { valor: 1988, formato: 'ano', fonte: 'constituicao-1988', precisao: 'exata' },
    titulo: 'Constituição cidadã',
    nota: 'Redesenha o federalismo e eleva o município a ente federado.',
  },
];

/** Estimativa do tráfico transatlântico com destino ao território brasileiro. */
export const trafico = {
  desembarcados: {
    valor: 4.9, unidade: 'milhões', fonte: 'slavevoyages',
    precisao: 'estimada',
    nota: 'Africanos escravizados desembarcados no Brasil, cerca de 39% de todo o tráfico transatlântico '
        + 'e a maior cifra de qualquer destino nas Américas. As estimativas sérias variam de 4,8 a 5,5 '
        + 'milhões, por isso o valor é declarado como estimado e não exato.',
  } satisfies Fato<number>,
};

/**
 * Registro da prancha do Brasil. Existe num lugar só porque duas páginas o
 * exibem — a prancha e o índice de regiões — e montá-lo duas vezes com entradas
 * diferentes fazia os números divergirem para o mesmo item.
 */
export const registroBrasil = () => criarRegistro({ brasil, capitais, territorios, marcos, trafico });

/* =============================================================================
   A PRANCHA
   ========================================================================== */
export const prancha: PranchaPais = {
  slug: 'brasil',
  n: 1,
  nome: 'Brasil',
  regiao: 'América do Sul',
  item: brasil,
  capitais,
  territorios,
  marcos,
  extras: { 'trafico.desembarcados': trafico.desembarcados },
  registro: registroBrasil,
  mapa: { centro: [-52.5, -14.5], zoom: 3.3 },
  prosa: {
    sintese:
      'A maior extensão contínua da América do Sul, sem cordilheira interna e com dez '
      + 'vizinhos terrestres — limites todos negociados em mesa, nenhum tomado em desfiladeiro.',
    fisico:
      'O território é grande o bastante para que nenhuma classe climática o descreva: a '
      + 'dominante divide o país com semiárido, cerrado tropical sazonal e subtropical '
      + 'úmido de inverno frio. A ausência de uma cordilheira interna é a característica '
      + 'física que mais consequências políticas produziu — não há barreira orográfica '
      + 'separando as regiões, e os rios correm para dentro em vez de para fora.',
    fisicoNota: {
      t: 'Por que a altitude importa aqui.',
      d: 'Um país sem montanha alta não tem reserva de água em geleira, não tem passo de '
       + 'montanha disputável e não tem fronteira natural defensável. As três ausências '
       + 'aparecem na história diplomática: os limites brasileiros foram negociados em '
       + 'mesa, não tomados em desfiladeiro.',
    },
    fisicoFalta: {
      t: 'O que falta nesta prancha.',
      d: 'Perfil topográfico e hipsometria por consulta dependem do DEM em resolução '
       + 'maior que a assada. O relevo desenhado é o do atlas; medir altitude ponto a '
       + 'ponto ainda não dá.',
    },
    povo:
      'A densidade média esconde o fato central da geografia humana brasileira: a '
      + 'população se concentra numa faixa litorânea estreita, e o interior permanece '
      + 'vazio em escala continental. A média nacional descreve mal qualquer lugar real '
      + 'do país — é o caso-escola de quando o coroplético por densidade engana e o '
      + 'cartograma é o mapa certo.',
    politica:
      'A Constituição de 1988 fez do município um ente federado com competência própria '
      + '— arranjo raro no mundo, e que explica por que o número de municípios é um dado '
      + 'político e não apenas administrativo.',
    economiaLeitura:
      'O Brasil é a economia que mais consistentemente aparece na lista das dez maiores '
      + 'do mundo sem nunca ter convergido para a renda alta. Ler isso como fracasso de '
      + 'política econômica ou como efeito estrutural da posição na divisão internacional '
      + 'do trabalho é uma escolha interpretativa, não um dado — e as duas leituras têm '
      + 'literatura séria. Este atlas apresenta as duas quando chegar o verbete de '
      + 'economia política.',
    economiaNota: {
      t: 'Cuidado com a comparação de PIB.',
      d: 'Valores em moeda corrente não se comparam entre anos sem deflator, nem entre '
       + 'países sem paridade de poder de compra. A série harmonizada do Banco Mundial '
       + 'entra justamente para que a comparação deixe de depender do leitor fazer a '
       + 'conversão de cabeça.',
    },
    geopolitica:
      'São dez vizinhos terrestres: nove dos doze países sul-americanos — só Chile e '
      + 'Equador ficam de fora — mais a Guiana Francesa, que é departamento ultramarino '
      + 'da França e não país sul-americano. Essa é a característica que define sua '
      + 'posição: nenhum vizinho é adversário histórico consolidado, e nenhuma fronteira '
      + 'está hoje em litígio armado — situação incomum para um território dessa extensão.',
    destaque: {
      rotulo: 'Tráfico transatlântico',
      caminho: 'trafico.desembarcados',
      texto: 'de africanos escravizados desembarcados entre 1561 e 1856 — a maior cifra de '
           + 'qualquer destino nas Américas, e cerca de 39% de todo o tráfico. Nenhum mapa do '
           + 'Brasil se explica sem isso.',
    },
    questoes: [
      { t: 'Área exata', d: 'O IBGE republica a área territorial todo ano conforme os limites municipais são refinados. Edições anteriores de atlas trazem números diferentes, e a divergência precisa aparecer em vez de ser resolvida em silêncio.' },
      { t: 'Contagem de municípios', d: 'São 5.569 em lei, mas a série estatística do IBGE traz 5.571 porque conta Brasília e Fernando de Noronha. Três números circulam, e nenhum é errado — depende do que se está contando.' },
      { t: 'Linha de costa', d: 'Depende inteiramente da escala de medição, que é o paradoxo da costa. Um número sem a escala junto é incompleto.' },
      { t: 'Fronteira marítima', d: 'A plataforma continental estendida reivindicada pelo Brasil ainda não está totalmente homologada pela ONU; é território de status indefinido.' },
    ],
    leituras: [
      { t: 'Caio Prado Jr.', d: 'Formação do Brasil Contemporâneo (1942)' },
      { t: 'Sérgio Buarque de Holanda', d: 'Raízes do Brasil (1936)' },
      { t: 'Celso Furtado', d: 'Formação Econômica do Brasil (1959)' },
      { t: "Aziz Ab'Sáber", d: 'Os Domínios de Natureza no Brasil (2003)' },
    ],
  },
};
