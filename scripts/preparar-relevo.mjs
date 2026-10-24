/* =============================================================================
   PREPARAR RELEVO — pirâmide de ladrilhos
   Baixa um DEM real (Terrarium RGB), decodifica a altitude e assa uma pirâmide
   de ladrilhos de relevo hipsométrico sombreado em public/dados/relevo/.

   Cada nível é montado como UM mosaico com borda de um ladrilho, sombreado
   inteiro e só então fatiado. É o que elimina a costura: o gradiente na borda
   de um ladrilho enxerga o vizinho. Fatiar primeiro e sombrear depois produz
   uma grade visível de emendas.

   O download acontece aqui, uma vez. Em tempo de execução o navegador pede
   arquivos PNG estáticos — não há servidor de ladrilho. Ver PR. 06.
   ========================================================================== */

import { writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import { PNG } from 'pngjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = resolve(RAIZ, 'public/dados');
const DIR_LADRILHOS = resolve(SAIDA, 'relevo');

const ZOOMS = [3, 4, 5, 6, 7];
const CAIXA = { oeste: -74, leste: -34, sul: -34, norte: 6 };
const TELHA = 256;
const FONTE = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium';

/* --- rampa hipsométrica: os mesmos tokens de src/styles/tokens.css --------- */
const MAR = [
  { ate: -4000, cor: [0x0a, 0x21, 0x33] },
  { ate: -2000, cor: [0x12, 0x32, 0x49] },
  { ate:  -200, cor: [0x1c, 0x4a, 0x61] },
  { ate:     0, cor: [0x2e, 0x66, 0x78] },
];
const TERRA = [
  { ate:  100, cor: [0x3e, 0x6b, 0x4e] },
  { ate:  200, cor: [0x55, 0x7a, 0x4e] },
  { ate:  400, cor: [0x6e, 0x8a, 0x4e] },
  { ate:  600, cor: [0x8a, 0x95, 0x51] },
  { ate:  900, cor: [0xa3, 0xa0, 0x54] },
  { ate: 1200, cor: [0xc9, 0xa0, 0x5c] },
  { ate: 1800, cor: [0xb9, 0x79, 0x3f] },
  { ate: 2500, cor: [0x9a, 0x5a, 0x33] },
  { ate: 4000, cor: [0x8a, 0x6a, 0x5c] },
  { ate: Infinity, cor: [0xd9, 0xd4, 0xcc] },
];

const corDe = (alt) => {
  if (alt <= 0) { for (const f of MAR) if (alt <= f.ate) return f.cor; return MAR.at(-1).cor; }
  for (const f of TERRA) if (alt <= f.ate) return f.cor;
  return TERRA.at(-1).cor;
};

const lon2x = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z);
const lat2y = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z);
};
const y2lat = (y, z) => {
  const n = Math.PI - (2 * Math.PI * y) / 2 ** z;
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};

/* --- escritor de PNG indexado (zlib + CRC32, sem dependência nova) --------- */
const TABELA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = TABELA_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const pedaco = (tipo, dados) => {
  const corpo = Buffer.concat([Buffer.from(tipo, 'ascii'), dados]);
  const tam = Buffer.alloc(4); tam.writeUInt32BE(dados.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(corpo));
  return Buffer.concat([tam, corpo, crc]);
};
function escreverPngIndexado(largura, altura, indices, paleta) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(largura, 0); ihdr.writeUInt32BE(altura, 4);
  ihdr[8] = 8; ihdr[9] = 3;
  const plte = Buffer.alloc(paleta.length * 3);
  paleta.forEach((c, i) => { plte[i * 3] = c[0]; plte[i * 3 + 1] = c[1]; plte[i * 3 + 2] = c[2]; });
  const linhas = Buffer.alloc(altura * (largura + 1));
  for (let y = 0; y < altura; y++) {
    const base = y * (largura + 1);
    linhas[base] = 1;                                    // filtro Sub
    for (let x = 0; x < largura; x++) {
      const v = indices[y * largura + x];
      linhas[base + 1 + x] = (v - (x > 0 ? indices[y * largura + x - 1] : 0)) & 0xff;
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pedaco('IHDR', ihdr), pedaco('PLTE', plte),
    pedaco('IDAT', deflateSync(linhas, { level: 9 })), pedaco('IEND', Buffer.alloc(0)),
  ]);
}

