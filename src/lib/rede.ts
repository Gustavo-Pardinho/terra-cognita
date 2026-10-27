/* =============================================================================
   LENTE REDE
   O grafo de relações do acervo, desenhado nas posições geográficas reais em
   vez de num layout de força. Num atlas, a rede tem lugar: ver que a aresta do
   Acre liga dois vizinhos e que a do Litoral chega ao mar diz mais do que
   qualquer arranjo abstrato dos mesmos nós.
   ========================================================================== */

export interface No {
  slug: string;
  rotulo: string;
  /** [longitude, latitude] */
  ponto: [number, number];
  /** nó com prancha própria recebe realce e link */
  temPrancha: boolean;
}

export interface Aresta {
  de: string;
  para: string;
  tipo: 'fronteira' | 'territorio';
  /** só nas arestas de território */
  rotulo?: string;
  ano?: number;
  fonte?: string;
  nota?: string;
}

/** centroide do maior anel de um polígono, para posicionar o nó */
export function centroide(geom: GeoJSON.Geometry): [number, number] | null {
  const aneis: number[][][] =
    geom.type === 'Polygon' ? [geom.coordinates[0] as number[][]]
    : geom.type === 'MultiPolygon' ? (geom.coordinates as number[][][][]).map((p) => p[0] as number[][])
    : [];
  if (!aneis.length) return null;
  const maior = aneis.reduce((a, b) => (b.length > a.length ? b : a));
  let x = 0, y = 0;
  for (const c of maior) { x += c[0]!; y += c[1]!; }
  return [x / maior.length, y / maior.length];
}

/* =============================================================================
   PROJEÇÃO DO DIAGRAMA
   Equirretangular simples sobre a extensão sul-americana. Não é projeção de
   mapa: é um diagrama que usa posição real para situar o leitor, e por isso a
   prancha diz explicitamente que não se deve medir distância nele.
   ========================================================================== */

export const CAIXA = { oeste: -82, leste: -33, norte: 14, sul: -56 };

export function projetar(
  [lon, lat]: [number, number],
  largura: number,
  altura: number,
): [number, number] {
  const x = ((lon - CAIXA.oeste) / (CAIXA.leste - CAIXA.oeste)) * largura;
  const y = ((CAIXA.norte - lat) / (CAIXA.norte - CAIXA.sul)) * altura;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

/** arco suave entre dois pontos, curvado para a esquerda do sentido de ida */
export function arco(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
  curvatura = 0.18,
): string {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const cx = mx - dy * curvatura, cy = my + dx * curvatura;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}
