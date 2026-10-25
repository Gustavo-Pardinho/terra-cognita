/* =============================================================================
   ACERVO — o modelo de item e o mecanismo de referência
   Um só acervo, quatro lentes. Todo valor exibido no atlas é um Fato: carrega
   valor, unidade, ano, precisão e fonte. O verbete nunca digita um número que
   o acervo já guarda. Ver PR. 03 e PR. 05.
   ========================================================================== */

import { obterFonte, type Fonte } from './fontes';

/** grau de certeza — governa também como o mapa desenha o limite */
export type Precisao = 'exata' | 'aproximada' | 'estimada' | 'disputada';

export interface Fato<T = number | string> {
  valor: T;
  unidade?: string;
  /** ano de referência do dado, não da publicação */
  ano?: number;
  /** id cadastrado em src/lib/fontes.ts */
  fonte: string;
  precisao?: Precisao;
  nota?: string;
  /**
   * true = valor ainda não conferido contra a fonte primária.
   * A prancha mostra isso ao leitor em vez de esconder. Ver PR. 05,
   * "incertezas conhecidas — lista aberta do que o atlas ainda não sabe".
   */
  verificar?: boolean;
  /**
   * 'ano' suprime o separador de milhar: 1822, nunca 1.822.
   * Erro clássico de atlas automatizado — ano é rótulo, não quantidade.
   */
  formato?: 'numero' | 'ano';
}

export function ehFato(v: unknown): v is Fato {
  return (
    typeof v === 'object' && v !== null &&
    'valor' in v && 'fonte' in v &&
    typeof (v as Fato).fonte === 'string'
  );
}

/* --- tipos de item do acervo (PR. 03) ------------------------------------ */

export type TipoItem =
  | 'lugar' | 'entidade-politica' | 'pessoa' | 'evento' | 'conceito'
  | 'sitio' | 'rota' | 'recurso' | 'tratado' | 'obra';

export interface Vigencia {
  de?: number;          // ano negativo = AEC
  ate?: number;         // ausente = ainda vigente
  precisao?: Precisao;
}

export interface Relacao {
  tipo: 'faz-fronteira-com' | 'sucede' | 'precede' | 'membro-de' | 'capital-de'
      | 'colonia-de' | 'alia-se-a' | 'comercia-com' | 'influenciado-por';
  alvo: string;         // slug de outro item
  vigencia?: Vigencia;
  fonte?: string;
}

/** base comum a todo item do acervo, qualquer que seja o tipo */
export interface Item {
  slug: string;
  tipo: TipoItem;
  nome: string;
  nomeOficial?: Fato<string>;
  nomesAlternativos?: string[];
  vigencia?: Vigencia;
  /** ponto representativo, em [longitude, latitude] */
  ponto?: [number, number];
  relacoes?: Relacao[];
}

/* =============================================================================
   REGISTRO DE REFERÊNCIAS
   Percorre os dados de uma prancha, numera as fontes pela ordem de primeira
   aparição e expõe o acesso por caminho. Determinístico: a mesma prancha
   sempre produz a mesma numeração.
   ========================================================================== */

export interface Registro {
  /** número da referência de uma fonte nesta prancha, começando em 1 */
  ref(fonteId: string): number;
  /** fato em notação de ponto: 'economia.pib' */
  fato<T = number | string>(caminho: string): Fato<T> | undefined;
  /** mesmo que fato(), mas falha se não existir — para valores obrigatórios */
  exigir<T = number | string>(caminho: string): Fato<T>;
  /** fontes usadas, na ordem de numeração */
  fontes(): Fonte[];
  /** quantos fatos a prancha carrega — aparece no metadado do cartucho */
  total(): number;
  /** caminhos dos fatos ainda não conferidos na fonte primária */
  pendencias(): string[];
}

export function criarRegistro(dados: unknown): Registro {
  const ordem: string[] = [];
  const pendentes: string[] = [];
  let contagem = 0;

  // percorre em profundidade, estável: chaves na ordem de declaração
  (function percorrer(no: unknown, caminho: string): void {
    if (Array.isArray(no)) {
      no.forEach((item, i) => percorrer(item, caminho ? `${caminho}.${i}` : String(i)));
      return;
    }
    if (typeof no !== 'object' || no === null) return;
    if (ehFato(no)) {
      contagem++;
      obterFonte(no.fonte);                       // valida no build
      if (!ordem.includes(no.fonte)) ordem.push(no.fonte);
      if (no.verificar) pendentes.push(caminho);
      return;                                     // Fato é folha
    }
    for (const [chave, valor] of Object.entries(no as Record<string, unknown>)) {
      percorrer(valor, caminho ? `${caminho}.${chave}` : chave);
    }
  })(dados, '');

  const porCaminho = (caminho: string): unknown =>
    caminho.split('.').reduce<unknown>(
      (acc, chave) =>
        typeof acc === 'object' && acc !== null
          ? (acc as Record<string, unknown>)[chave]
          : undefined,
      dados,
    );

  return {
    ref(fonteId) {
      const i = ordem.indexOf(fonteId);
      if (i === -1) {
        throw new Error(
          `Fonte "${fonteId}" referenciada mas ausente dos dados desta prancha.`,
        );
      }
      return i + 1;
    },
    fato<T = number | string>(caminho: string) {
      const v = porCaminho(caminho);
      return ehFato(v) ? (v as Fato<T>) : undefined;
    },
    exigir<T = number | string>(caminho: string) {
      const v = porCaminho(caminho);
      if (!ehFato(v)) {
        throw new Error(
          `Fato obrigatório ausente em "${caminho}". ` +
          `Um valor exibido sem Fato correspondente significa número digitado à mão.`,
        );
      }
      return v as Fato<T>;
    },
    fontes: () => ordem.map(obterFonte),
    total: () => contagem,
    pendencias: () => [...pendentes],
  };
}

/* =============================================================================
   FORMATAÇÃO — pt-BR, com numerais tabulares no CSS
   ========================================================================== */

const NUM = new Intl.NumberFormat('pt-BR');
const NUM1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const NUM2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatar(valor: number | string, formato?: 'numero' | 'ano'): string {
  if (typeof valor === 'string') return valor;
  if (!Number.isFinite(valor)) return '—';
  if (formato === 'ano') return formatarAno(valor);
  if (Number.isInteger(valor)) return NUM.format(valor);
  return Math.abs(valor) < 10 ? NUM2.format(valor) : NUM1.format(valor);
}

/**
 * Ano com era: 1648, 44 AEC. Sem separador de milhar — nem em 10 000 AEC,
 * onde a convenção tipográfica do atlas é o espaço fino, não o ponto.
 */
export function formatarAno(ano: number): string {
  const n = Math.abs(ano);
  const d = n >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009') : String(n);
  return ano < 0 ? `${d} AEC` : d;
}

export function formatarVigencia(v?: Vigencia): string {
  if (!v || (v.de === undefined && v.ate === undefined)) return '—';
  const de = v.de === undefined ? '?' : formatarAno(v.de);
  const ate = v.ate === undefined ? 'presente' : formatarAno(v.ate);
  return `${de} – ${ate}`;
}

/** coordenada em graus e minutos, como no índice de lugares de um atlas */
export function formatarCoordenada([lon, lat]: [number, number]): string {
  const g = (v: number, pos: string, neg: string) => {
    const abs = Math.abs(v);
    const grau = Math.floor(abs);
    const min = Math.round((abs - grau) * 60);
    return `${grau}°${String(min).padStart(2, '0')}′${v >= 0 ? pos : neg}`;
  };
  return `${g(lat, 'N', 'S')} ${g(lon, 'L', 'O')}`;
}