/* --- download com nova tentativa ------------------------------------------ */
async function baixarTelha(z, x, y, tentativa = 0) {
  const n = 2 ** z;
  if (y < 0 || y >= n) return null;                      // fora dos polos
  const xx = ((x % n) + n) % n;                          // o mundo dá a volta em x
  try {
    const r = await fetch(`${FONTE}/${z}/${xx}/${y}.png`);
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return PNG.sync.read(Buffer.from(await r.arrayBuffer()));
  } catch (e) {
    if (tentativa < 3) {
      await new Promise((s) => setTimeout(s, 400 * (tentativa + 1)));
      return baixarTelha(z, x, y, tentativa + 1);
    }
    console.warn(`\n  telha ${z}/${xx}/${y} falhou (${e.message}) — fica como mar`);
    return null;
  }
}

async function emLotes(itens, tamanho, tarefa, rotulo) {
  const saida = [];
  for (let i = 0; i < itens.length; i += tamanho) {
    saida.push(...(await Promise.all(itens.slice(i, i + tamanho).map(tarefa))));
    process.stdout.write(`\r  ${rotulo}: ${Math.min(i + tamanho, itens.length)}/${itens.length}   `);
  }
  process.stdout.write('\n');
  return saida;
}

/* --- um nível: baixa o mosaico com borda, sombreia inteiro, fatia ---------- */
async function assarNivel(z) {
  const x0 = lon2x(CAIXA.oeste, z), x1 = lon2x(CAIXA.leste, z);
  const y0 = lat2y(CAIXA.norte, z), y1 = lat2y(CAIXA.sul, z);

  // borda de um ladrilho: o gradiente da borda precisa enxergar o vizinho
  const bx0 = x0 - 1, bx1 = x1 + 1, by0 = y0 - 1, by1 = y1 + 1;
  const nx = bx1 - bx0 + 1, ny = by1 - by0 + 1;
  const L = nx * TELHA, A = ny * TELHA;

  console.log(`\nz${z} — ${x1 - x0 + 1}×${y1 - y0 + 1} ladrilhos (mosaico ${nx}×${ny} com borda)`);

  const coords = [];
  for (let ty = by0; ty <= by1; ty++) for (let tx = bx0; tx <= bx1; tx++) coords.push([tx, ty]);
  const telhas = await emLotes(coords, 10, ([tx, ty]) => baixarTelha(z, tx, ty), 'baixando');

  const alt = new Float32Array(L * A).fill(-32768);
  telhas.forEach((t, i) => {
    if (!t) return;
    const tx = coords[i][0] - bx0, ty = coords[i][1] - by0;
    for (let py = 0; py < TELHA; py++) {
      for (let px = 0; px < TELHA; px++) {
        const s = (py * TELHA + px) * 4;
        alt[(ty * TELHA + py) * L + tx * TELHA + px] =
          t.data[s] * 256 + t.data[s + 1] + t.data[s + 2] / 256 - 32768;
      }
    }
  });

  // suaviza só a batimetria: o leito oceânico vem de levantamento esparso e o
  // faixamento transforma esse ruído em listra. Na terra o detalhe é dado.
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

  process.stdout.write('  sombreando e fatiando…');
  const paleta = [];
  const indicePorCor = new Map();
  const indiceDe = (r, g, b) => {
    const chave = (r << 16) | (g << 8) | b;
    let i = indicePorCor.get(chave);
    if (i === undefined) { if (paleta.length >= 256) return 0; i = paleta.length; paleta.push([r, g, b]); indicePorCor.set(chave, i); }
    return i;
  };

  // pinta o mosaico inteiro uma vez
  const indices = new Uint8Array(L * A);
  for (let y = 0; y < A; y++) {
    // metros por pixel variam com a latitude; usa a da linha
    const lat = y2lat(by0 + y / TELHA, z);
    const metros = (40075016.686 * Math.cos((lat * Math.PI) / 180)) / 2 ** z / TELHA;
    for (let x = 0; x < L; x++) {
      const i = y * L + x;
      const h = alt[i];
      const cor = h < -30000 ? MAR.at(-1).cor : corDe(h);
      const e = alt[i + (x < L - 1 ? 1 : 0)], o = alt[i - (x > 0 ? 1 : 0)];
      const s = alt[i + (y < A - 1 ? L : 0)], n = alt[i - (y > 0 ? L : 0)];
      const dzdx = (e - o) / (2 * metros), dzdy = (s - n) / (2 * metros);
      let luz = (1 + (dzdx - dzdy) * 1.6) / Math.sqrt(1 + dzdx * dzdx + dzdy * dzdy) / Math.SQRT2;
      luz = Math.max(0, Math.min(2, luz));
      const k = h <= 0 ? 1 : 0.68 + (Math.round(luz * 16) / 16) * 0.46;
      indices[i] = indiceDe(
        Math.max(0, Math.min(255, Math.round(cor[0] * k))),
        Math.max(0, Math.min(255, Math.round(cor[1] * k))),
        Math.max(0, Math.min(255, Math.round(cor[2] * k))),
      );
    }
  }

  // fatia só o miolo: a borda existia só para alimentar o gradiente
  let bytes = 0, contagem = 0;
  const recorte = new Uint8Array(TELHA * TELHA);
  for (let tx = x0; tx <= x1; tx++) {
    await mkdir(resolve(DIR_LADRILHOS, String(z), String(tx)), { recursive: true });
    for (let ty = y0; ty <= y1; ty++) {
      const ox = (tx - bx0) * TELHA, oy = (ty - by0) * TELHA;
      for (let py = 0; py < TELHA; py++) {
        recorte.set(indices.subarray((oy + py) * L + ox, (oy + py) * L + ox + TELHA), py * TELHA);
      }
      // caminho {z}/{x}/{y}.png — convenção XYZ
      const buf = escreverPngIndexado(TELHA, TELHA, recorte, paleta);
      await writeFile(resolve(DIR_LADRILHOS, String(z), String(tx), `${ty}.png`), buf);
      bytes += buf.length; contagem++;
    }
  }
  console.log(`\r  z${z}: ${contagem} ladrilhos, ${(bytes / 1048576).toFixed(2)} MB, paleta de ${paleta.length} cores`);
  return { z, contagem, bytes, x0, x1, y0, y1 };
}

