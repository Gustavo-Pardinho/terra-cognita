/* =============================================================================
   TRILHAS
   Percursos curados de pranchas em ordem, com uma pergunta por etapa. O destino
   de cada etapa é um permalink completo — centro, zoom, camadas e ano — então a
   trilha entrega o leitor na vista exata em que a pergunta faz sentido, em vez
   de pedir que ele a reconstrua. Ver PR. 04.
   ========================================================================== */

export interface Etapa {
  pergunta: string;
  /** onde a pergunta se responde, com o estado da prancha embutido */
  onde: string;
  /** o que olhar quando chegar lá */
  oQueVer: string;
}

export interface Trilha {
  slug: string;
  titulo: string;
  resumo: string;
  etapas: Etapa[];
}

const ATLAS = '/atlas#z=3.4&lat=-14.5&lon=-52.5&proj=mercator';

export const trilhas: Trilha[] = [
  {
    slug: 'brasil-pelos-mapas',
    titulo: 'O Brasil pelos mapas',
    resumo:
      'Sete perguntas que só o mapa responde. A trilha atravessa a formação do território, '
      + 'da linha de Tordesilhas à incorporação do Acre, e termina na pergunta que todo '
      + 'atlas precisa enfrentar: o que a projeção esconde.',
    etapas: [
      {
        pergunta: 'Por que o Brasil não tem fronteira natural defensável?',
        onde: `${ATLAS}&cam=relevo,ufs,hidrografia,rotulos`,
        oQueVer:
          'Procure uma cordilheira dentro do território. Não há. Os Andes ficam do lado de fora, '
          + 'e o interior é planalto baixo cortado por rios que correm para dentro. Compare com a '
          + 'faixa marrom e branca a oeste: é lá que estão os passos de montanha disputáveis da '
          + 'América do Sul, e nenhum deles é brasileiro.',
      },
      {
        pergunta: 'Até onde Portugal podia legalmente chegar em 1600?',
        onde: `${ATLAS}&cam=relevo,ufs,rotulos&ano=1600`,
        oQueVer:
          'A faixa magenta é a linha de Tordesilhas — e é uma faixa, não uma linha, porque o '
          + 'tratado fixa 370 léguas a oeste de Cabo Verde sem dizer qual légua nem qual ilha. '
          + 'Repare quanto do país de hoje está a oeste dela.',
      },
      {
        pergunta: 'Qual era a capital quando o ouro das Minas mudou o eixo econômico?',
        onde: `${ATLAS}&cam=relevo,ufs,rotulos&ano=1770`,
        oQueVer:
          'O anel magenta marca a capital em vigor. Mova o ano para 1760 e para 1765: a capital '
          + 'salta de Salvador para o Rio em 1763. A mudança acompanha o deslocamento do açúcar '
          + 'nordestino para o ouro mineiro.',
      },
      {
        pergunta: 'Que pedaço do Brasil de hoje não era brasileiro em 1900?',
        onde: `${ATLAS}&z=4.2&lat=-9.5&lon=-68&cam=relevo,ufs,rotulos&ano=1900`,
        oQueVer:
          'A área hachurada no extremo oeste é o Acre, então boliviano. Foi ocupado por '
          + 'seringueiros brasileiros durante o ciclo da borracha e só passou ao Brasil em 1903. '
          + 'Repare que o contorno nacional não foi redesenhado: a fronteira daquela época era '
          + 'ela mesma disputada, e o atlas não inventa a linha que a fonte não tem.',
      },
      {
        pergunta: 'Por que a densidade média engana sobre o Brasil?',
        onde: '/regioes/brasil',
        oQueVer:
          'A ficha diz 23,9 habitantes por quilômetro quadrado. Agora olhe onde estão os nomes '
          + 'de cidade no mapa: quase todos numa faixa litorânea estreita. A média nacional não '
          + 'descreve nenhum lugar real do país — é o caso-escola de quando o coroplético por '
          + 'densidade mente e o cartograma é o mapa certo.',
      },
      {
        pergunta: 'Com quantos países sul-americanos o Brasil NÃO faz fronteira?',
        onde: '/regioes/brasil',
        oQueVer:
          'Dois: Chile e Equador. A prancha de posição geopolítica lista os dez vizinhos '
          + 'terrestres — nove países soberanos mais a Guiana Francesa, que é departamento '
          + 'ultramarino da França e por isso não entra na conta dos doze.',
      },
      {
        pergunta: 'O que a projeção do mapa está escondendo de você?',
        onde: '/atlas#z=2&lat=-5&lon=-55&proj=mercator&cam=relevo,tissot',
        oQueVer:
          'Os círculos magenta têm todos 500 km de raio verdadeiro. Em Mercator eles incham '
          + 'conforme se afastam do equador, para o norte e para o sul. Troque para Ortográfica: '
          + 'eles param de inchar e passam a se achatar na borda. Mesmo dado, duas mentiras '
          + 'diferentes — e nenhum mapa plano escapa de escolher uma.',
      },
    ],
  },
];
