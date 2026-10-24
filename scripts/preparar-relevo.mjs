/* =============================================================================
   PREPARAR RELEVO
   Baixa um DEM real (Terrarium RGB, 30 m reamostrado), decodifica a altitude e
   assa uma prancha de relevo hipsométrico com sombreamento — um PNG estático.

   O download acontece UMA VEZ, aqui. Em tempo de execução não há servidor de
   ladrilho nenhum: o navegador recebe um arquivo de imagem. Ver PR. 06.
   ========================================================================== */

import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { deflateSync } from 'node:zlib';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = resolve(RAIZ, 'public/dados');

const Z = 6;                                   // ~2,4 km/px: escala de prancha de país
const CAIXA = { oeste: -74, leste: -34, sul: -34, norte: 6 };
const TELHA = 256;
const FONTE = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium';

/* --- rampa hipsométrica: os mesmos tokens de src/styles/tokens.css --------- */
const MAR = [
  { ate: -4000, cor: [0x0a, 0x21, 0x33] },     // --h-abismo
  { ate: -2000, cor: [0x12, 0x32, 0x49] },     // --h-pelagico
  { ate:  -200, cor: [0x1c, 0x4a, 0x61] },     // --h-talude
  { ate:     0, cor: [0x2e, 0x66, 0x78] },     // --h-plataforma
];
const TERRA = [
  { ate:  100, cor: [0x3e, 0x6b, 0x4e] },      // --h-planicie
  { ate:  200, cor: [0x55, 0x7a, 0x4e] },      // --h-baixada
  { ate:  400, cor: [0x6e, 0x8a, 0x4e] },      // --h-colina
  { ate:  600, cor: [0x8a, 0x95, 0x51] },      // --h-planalto
  { ate:  900, cor: [0xa3, 0xa0, 0x54] },      // --h-estepe
  { ate: 1200, cor: [0xc9, 0xa0, 0x5c] },      // --h-arido
  { ate: 1800, cor: [0xb9, 0x79, 0x3f] },      // --h-serra
  { ate: 2500, cor: [0x9a, 0x5a, 0x33] },      // --h-montanha
  { ate: 4000, cor: [0x8a, 0x6a, 0x5c] },      // --h-rocha
  { ate: Infinity, cor: [0xd9, 0xd4, 0xcc] },  // --h-neve
];

/* =============================================================================
   PNG INDEXADO
   A prancha usa pouco mais de 160 cores — a rampa vezes os degraus de sombra.
   Isso cabe numa paleta de 256 entradas, então o PNG-8 é SEM PERDA e corta o
   arquivo em cerca de três vezes. pngjs não escreve paleta; são 40 linhas.
   ========================================================================== */
const TABELA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = TABELA_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pedaco(tipo, dados) {
  const corpo = Buffer.concat([Buffer.from(tipo, 'ascii'), dados]);
  const tam = Buffer.alloc(4); tam.writeUInt32BE(dados.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(corpo));
  return Buffer.concat([tam, corpo, crc]);
}

function escreverPngIndexado(largura, altura, indices, paleta) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(largura, 0);
  ihdr.writeUInt32BE(altura, 4);
  ihdr[8] = 8;    // bits por amostra
  ihdr[9] = 3;    // tipo de cor: indexado
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const plte = Buffer.alloc(paleta.length * 3);
  paleta.forEach((c, i) => { plte[i * 3] = c[0]; plte[i * 3 + 1] = c[1]; plte[i * 3 + 2] = c[2]; });

  // filtro Sub por linha: indexado com faixas largas comprime bem assim
  const linhas = Buffer.alloc(altura * (largura + 1));
  for (let y = 0; y < altura; y++) {
    const base = y * (largura + 1);
    linhas[base] = 1;
    for (let x = 0; x < largura; x++) {
      const v = indices[y * largura + x];
      linhas[base + 1 + x] = (v - (x > 0 ? indices[y * largura + x - 1] : 0)) & 0xff;
    }
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pedaco('IHDR', ihdr),
    pedaco('PLTE', plte),
    pedaco('IDAT', deflateSync(linhas, { level: 9 })),
    pedaco('IEND', Buffer.alloc(0)),
  ]);
}

const lon2x = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z);
const lat2y = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z);
};
const x2lon = (x, z) => (x / 2 ** z) * 360 - 180;
const y2lat = (y, z) => {
  const n = Math.PI - (2 * Math.PI * y) / 2 ** z;
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};

