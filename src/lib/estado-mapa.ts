/* =============================================================================
   ESTADO DA PRANCHA NO ENDEREÇO
   O endereço guarda centro, zoom, projeção e camadas ligadas. Mandar um link é
   mandar exatamente a sua vista — e é o que torna uma prancha citável. Ver PR. 04.

   Formato legível de propósito, para poder ser editado à mão e explicado numa
   aula:  #z=4.2&lat=-14.5&lon=-52.5&proj=globo&cam=relevo,ufs,rotulos
   A Fase 2 acrescenta `ano` aqui, sem quebrar os links já existentes.
   ========================================================================== */

export interface EstadoMapa {
  z?: number;
  lat?: number;
  lon?: number;
  proj?: 'mercator' | 'globe';
  camadas?: Set<string>;
}

const NUM = (v: string | null): number | undefined => {
  if (v === null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export function lerEstado(hash = location.hash): EstadoMapa {
  const bruto = hash.replace(/^#/, '');
  if (!bruto) return {};
  const p = new URLSearchParams(bruto);
  const proj = p.get('proj');
  const cam = p.get('cam');
  return {
    z: NUM(p.get('z')),
    lat: NUM(p.get('lat')),
    lon: NUM(p.get('lon')),
    proj: proj === 'globe' || proj === 'mercator' ? proj : undefined,
    camadas: cam === null ? undefined : new Set(cam ? cam.split(',') : []),
  };
}

/** arredonda na precisão que a escala justifica — endereço curto e estável */
function arredondar(v: number, zoom: number): number {
  const casas = Math.max(2, Math.min(6, Math.round(zoom / 2) + 1));
  return Number(v.toFixed(casas));
}

export function escreverEstado(e: Required<Omit<EstadoMapa, 'camadas'>> & { camadas: Set<string> }): void {
  const p = new URLSearchParams();
  p.set('z', String(Number(e.z.toFixed(2))));
  p.set('lat', String(arredondar(e.lat, e.z)));
  p.set('lon', String(arredondar(e.lon, e.z)));
  p.set('proj', e.proj);
  p.set('cam', [...e.camadas].join(','));
  const novo = `#${p.toString()}`;
  if (novo === location.hash) return;
  // replaceState: arrastar o mapa não deve encher o histórico do navegador
  history.replaceState(null, '', novo);
}

/** agenda uma gravação, agrupando rajadas de movimento numa só */
export function agrupar<T extends unknown[]>(ms: number, fn: (...args: T) => void) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: T) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

/* =============================================================================
   INDICATRIZ DE TISSOT
   Círculos de raio verdadeiro constante sobre a superfície da Terra. Em
   Mercator eles incham com a latitude; em Equal Earth mudam de forma mas não de
   área. É a aula de distorção mais direta que um atlas pode dar. Ver PR. 04.
   ========================================================================== */

const RAIO_TERRA = 6371008.8;   // raio médio, em metros

/** destino a partir de um ponto, dado rumo e distância sobre a esfera */
function destino(lon: number, lat: number, rumo: number, metros: number): [number, number] {
  const d = metros / RAIO_TERRA;
  const r = (g: number) => (g * Math.PI) / 180;
  const g = (r2: number) => (r2 * 180) / Math.PI;
  const f1 = r(lat), l1 = r(lon), b = r(rumo);
  const f2 = Math.asin(Math.sin(f1) * Math.cos(d) + Math.cos(f1) * Math.sin(d) * Math.cos(b));
  const l2 = l1 + Math.atan2(
    Math.sin(b) * Math.sin(d) * Math.cos(f1),
    Math.cos(d) - Math.sin(f1) * Math.sin(f2),
  );
  return [((g(l2) + 540) % 360) - 180, g(f2)];
}

export function indicatriz(raioKm = 500, passoLon = 20, passoLat = 15): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  for (let lat = -60; lat <= 60; lat += passoLat) {
    for (let lon = -180; lon < 180; lon += passoLon) {
      const anel: [number, number][] = [];
      for (let a = 0; a <= 360; a += 7.5) anel.push(destino(lon, lat, a, raioKm * 1000));
      // descarta o círculo que cruza a antimeridiana: ele se rasga na tela
      const lons = anel.map(([x]) => x);
      if (Math.max(...lons) - Math.min(...lons) > 180) continue;
      features.push({
        type: 'Feature',
        properties: { lat, lon, raioKm },
        geometry: { type: 'Polygon', coordinates: [anel] },
      });
    }
  }
  return { type: 'FeatureCollection', features };
}
