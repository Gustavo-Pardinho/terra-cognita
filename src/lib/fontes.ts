/* =============================================================================
   REGISTRO DE FONTES
   Todo acervo usado pelo atlas entra aqui uma vez, com licença e data de
   extração. Nada é citado por um id que não exista neste arquivo — o build
   quebra se isso acontecer. Ver PR. 05.
   ========================================================================== */

export interface Fonte {
  /** id curto e estável; é o que os dados citam */
  id: string;
  titulo: string;
  autor?: string;
  url?: string;
  /** licença exata, porque ela muda o que o atlas pode ser */
  licenca: string;
  /** data de extração, formato ISO — um dado sem data de acesso envelhece mudo */
  acessoEm?: string;
  nota?: string;
}

export const FONTES = {
  'natural-earth': {
    id: 'natural-earth',
    titulo: 'Natural Earth, 1:110m e 1:50m cultural e physical vectors',
    autor: 'Nathaniel Vaughn Kelso, Tom Patterson et al.',
    url: 'https://www.naturalearthdata.com/',
    licenca: 'domínio público',
    acessoEm: '2026-10-23',
    nota: 'Base de fronteiras, costas e hidrografia em escala de atlas.',
  },
  'ibge-area': {
    id: 'ibge-area',
    titulo: 'Áreas territoriais brasileiras',
    autor: 'IBGE — Instituto Brasileiro de Geografia e Estatística',
    url: 'https://www.ibge.gov.br/geociencias/organizacao-do-territorio/estrutura-territorial/15761-areas-dos-municipios.html',
    licenca: 'uso livre com citação da fonte',
    acessoEm: '2026-10-23',
  },
  'ibge-censo-2022': {
    id: 'ibge-censo-2022',
    titulo: 'Censo Demográfico 2022 — população residente',
    autor: 'IBGE',
    url: 'https://censo2022.ibge.gov.br/',
    licenca: 'uso livre com citação da fonte',
    acessoEm: '2026-10-23',
  },
  'ibge-pib': {
    id: 'ibge-pib',
    titulo: 'Sistema de Contas Nacionais — PIB a preços correntes',
    autor: 'IBGE',
    url: 'https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais.html',
    licenca: 'uso livre com citação da fonte',
    acessoEm: '2026-10-23',
  },
  'ibge-altimetria': {
    id: 'ibge-altimetria',
    titulo: 'Revisão das altitudes dos pontos culminantes do Brasil',
    autor: 'IBGE — Coordenação de Geodésia',
    url: 'https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/15275-geociencias-ibge-reve-as-altitudes-de-sete-pontos-culminantes',
    licenca: 'uso livre com citação da fonte',
    acessoEm: '2026-10-26',
    nota: 'Recálculo de 2016 com o modelo de ondulação geoidal MAPGEO2015. A altitude mudou porque o método melhorou, não a montanha.',
  },
  'ibge-pontos-extremos': {
    id: 'ibge-pontos-extremos',
    titulo: 'Pontos extremos do território brasileiro',
    autor: 'IBGE, Exército Brasileiro e Governo de Roraima',
    url: 'https://educa.ibge.gov.br/criancas/voce-sabia/23101-pontos-extremos.html',
    licenca: 'uso livre com citação da fonte',
    acessoEm: '2026-10-26',
    nota: 'O extremo norte foi reconhecido oficialmente em 1998 e fica cerca de 84 km ao norte do Oiapoque, que a escola ainda ensina como extremo.',
  },
  'ibge-biomas-2019': {
    id: 'ibge-biomas-2019',
    titulo: 'Biomas e Sistema Costeiro-Marinho do Brasil, 1:250 000',
    autor: 'IBGE',
    url: 'https://educa.ibge.gov.br/jovens/conheca-o-brasil/territorio/18307-biomas-brasileiros.html',
    licenca: 'uso livre com citação da fonte',
    acessoEm: '2026-10-26',
    nota: 'Mapa de 2019: seis biomas continentais, com a Amazônia ocupando 49,5% do território.',
  },
  'alvares-koppen-2013': {
    id: 'alvares-koppen-2013',
    titulo: "Köppen's climate classification map for Brazil",
    autor: 'Alvares, C. A.; Stape, J. L.; Sentelhas, P. C. et al., Meteorologische Zeitschrift 22(6), 711–728 (2013)',
    url: 'https://doi.org/10.1127/0941-2948/2013/0507',
    licenca: 'artigo científico, consultar o editor para reuso',
    acessoEm: '2026-10-26',
    nota: 'Classificação de Köppen específica para o Brasil, com o percentual de território de cada classe.',
  },
  'ine-bolivia': {
    id: 'ine-bolivia',
    titulo: 'Censo de Población y Vivienda 2024 — resultados finales',
    autor: 'INE — Instituto Nacional de Estadística, Bolívia',
    url: 'https://cpv2024.ine.gob.bo/',
    licenca: 'uso livre com citação da fonte',
    acessoEm: '2026-10-27',
    nota: 'Resultados finais divulgados em agosto de 2025. Encontraram cerca de 880 mil pessoas a menos que as projeções anteriores.',
  },
  'oep-bolivia': {
    id: 'oep-bolivia',
    titulo: 'Padrón Electoral Biométrico — Elecciones Generales 2025',
    autor: 'OEP — Órgano Electoral Plurinacional, Bolívia',
    url: 'https://web.oep.org.bo/',
    licenca: 'dados oficiais, uso livre com citação',
    acessoEm: '2026-10-27',
  },
  'ine-bolivia-geografia': {
    id: 'ine-bolivia-geografia',
    titulo: 'Aspectos Geográficos de Bolivia',
    autor: 'INE — Instituto Nacional de Estadística, Bolívia',
    url: 'https://www.ine.gob.bo/index.php/bolivia/aspectos-geograficos/',
    licenca: 'uso livre com citação da fonte',
    acessoEm: '2026-10-27',
  },
  'cpe-bolivia-2009': {
    id: 'cpe-bolivia-2009',
    titulo: 'Constitución Política del Estado Plurinacional de Bolivia, 7 de fevereiro de 2009',
    autor: 'Asamblea Constituyente de Bolivia',
    url: 'https://www.lexivox.org/norms/BO-CPE-20090207.html',
    licenca: 'texto oficial, domínio público',
    acessoEm: '2026-10-27',
    nota: 'Aprovada em referendo de 25 de janeiro de 2009. O art. 5º reconhece o castelhano e 36 idiomas indígenas como oficiais.',
  },
  'tratado-paz-1904': {
    id: 'tratado-paz-1904',
    titulo: 'Tratado de Paz y Amistad entre Chile y Bolivia, 20 de outubro de 1904',
    autor: 'Chile e Bolívia',
    licenca: 'documento histórico, domínio público',
    acessoEm: '2026-10-27',
    nota: 'Torna definitiva a cessão do Litoral, ocupado desde a Guerra do Pacífico e administrado pelo Chile desde o Pacto de Trégua de 1884.',
  },
  'tratado-chaco-1938': {
    id: 'tratado-chaco-1938',
    titulo: 'Tratado de Paz, Amistad y Límites entre Bolivia y Paraguay, 21 de julho de 1938',
    autor: 'Bolívia e Paraguai',
    licenca: 'documento histórico, domínio público',
    acessoEm: '2026-10-27',
    nota: 'Encerra a Guerra do Chaco (1932–1935) e fixa o limite no Chaco Boreal.',
  },
  'wdi': {
    id: 'wdi',
    titulo: 'World Development Indicators',
    autor: 'Banco Mundial',
    url: 'https://databank.worldbank.org/source/world-development-indicators',
    licenca: 'CC BY 4.0',
    acessoEm: '2026-10-23',
  },
  'un-wpp-2024': {
    id: 'un-wpp-2024',
    titulo: 'World Population Prospects 2024',
    autor: 'ONU, Departamento de Assuntos Econômicos e Sociais',
    url: 'https://population.un.org/wpp/',
    licenca: 'CC BY 3.0 IGO',
    acessoEm: '2026-10-23',
  },
  'copernicus-dem': {
    id: 'copernicus-dem',
    titulo: 'Copernicus DEM GLO-30',
    autor: 'ESA / Airbus',
    url: 'https://dataspace.copernicus.eu/',
    licenca: 'aberta com atribuição',
    acessoEm: '2026-10-23',
    nota: 'Altitudes, relevo sombreado e perfis topográficos.',
  },
  'geonames': {
    id: 'geonames',
    titulo: 'GeoNames gazetteer',
    url: 'https://www.geonames.org/',
    licenca: 'CC BY 4.0',
    acessoEm: '2026-10-23',
  },
  'koppen-beck': {
    id: 'koppen-beck',
    titulo: 'Present and future Köppen-Geiger climate classification maps at 1-km resolution',
    autor: 'Beck, H. E. et al., Scientific Data 5, 180214 (2018)',
    url: 'https://doi.org/10.1038/sdata.2018.214',
    licenca: 'CC BY 4.0',
    acessoEm: '2026-10-23',
  },
  'itamaraty-limites': {
    id: 'itamaraty-limites',
    titulo: 'Limites internacionais do Brasil',
    autor: 'Ministério das Relações Exteriores / Primeira Comissão Brasileira Demarcadora de Limites',
    url: 'https://www.gov.br/mre/pt-br',
    licenca: 'uso livre com citação da fonte',
    acessoEm: '2026-10-23',
  },
  'tse-2022': {
    id: 'tse-2022',
    titulo: 'Estatísticas do eleitorado e resultados — Eleições 2022',
    autor: 'Tribunal Superior Eleitoral',
    url: 'https://www.tse.jus.br/eleicoes/estatisticas',
    licenca: 'dados abertos, uso livre com citação',
    acessoEm: '2026-10-23',
  },
  'constituicao-1988': {
    id: 'constituicao-1988',
    titulo: 'Constituição da República Federativa do Brasil de 1988',
    autor: 'Assembleia Nacional Constituinte',
    url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
    licenca: 'texto oficial, domínio público',
    acessoEm: '2026-10-23',
  },
  'ibge-500-anos': {
    id: 'ibge-500-anos',
    titulo: 'Brasil: 500 anos de povoamento',
    autor: 'IBGE',
    url: 'https://brasil500anos.ibge.gov.br/',
    licenca: 'uso livre com citação da fonte',
    acessoEm: '2026-10-25',
    nota: 'História do povoamento e da organização administrativa da colônia.',
  },
  'planalto-leis': {
    id: 'planalto-leis',
    titulo: 'Legislação — Coleção de Leis do Brasil',
    autor: 'Presidência da República, Casa Civil',
    url: 'https://www.planalto.gov.br/ccivil_03/',
    licenca: 'texto oficial, domínio público',
    acessoEm: '2026-10-25',
    nota: 'Atos legais datáveis: Lei Áurea, proclamação, transferência da capital.',
  },
  'arquivo-nacional': {
    id: 'arquivo-nacional',
    titulo: 'Acervo documental do período 1964–1985',
    autor: 'Arquivo Nacional',
    url: 'https://www.gov.br/arquivonacional/',
    licenca: 'uso livre com citação da fonte',
    acessoEm: '2026-10-25',
  },
  'tratado-tordesilhas': {
    id: 'tratado-tordesilhas',
    titulo: 'Tratado de Tordesilhas, 7 de junho de 1494',
    autor: 'Arquivo Nacional da Torre do Tombo (original), Portugal',
    url: 'https://digitarq.arquivos.pt/',
    licenca: 'documento histórico, domínio público',
    acessoEm: '2026-10-25',
    nota: 'O limite de 370 léguas a oeste de Cabo Verde não fixa um meridiano único: depende da légua e da ilha de referência, ambas disputadas à época.',
  },
  'tratado-madri': {
    id: 'tratado-madri',
    titulo: 'Tratado de Madri, 13 de janeiro de 1750',
    autor: 'Portugal e Espanha',
    licenca: 'documento histórico, domínio público',
    acessoEm: '2026-10-25',
    nota: 'Substitui Tordesilhas pelo princípio do uti possidetis: vale quem ocupa.',
  },
  'tratado-petropolis': {
    id: 'tratado-petropolis',
    titulo: 'Tratado de Petrópolis, 17 de novembro de 1903',
    autor: 'Brasil e Bolívia',
    url: 'https://www.planalto.gov.br/ccivil_03/',
    licenca: 'documento histórico, domínio público',
    acessoEm: '2026-10-26',
    nota: 'Encerra a disputa pelo Acre: o território passa ao Brasil mediante indenização e a construção da Madeira-Mamoré.',
  },
  'david-rumsey': {
    id: 'david-rumsey',
    titulo: 'David Rumsey Map Collection',
    autor: 'David Rumsey / Universidade de Stanford',
    url: 'https://www.davidrumsey.com/',
    licenca: 'CC BY-NC-SA 3.0 · conferir item a item',
    acessoEm: '2026-10-25',
    nota: 'Mapas históricos digitalizados e georreferenciados. Entra na Fase 2, nas camadas de sobreposição histórica.',
  },
  'slavevoyages': {
    id: 'slavevoyages',
    titulo: 'Trans-Atlantic Slave Trade Database',
    autor: 'SlaveVoyages, Emory University',
    url: 'https://www.slavevoyages.org/',
    licenca: 'CC BY-NC 4.0',
    acessoEm: '2026-10-25',
    nota: 'Estimativas de desembarque de africanos escravizados por porto e período.',
  },
  'comtrade': {
    id: 'comtrade',
    titulo: 'UN Comtrade — estatísticas de comércio de mercadorias',
    autor: 'Divisão de Estatística da ONU',
    url: 'https://comtradeplus.un.org/',
    licenca: 'uso livre com atribuição',
    acessoEm: '2026-10-23',
  },
  'mapbiomas': {
    id: 'mapbiomas',
    titulo: 'MapBiomas — Coleção de mapas anuais de cobertura e uso da terra',
    autor: 'Projeto MapBiomas',
    url: 'https://brasil.mapbiomas.org/',
    licenca: 'CC BY-SA 4.0',
    acessoEm: '2026-10-23',
  },
} as const satisfies Record<string, Fonte>;

export type FonteId = keyof typeof FONTES;

export function obterFonte(id: string): Fonte {
  const f = (FONTES as Record<string, Fonte>)[id];
  if (!f) {
    // falha no build, não em silêncio na página: um dado sem fonte é um defeito
    throw new Error(
      `Fonte desconhecida: "${id}". Cadastre-a em src/lib/fontes.ts antes de citá-la.`,
    );
  }
  return f;
}
