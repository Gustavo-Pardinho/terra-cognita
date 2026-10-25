/* =============================================================================
   O TEMPO — vigência comandando as camadas
   Todo item do acervo guarda `vigencia`. Mover o ano não troca de página: troca
   o que está em vigor. Ver PR. 03 e PR. 04.
   ========================================================================== */

import type { Vigencia } from './acervo';

export const ANO_MINIMO = 1450;
export const ANO_MAXIMO = 2026;

/** um item está em vigor no ano dado? `ate` ausente significa ainda vigente */
export function vigenteEm(v: Vigencia | undefined, ano: number): boolean {
  if (!v) return true;                       // sem vigência declarada = atemporal
  if (v.de !== undefined && ano < v.de) return false;
  if (v.ate !== undefined && ano > v.ate) return false;
  return true;
}

/** rótulo curto do estado de vigência, para legenda e inspetor */
export function estadoDeVigencia(v: Vigencia | undefined, ano: number): 'em vigor' | 'ainda não' | 'revogada' {
  if (!v) return 'em vigor';
  if (v.de !== undefined && ano < v.de) return 'ainda não';
  if (v.ate !== undefined && ano > v.ate) return 'revogada';
  return 'em vigor';
}

/* =============================================================================
   LINHA DE TORDESILHAS
   O tratado de 1494 fixou o limite a 370 léguas a oeste de Cabo Verde. Qual
   meridiano é isso depende de qual légua e de qual ilha se toma como referência,
   e as duas coisas eram disputadas à época — o que produz uma faixa de várias
   centenas de quilômetros, não uma linha.

   Desenhar uma linha fina aqui seria inventar precisão que a fonte não tem. Por
   isso a faixa inteira aparece, com o traçado tradicional marcado dentro dela.
   Ver PR. 05, "nunca uma linha dura onde a fonte não tem uma linha dura".
   ========================================================================== */

export const TORDESILHAS = {
  assinado: 1494,
  /** substituído pelo Tratado de Madri, que adotou o uti possidetis */
  revogado: 1750,
  /** traçado tradicional da cartografia histórica */
  meridianoTradicional: -46.6,
  /** extremos defensáveis segundo a légua e a ilha de referência adotadas */
  meridianoOeste: -49.75,
  meridianoLeste: -42.5,
  fonte: 'tratado-tordesilhas',
} as const;

/** faixa de incerteza e traçado tradicional, como GeoJSON */
export function tordesilhas(): GeoJSON.FeatureCollection {
  const norte = 6, sul = -34;
  const passo = 1;
  const coluna = (lon: number): [number, number][] => {
    const pts: [number, number][] = [];
    for (let lat = norte; lat >= sul; lat -= passo) pts.push([lon, lat]);
    return pts;
  };
  const oeste = coluna(TORDESILHAS.meridianoOeste);
  const leste = coluna(TORDESILHAS.meridianoLeste);

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { tipo: 'faixa', precisao: 'estimada' },
        geometry: {
          type: 'Polygon',
          coordinates: [[...oeste, ...leste.slice().reverse(), oeste[0]!]],
        },
      },
      {
        type: 'Feature',
        properties: { tipo: 'tracado', precisao: 'estimada' },
        geometry: { type: 'LineString', coordinates: coluna(TORDESILHAS.meridianoTradicional) },
      },
    ],
  };
}

/* =============================================================================
   ESCALA DO TEMPO
   Posição proporcional de um ano dentro da faixa coberta pelo atlas. A escala
   logarítmica da PR. 03 entra quando o acervo alcançar o Pleistoceno; por ora a
   faixa é moderna e a escala linear descreve bem.
   ========================================================================== */

export function posicaoNaFaixa(ano: number, de = ANO_MINIMO, ate = ANO_MAXIMO): number {
  return Math.max(0, Math.min(1, (ano - de) / (ate - de)));
}
