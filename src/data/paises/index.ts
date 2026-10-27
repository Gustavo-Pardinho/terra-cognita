/* =============================================================================
   REGISTRO DE PRANCHAS DE PAÍS
   A rota dinâmica /regioes/[pais] se monta daqui. Acrescentar um país é
   acrescentar um arquivo e uma linha nesta lista.
   ========================================================================== */

import { prancha as brasil } from './brasil';
import { prancha as bolivia } from './bolivia';
import type { PranchaPais } from './prancha';

export const PRANCHAS: PranchaPais[] = [brasil, bolivia];

export const porSlug = (slug: string): PranchaPais | undefined =>
  PRANCHAS.find((p) => p.slug === slug);

export type { PranchaPais };