async function baixarTelha(z, x, y, tentativa = 0) {
  try {
    const r = await fetch(`${FONTE}/${z}/${x}/${y}.png`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return PNG.sync.read(Buffer.from(await r.arrayBuffer()));
  } catch (e) {
    if (tentativa < 3) {
      await new Promise((s) => setTimeout(s, 400 * (tentativa + 1)));
      return baixarTelha(z, x, y, tentativa + 1);
    }
    console.warn(`  telha ${z}/${x}/${y} falhou (${e.message}) — fica como mar`);
    return null;
  }
}

/** executa em lotes para não abrir 64 conexões de uma vez */
async function emLotes(itens, tamanho, tarefa) {
  const saida = [];
  for (let i = 0; i < itens.length; i += tamanho) {
    saida.push(...(await Promise.all(itens.slice(i, i + tamanho).map(tarefa))));
    process.stdout.write(`\r  telhas: ${Math.min(i + tamanho, itens.length)}/${itens.length}`);
  }
  process.stdout.write('\n');
  return saida;
}

function corDe(alt) {
  if (alt <= 0) {
    for (const f of MAR) if (alt <= f.ate) return f.cor;
    return MAR[MAR.length - 1].cor;
  }
  for (const f of TERRA) if (alt <= f.ate) return f.cor;
  return TERRA[TERRA.length - 1].cor;
}

async function principal() {
  await mkdir(SAIDA, { recursive: true });

  const x0 = lon2x(CAIXA.oeste, Z), x1 = lon2x(CAIXA.leste, Z);
  const y0 = lat2y(CAIXA.norte, Z), y1 = lat2y(CAIXA.sul, Z);
  const nx = x1 - x0 + 1, ny = y1 - y0 + 1;
  const L = nx * TELHA, A = ny * TELHA;

  console.log(`Relevo z${Z} — ${nx}×${ny} telhas = ${L}×${A} px\n`);

  const coords = [];
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) coords.push([tx, ty]);
  const telhas = await emLotes(coords, 8, ([tx, ty]) => baixarTelha(Z, tx, ty));

  // --- decodifica a altitude: elev = (R*256 + G + B/256) - 32768 ------------
  const alt = new Float32Array(L * A);
  telhas.forEach((t, i) => {
    const tx = coords[i][0] - x0, ty = coords[i][1] - y0;
    if (!t) { for (let p = 0; p < TELHA * TELHA; p++) alt[(ty * TELHA + ((p / TELHA) | 0)) * L + tx * TELHA + (p % TELHA)] = -9999; return; }
    for (let py = 0; py < TELHA; py++) {
      for (let px = 0; px < TELHA; px++) {
        const s = (py * TELHA + px) * 4;
        alt[(ty * TELHA + py) * L + tx * TELHA + px] =
          t.data[s] * 256 + t.data[s + 1] + t.data[s + 2] / 256 - 32768;
      }
    }
  });

  /* --- suaviza só a batimetria ------------------------------------------
     O DEM traz o leito oceânico de levantamento esparso, e o faixamento
     hipsométrico transforma esse ruído em listras que parecem defeito de
     impressão. A terra fica intacta: ali o detalhe é dado. */
  console.log('  suavizando batimetria…');
  const suave = Float32Array.from(alt);
  for (let y = 1; y < A - 1; y++) {
    for (let x = 1; x < L - 1; x++) {
      const i = y * L + x;
      if (alt[i] > 0) continue;
      let soma = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) soma += alt[i + dy * L + dx];
      suave[i] = soma / 9;
    }
  }
  alt.set(suave);

  // --- sombreamento: luz do noroeste, como toda prancha de relevo impressa --
  console.log('  sombreando…');
  const indices = new Uint8Array(L * A);
  const paleta = [];
  const indicePorCor = new Map();
  const indiceDe = (r, g, b) => {
    const chave = (r << 16) | (g << 8) | b;
    let i = indicePorCor.get(chave);
    if (i === undefined) {
      if (paleta.length >= 256) return 0;   // não deve acontecer: ~162 cores
      i = paleta.length;
      paleta.push([r, g, b]);
      indicePorCor.set(chave, i);
    }
    return i;
  };
  const metros = (40075016.686 * Math.cos((((CAIXA.norte + CAIXA.sul) / 2) * Math.PI) / 180)) / 2 ** Z / TELHA;

  for (let y = 0; y < A; y++) {
    for (let x = 0; x < L; x++) {
      const i = y * L + x;
      const h = alt[i];
      const cor = h < -9000 ? MAR[MAR.length - 1].cor : corDe(h);

      // gradiente por diferenças centrais, em metros reais
      const e = alt[i + (x < L - 1 ? 1 : 0)], o = alt[i - (x > 0 ? 1 : 0)];
      const s = alt[i + (y < A - 1 ? L : 0)], n = alt[i - (y > 0 ? L : 0)];
      const dzdx = (e - o) / (2 * metros), dzdy = (s - n) / (2 * metros);
      // produto escalar com a luz a 315° de azimute e 45° de altitude
      let luz = (1 + (dzdx - dzdy) * 1.6) / Math.sqrt(1 + dzdx * dzdx + dzdy * dzdy) / Math.sqrt(2);
      luz = Math.max(0, Math.min(2, luz));
      // 16 degraus: mantém a leitura de prancha impressa e o PNG leve
      const k = h <= 0 ? 1 : 0.68 + (Math.round(luz * 16) / 16) * 0.46;

      indices[i] = indiceDe(
        Math.max(0, Math.min(255, Math.round(cor[0] * k))),
        Math.max(0, Math.min(255, Math.round(cor[1] * k))),
        Math.max(0, Math.min(255, Math.round(cor[2] * k))),
      );
    }
  }

  console.log(`  paleta: ${paleta.length} cores (limite 256 — sem perda)`);
  const buf = escreverPngIndexado(L, A, indices, paleta);
  await writeFile(resolve(SAIDA, 'relevo.png'), buf);

  // cantos geográficos exatos da malha de telhas, para ancorar a imagem
  const cantos = {
    oeste: x2lon(x0, Z), leste: x2lon(x1 + 1, Z),
    norte: y2lat(y0, Z), sul: y2lat(y1 + 1, Z),
    zoom: Z, largura: L, altura: A,
  };
  await writeFile(resolve(SAIDA, 'relevo.json'), JSON.stringify(cantos, null, 2));

  console.log(`\n  → relevo.png  ${(buf.length / 1024 / 1024).toFixed(2)} MB  (${L}×${A})`);
  console.log(`  → relevo.json  cantos ${cantos.oeste.toFixed(3)}/${cantos.norte.toFixed(3)} a ${cantos.leste.toFixed(3)}/${cantos.sul.toFixed(3)}`);
  console.log('\nPronto. O DEM foi baixado uma vez; em produção isto é um arquivo.');
}

principal().catch((e) => { console.error('\nFalhou:', e); process.exit(1); });
