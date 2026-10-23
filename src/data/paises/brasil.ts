/* =============================================================================
   BRASIL — item do acervo, tipo entidade-politica
   Prancha de prova da Fase 0. Os valores marcados `verificar: true` foram
   lançados de memória e ainda não foram conferidos contra a fonte primária
   citada; a prancha exibe essa pendência ao leitor. Ver PR. 05.
   ========================================================================== */

import type { Fato, Item, Relacao, Vigencia } from '../../lib/acervo';

export interface Pais extends Item {
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
  capital: { nome: Fato<string>; desde: Fato<number>; ponto: [number, number] };
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
    area: { valor: 8510345.5, unidade: 'km²', ano: 2022, fonte: 'ibge-area', precisao: 'exata', verificar: true },
    altitudeMaxima: { valor: 2995.3, unidade: 'm', ano: 2016, fonte: 'copernicus-dem', precisao: 'exata', verificar: true,
      nota: 'Remedição do Pico da Neblina; o valor histórico de 3.014 m circulou por décadas.' },
    pontoMaisAlto: { valor: 'Pico da Neblina (AM)', fonte: 'geonames', verificar: true },
    fronteiraTerrestre: { valor: 16886, unidade: 'km', fonte: 'itamaraty-limites', precisao: 'aproximada', verificar: true,
      nota: 'Faz fronteira com 10 dos 12 países sul-americanos; só Chile e Equador ficam de fora.' },
    litoral: { valor: 7491, unidade: 'km', fonte: 'ibge-area', precisao: 'aproximada', verificar: true,
      nota: 'Medida da linha de costa sem recortes; com reentrâncias o número é bem maior.' },
    extremoNorte: { valor: 'Monte Caburaí, Roraima', fonte: 'geonames', verificar: true },
    extremoSul: { valor: 'Arroio Chuí, Rio Grande do Sul', fonte: 'geonames', verificar: true },
    biomas: { valor: 6, fonte: 'mapbiomas', precisao: 'exata', verificar: true,
      nota: 'Amazônia, Cerrado, Mata Atlântica, Caatinga, Pampa e Pantanal.' },
    maiorBioma: { valor: 'Amazônia', fonte: 'mapbiomas', verificar: true },
    climaDominante: { valor: 'Af — equatorial úmido', fonte: 'koppen-beck', precisao: 'aproximada', verificar: true,
      nota: 'O território cobre de Af a BSh; nenhuma classe única o descreve.' },
  },

  povo: {
    populacao: { valor: 203080756, unidade: 'hab.', ano: 2022, fonte: 'ibge-censo-2022', precisao: 'exata', verificar: true,
      nota: 'Data de referência do Censo: 1º de agosto de 2022.' },
    densidade: { valor: 23.9, unidade: 'hab./km²', ano: 2022, fonte: 'ibge-censo-2022', precisao: 'aproximada', verificar: true },
    urbanizacao: { valor: 87.1, unidade: '%', ano: 2022, fonte: 'ibge-censo-2022', precisao: 'aproximada', verificar: true },
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
    municipios: { valor: 5570, ano: 2022, fonte: 'ibge-area', precisao: 'exata', verificar: true },
    eleitorado: { valor: 156454011, unidade: 'eleitores', ano: 2022, fonte: 'tse-2022', precisao: 'exata', verificar: true },
  },

  economia: {
    pib: { valor: 10.9, unidade: 'R$ tri', ano: 2023, fonte: 'ibge-pib', precisao: 'aproximada', verificar: true },
    pibPerCapita: { valor: 50194, unidade: 'R$', ano: 2023, fonte: 'ibge-pib', precisao: 'aproximada', verificar: true },
    moeda: { valor: 'Real (BRL)', fonte: 'ibge-pib', precisao: 'exata' },
  },

  capital: {
    nome: { valor: 'Brasília', fonte: 'constituicao-1988', precisao: 'exata' },
    desde: { valor: 1960, formato: 'ano', fonte: 'constituicao-1988', precisao: 'exata',
      nota: 'Inaugurada em 21 de abril de 1960; antes, Rio de Janeiro (1763–1960) e Salvador (1549–1763).' },
    ponto: [-47.8825, -15.7942],
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

/** marcos da linha do tempo — a lente Tempo lendo o mesmo item do acervo */
export const marcos: Array<{ ano: number; titulo: string; nota: string; fonte: string; vigencia?: Vigencia }> = [
  { ano: 1500, titulo: 'Chegada da frota de Cabral', fonte: 'constituicao-1988',
    nota: 'O litoral entra na cartografia europeia; a ocupação indígena do território é de pelo menos 12 mil anos antes.' },
  { ano: 1549, titulo: 'Governo-geral em Salvador', fonte: 'constituicao-1988',
    nota: 'Primeira capital e primeiro aparato administrativo centralizado da colônia.' },
  { ano: 1763, titulo: 'Capital transferida para o Rio de Janeiro', fonte: 'constituicao-1988',
    nota: 'Deslocamento do eixo econômico do açúcar nordestino para o ouro das Minas.' },
  { ano: 1822, titulo: 'Independência', fonte: 'constituicao-1988',
    nota: 'Ruptura sem fragmentação territorial — o oposto do que ocorreu na América espanhola.' },
  { ano: 1888, titulo: 'Abolição da escravidão', fonte: 'constituicao-1988',
    nota: 'Último país das Américas a abolir; cerca de 4,9 milhões de africanos escravizados desembarcaram no território.' },
  { ano: 1889, titulo: 'Proclamação da República', fonte: 'constituicao-1988',
    nota: 'Fim do único império duradouro da América do Sul.' },
  { ano: 1960, titulo: 'Inauguração de Brasília', fonte: 'constituicao-1988',
    nota: 'A capital move-se para o planalto central: decisão geopolítica de interiorização.' },
  { ano: 1964, titulo: 'Golpe militar', fonte: 'constituicao-1988',
    nota: 'Vinte e um anos de regime autoritário, encerrados em 1985.' },
  { ano: 1988, titulo: 'Constituição cidadã', fonte: 'constituicao-1988',
    nota: 'Redesenha o federalismo e eleva o município a ente federado.' },
];
