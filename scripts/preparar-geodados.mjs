/* =============================================================================
   PREPARAR GEODADOS
   Baixa do Natural Earth, recorta o necessário e grava em public/dados/.
   Roda uma vez; o resultado é servido como arquivo estático. Nenhum servidor
   de ladrilho em nenhum momento — ver PR. 06.
   ========================================================================== */

import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = resolve(RAIZ, 'public/dados');
const BASE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson';

const VIZINHOS = new Set([
  'Uruguay', 'Argentina', 'Paraguay', 'Bolivia', 'Peru', 'Colombia',
  'Venezuela', 'Guyana', 'Suriname', 'France', 'Chile', 'Ecuador',
]);

async function baixar(nome) {
  const url = `${BASE}/${nome}.geojson`;
  process.stdout.write(`  baixando ${nome} … `);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${nome}: HTTP ${r.status}`);
  const j = await r.json();
  console.log(`${j.features.length} feições`);
  return j;
}

/** arredonda coordenadas: 3 casas ≈ 110 m, suficiente em escala de atlas */
function enxugar(geom, casas = 3) {
  const p = 10 ** casas;
  const r = (c) => (Array.isArray(c[0]) ? c.map(r) : [Math.round(c[0] * p) / p, Math.round(c[1] * p) / p]);
  return { ...geom, coordinates: r(geom.coordinates) };
}

function fc(features) { return { type: 'FeatureCollection', features }; }

async function gravar(nome, dados) {
  const txt = JSON.stringify(dados);
  await writeFile(resolve(SAIDA, nome), txt);
  console.log(`  → ${nome}  ${(txt.length / 1024).toFixed(0)} kB`);
}

/** graticulado: a malha de meridianos e paralelos, gerada, não baixada */
function graticulado(passo = 10) {
  const linhas = [];
  for (let lon = -180; lon <= 180; lon += passo) {
    const pts = [];
    for (let lat = -90; lat <= 90; lat += 2) pts.push([lon, lat]);
    linhas.push({ type: 'Feature', properties: { tipo: 'meridiano', grau: lon }, geometry: { type: 'LineString', coordinates: pts } });
  }
  for (let lat = -80; lat <= 80; lat += passo) {
    const pts = [];
    for (let lon = -180; lon <= 180; lon += 2) pts.push([lon, lat]);
    linhas.push({ type: 'Feature', properties: { tipo: 'paralelo', grau: lat }, geometry: { type: 'LineString', coordinates: pts } });
  }
  return fc(linhas);
}

async function principal() {
  await mkdir(SAIDA, { recursive: true });
  console.log('Natural Earth → public/dados/\n');

  const paises = await baixar('ne_50m_admin_0_countries');
  const nome = (p) => p.NAME_EN ?? p.NAME ?? p.ADMIN ?? p.SOVEREIGNT;

  const brasil = paises.features.find((f) => nome(f.properties) === 'Brazil');
  if (!brasil) throw new Error('Brasil não encontrado no acervo de países.');
  await gravar('brasil.geojson', fc([{
    type: 'Feature',
    properties: { slug: 'brasil', nome: 'Brasil', iso: 'BRA' },
    geometry: enxugar(brasil.geometry),
  }]));

  const vizinhos = paises.features
    .filter((f) => VIZINHOS.has(nome(f.properties)))
    .map((f, i) => ({
      type: 'Feature',
      properties: { nome: nome(f.properties), tinta: (i % 4) + 1 },
      geometry: enxugar(f.geometry),
    }));
  await gravar('vizinhos.geojson', fc(vizinhos));

  const lugares = await baixar('ne_10m_populated_places_simple');
  const cidades = lugares.features
    .filter((f) => f.properties.adm0name === 'Brazil')
    .map((f) => ({
      type: 'Feature',
      properties: {
        nome: f.properties.name,
        pop: f.properties.pop_max ?? 0,
        capital: f.properties.featurecla?.includes('Admin-0') ? 1 : 0,
        uf: f.properties.adm1name ?? '',
      },
      geometry: enxugar(f.geometry, 4),
    }))
    .sort((a, b) => b.properties.pop - a.properties.pop)
    .slice(0, 60);
  await gravar('cidades.geojson', fc(cidades));

  const rios = await baixar('ne_50m_rivers_lake_centerlines');
  const naAmSul = (g) => {
    const cs = g.type === 'LineString' ? g.coordinates : g.coordinates.flat();
    return cs.some(([lon, lat]) => lon > -75 && lon < -33 && lat > -34 && lat < 6);
  };
  const hidro = rios.features
    .filter((f) => naAmSul(f.geometry))
    .map((f) => ({
      type: 'Feature',
      properties: { nome: f.properties.name ?? '', ordem: f.properties.strokeweig ?? 1 },
      geometry: enxugar(f.geometry),
    }));
  await gravar('hidrografia.geojson', fc(hidro));

  await gravar('graticulado.geojson', graticulado(10));

  console.log('\nPronto. Os dados são estáticos: não há servidor de ladrilho.');
}

principal().catch((e) => { console.error('\nFalhou:', e.message); process.exit(1); });
