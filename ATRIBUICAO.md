# Atribuição

Cada acervo usado pelo Terra Cognita, com a licença e o que ela exige. A lista viva,
gerada do registro em `src/lib/fontes.ts`, está em **[/metodo](https://terracognita.org/metodo)** —
este arquivo existe porque algumas licenças pedem o aviso junto do código.

## Dados geográficos

| Acervo | Uso | Licença | Exige |
|---|---|---|---|
| [Natural Earth](https://www.naturalearthdata.com/) | Fronteiras, costas, hidrografia, unidades federativas, gazeteiro | Domínio público | Nada |
| [Terrarium / Mapzen DEM](https://registry.opendata.aws/terrain-tiles/) | Altitude do relevo hipsométrico sombreado | Aberta, ver termos por fonte de origem | Atribuição |
| [GeoNames](https://www.geonames.org/) | Nomes alternativos de lugares | CC BY 4.0 | Atribuição |

O DEM é reprocessado em `scripts/preparar-relevo.mjs`: a altitude é decodificada,
classificada nas faixas hipsométricas e sombreada. Os ladrilhos em
`public/dados/relevo/` são obra derivada desse acervo.

## Dados estatísticos e documentais

| Acervo | Licença |
|---|---|
| IBGE — áreas, Censo 2022, contas nacionais, Brasil 500 anos | Uso livre com citação |
| Banco Mundial — World Development Indicators | CC BY 4.0 |
| ONU — World Population Prospects 2024 | CC BY 3.0 IGO |
| Beck et al. — Köppen-Geiger | CC BY 4.0 |
| TSE — estatísticas do eleitorado | Dados abertos |
| Presidência da República — Coleção de Leis | Domínio público |
| Arquivo Nacional | Uso livre com citação |
| MapBiomas | **CC BY-SA 4.0** |
| SlaveVoyages, Emory University | **CC BY-NC 4.0** |
| David Rumsey Map Collection | **CC BY-NC-SA 3.0** (cadastrado, ainda não em uso) |

## O que as cláusulas restritivas implicam

Três acervos carregam cláusula que se propaga, e vale saber disso antes de crescer:

- **MapBiomas é CC BY-SA.** Obra derivada dos seus dados precisa ser compartilhada sob
  licença compatível. É o motivo de a camada de conteúdo deste projeto ser CC BY-SA.
- **SlaveVoyages é CC BY-NC**, e está em uso. Enquanto estiver, o produto de dados não
  pode ser explorado comercialmente.
- **David Rumsey é CC BY-NC-SA.** Entra na Fase 2, nas camadas de sobreposição
  histórica. No momento em que entrar, a cláusula NC passa a valer também por ele.

Em resumo: **o atlas é um projeto sem fins comerciais, e isso é consequência das
licenças, não só da intenção.** Se um dia precisar deixar de ser, estes três acervos
teriam de ser substituídos por equivalentes com licença permissiva.

## Como citar

> Terra Cognita — atlas de estudo do mundo. https://terracognita.org

Ao reusar uma prancha, mantenha o crédito das fontes que ela cita: a lista numerada no
pé de cada prancha é gerada dos dados e é parte do conteúdo, não decoração.
