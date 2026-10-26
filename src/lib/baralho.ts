/* =============================================================================
   BARALHO — repetição espaçada gerada do acervo
   As cartas não são escritas à mão: são derivadas dos itens. Escrevê-las à mão
   duplicaria fatos que o acervo já guarda, e as duas cópias divergiriam na
   primeira correção. Corrigir o acervo corrige o baralho. Ver PR. 03.
   ========================================================================== */

export type TipoCarta = 'sigla' | 'regiao' | 'cronologia' | 'capital' | 'limitrofe';

export interface Carta {
  /** estável entre sessões: é a chave do agendamento guardado no navegador */
  id: string;
  tipo: TipoCarta;
  frente: string;
  verso: string;
  /** contexto que só aparece depois de virar a carta */
  nota?: string;
}

export const ROTULO_TIPO: Record<TipoCarta, string> = {
  sigla: 'Siglas das unidades federativas',
  regiao: 'Macrorregiões',
  cronologia: 'Cronologia',
  capital: 'Capitais na história',
  limitrofe: 'Países limítrofes',
};

/* =============================================================================
   AGENDAMENTO
   SM-2 reduzido ao essencial. Três respostas em vez de seis notas: errei, quase,
   acertei. A escala de seis notas do SM-2 original pede ao estudante uma
   autoavaliação fina que ele não consegue fazer com honestidade, e o ganho de
   precisão não compensa o atrito.
   ========================================================================== */

export type Resposta = 'errei' | 'quase' | 'acertei';

export interface Agendamento {
  /** intervalo em dias até a próxima revisão */
  intervalo: number;
  /** fator de facilidade do SM-2; piso de 1.3 para a carta difícil não sumir */
  facilidade: number;
  /** data ISO (só o dia) da próxima revisão */
  proximaEm: string;
  acertos: number;
  erros: number;
}

const HOJE = () => new Date().toISOString().slice(0, 10);

export function agendamentoInicial(): Agendamento {
  return { intervalo: 0, facilidade: 2.5, proximaEm: HOJE(), acertos: 0, erros: 0 };
}

export function reagendar(a: Agendamento, r: Resposta): Agendamento {
  let { intervalo, facilidade, acertos, erros } = a;

  if (r === 'errei') {
    // volta ao começo, mas a facilidade cai pouco: punir demais faz a carta
    // reaparecer para sempre e o baralho vira um castigo
    facilidade = Math.max(1.3, facilidade - 0.2);
    intervalo = 0;
    erros += 1;
  } else {
    const q = r === 'quase' ? 0.15 : 0;
    facilidade = Math.max(1.3, facilidade + 0.1 - q);
    intervalo = intervalo === 0 ? 1 : intervalo === 1 ? 3 : Math.round(intervalo * facilidade);
    acertos += 1;
  }

  const proxima = new Date();
  proxima.setDate(proxima.getDate() + intervalo);
  return { intervalo, facilidade, proximaEm: proxima.toISOString().slice(0, 10), acertos, erros };
}

export function vencidaHoje(a: Agendamento | undefined): boolean {
  if (!a) return true;                       // nunca vista: entra na fila
  return a.proximaEm <= HOJE();
}

/* =============================================================================
   PERSISTÊNCIA
   Fica no navegador. Não há conta de usuário e não vai haver: o atlas não quer
   guardar dado de ninguém. O preço é que o progresso não atravessa máquinas, e
   a página diz isso ao estudante em vez de deixar descobrir sozinho.
   ========================================================================== */

const CHAVE = 'tc-baralho-v1';

export function carregarProgresso(): Record<string, Agendamento> {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as Record<string, Agendamento>) : {};
  } catch {
    return {};                               // armazenamento bloqueado: sessão sem memória
  }
}

export function salvarProgresso(p: Record<string, Agendamento>): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(p));
  } catch { /* sem armazenamento: o estudo da sessão vale, o histórico não */ }
}

/**
 * Fila do dia: vencidas primeiro, e dentro delas as que mais erraram.
 *
 * O desempate é sorteado. Sem isso a ordenação estável cai na ordem do arquivo
 * de origem, e um baralho novo abriria sempre nas mesmas cartas — no caso das
 * unidades federativas, sempre no Rio Grande do Sul.
 */
export function filaDoDia(
  cartas: Carta[],
  progresso: Record<string, Agendamento>,
  limite = 20,
): Carta[] {
  const peso = (c: Carta) => {
    const p = progresso[c.id];
    return p ? p.erros - p.acertos : 0;
  };
  return cartas
    .filter((c) => vencidaHoje(progresso[c.id]))
    .map((c) => ({ c, p: peso(c), r: Math.random() }))
    .sort((a, b) => (b.p - a.p) || (a.r - b.r))
    .slice(0, limite)
    .map((x) => x.c);
}
