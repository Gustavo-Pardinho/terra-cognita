/* =============================================================================
   GERAÇÃO DE CARTAS A PARTIR DO ACERVO
   Nenhuma carta é escrita à mão. Cada uma sai de um item que já existe, então
   corrigir o acervo corrige o baralho — e uma carta nunca pode discordar da
   prancha que a originou.
   ========================================================================== */

import type { Carta } from './baralho';
import type { Relacao } from './acervo';
import { capitais, marcos } from '../data/paises/brasil';
import { vigenteEm } from './tempo';

export interface UF { nome: string; sigla: string; regiao: string }

/**
 * Os dois países sul-americanos com os quais o Brasil NÃO faz fronteira. Estão
 * aqui de propósito: sem as cartas negativas o estudante acerta tudo dizendo
 * "sim" a qualquer vizinho, e é justamente Chile e Equador que a prova cobra.
 */
const SEM_FRONTEIRA = ['Chile', 'Equador'];

const bonito = (slug: string) =>
  slug.split('-').map((p) => p[0]!.toUpperCase() + p.slice(1)).join(' ');

export function gerarCartas(ufs: UF[], relacoes: Relacao[]): Carta[] {
  const cartas: Carta[] = [];

  // --- sigla da unidade federativa ------------------------------------------
  for (const uf of ufs) {
    if (!uf.sigla || !uf.nome) continue;
    cartas.push({
      id: `sigla:${uf.sigla}`,
      tipo: 'sigla',
      // Nome primeiro, pergunta depois: evita a preposição, que em português muda
      // com o artigo de cada topônimo — «de Minas Gerais», mas «do Acre» e «da
      // Bahia». E o nome é a pista que a carta quer cobrar, então vem na frente.
      frente: `${uf.nome}: qual é a sigla?`,
      verso: uf.sigla,
      nota: `Região ${uf.regiao}.`,
    });
  }

  // --- macrorregião ---------------------------------------------------------
  for (const uf of ufs) {
    if (!uf.regiao || !uf.nome) continue;
    cartas.push({
      id: `regiao:${uf.sigla}`,
      tipo: 'regiao',
      frente: `${uf.nome}: em que macrorregião fica?`,
      verso: uf.regiao,
    });
  }

  // --- cronologia -----------------------------------------------------------
  for (const m of marcos) {
    cartas.push({
      id: `crono:${m.ano.valor}`,
      tipo: 'cronologia',
      frente: `${m.titulo} — em que ano?`,
      verso: String(m.ano.valor),
      nota: m.nota,
    });
  }

  // --- capital em vigor num ano ---------------------------------------------
  // dois anos dentro de cada vigência: o do meio e um perto da virada, que é
  // onde o estudante erra
  for (const c of capitais) {
    const de = c.vigencia.de ?? 1500;
    const ate = c.vigencia.ate ?? new Date().getFullYear();
    for (const ano of [Math.round((de + ate) / 2), Math.min(ate, de + 5)]) {
      if (!vigenteEm(c.vigencia, ano)) continue;
      cartas.push({
        id: `capital:${ano}`,
        tipo: 'capital',
        frente: `Qual era a capital do Brasil em ${ano}?`,
        verso: c.nome.valor,
        nota: c.nota,
      });
    }
  }

  // --- limítrofes, com as negativas -----------------------------------------
  const limitrofes = relacoes
    .filter((r) => r.tipo === 'faz-fronteira-com')
    .map((r) => bonito(r.alvo));

  for (const nome of [...limitrofes, ...SEM_FRONTEIRA]) {
    const faz = limitrofes.includes(nome);
    cartas.push({
      id: `limite:${nome}`,
      tipo: 'limitrofe',
      // invertido pelo mesmo motivo das siglas: «com Uruguai» pede artigo que muda
      // de país para país, enquanto «com o Brasil» é fixo e sempre correto
      frente: `${nome}: faz fronteira terrestre com o Brasil?`,
      verso: faz ? 'Sim' : 'Não',
      nota: faz
        ? undefined
        : 'Chile e Equador são os dois únicos países sul-americanos sem fronteira com o Brasil.',
    });
  }

  return cartas;
}

/** só para a prancha mostrar de onde o baralho veio */
export function resumoDoBaralho(cartas: Carta[]): Array<{ tipo: string; n: number }> {
  const por = new Map<string, number>();
  for (const c of cartas) por.set(c.tipo, (por.get(c.tipo) ?? 0) + 1);
  return [...por.entries()].map(([tipo, n]) => ({ tipo, n }));
}