async function principal() {
  await rm(DIR_LADRILHOS, { recursive: true, force: true });
  await mkdir(DIR_LADRILHOS, { recursive: true });
  console.log('Pirâmide de relevo — DEM Terrarium → PNG indexado estático');

  const niveis = [];
  for (const z of ZOOMS) niveis.push(await assarNivel(z));

  const total = niveis.reduce((a, n) => a + n.bytes, 0);
  const quantos = niveis.reduce((a, n) => a + n.contagem, 0);

  await writeFile(resolve(SAIDA, 'relevo.json'), JSON.stringify({
    esquema: '/dados/relevo/{z}/{x}/{y}.png',
    minzoom: Math.min(...ZOOMS),
    maxzoom: Math.max(...ZOOMS),
    tamanhoLadrilho: TELHA,
    limites: [CAIXA.oeste, CAIXA.sul, CAIXA.leste, CAIXA.norte],
    ladrilhos: quantos,
    atribuicao: 'Terrarium / Mapzen DEM',
  }, null, 2));

  console.log(`\nTotal: ${quantos} ladrilhos, ${(total / 1048576).toFixed(1)} MB`);
  console.log('O DEM foi baixado uma vez; em produção isto são arquivos estáticos.');
}

principal().catch((e) => { console.error('\nFalhou:', e); process.exit(1); });
