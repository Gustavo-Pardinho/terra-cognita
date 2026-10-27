/* =============================================================================
   MOLDE DA PRANCHA DE PAÍS
   O que a prancha precisa de cada país para se montar. Os oito blocos da PR. 03
   são fixos; a prosa de cada um é própria do país e vive no seu arquivo de dados,
   não no molde.

   Bloco que não se aplica a um país recebe `null` de propósito: a prancha então
   declara a lacuna em vez de omitir em silêncio. Foi o caso do litoral na
   Bolívia, que é mediterrânea — e foi essa ausência que obrigou o molde a prever
   campo que não se aplica, em vez de campo que falta.
   ========================================================================== */

import type { Capital, Fato, Item, Registro, Territorio, Vigencia } from '../../lib/acervo';

export interface Marco {
  ano: Fato<number>;
  titulo: string;
  nota: string;
}

export interface BlocoFisico {
  area: Fato<number>;
  altitudeMaxima: Fato<number>;
  pontoMaisAlto: Fato<string>;
  fronteiraTerrestre: Fato<number>;
  /** null quando o país é mediterrâneo; a prancha diz isso em vez de omitir */
  litoral: Fato<number> | null;
  extremoNorte: Fato<string>;
  extremoSul: Fato<string>;
  /**
   * null quando o país não tem classificação oficial de biomas. O Brasil tem o
   * mapa do IBGE com seis; a Bolívia não tem equivalente nacional, e inventar
   * uma contagem a partir de ecorregiões estrangeiras seria dar ao leitor um
   * número com aparência oficial que nenhum órgão do país publicou.
   */
  biomas: Fato<number> | null;
  maiorBioma: Fato<string> | null;
  climaDominante: Fato<string>;
}

export interface PaisItem extends Item {
  fisico: BlocoFisico;
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

/** Texto próprio do país. Fato nenhum entra aqui: números vêm do item. */
export interface Prosa {
  /** uma linha que situa o país, sob o nome, na prancha do mapa */
  sintese: string;
  fisico: string;
  fisicoNota: { t: string; d: string };
  fisicoFalta: { t: string; d: string };
  povo: string;
  politica: string;
  economiaLeitura: string;
  economiaNota: { t: string; d: string };
  geopolitica: string;
  geopoliticaNota?: { t: string; d: string };
  /** um valor avulso que a prancha destaca, com o caminho dele no registro */
  destaque?: { rotulo: string; caminho: string; texto: string };
  questoes: Array<{ t: string; d: string }>;
  leituras: Array<{ t: string; d: string }>;
}

export interface PranchaPais {
  slug: string;
  /** número da prancha dentro do atlas, na ordem em que foram feitas */
  n: number;
  nome: string;
  regiao: string;
  item: PaisItem;
  capitais: Capital[];
  territorios: Territorio[];
  marcos: Marco[];
  /** valores avulsos que a prancha cita mas não cabem no item */
  extras?: Record<string, Fato<number> | Fato<string>>;
  registro: () => Registro;
  mapa: { centro: [number, number]; zoom: number };
  prosa: Prosa;
}

export type { Capital, Territorio, Vigencia };
