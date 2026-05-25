import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const TOLERANCE = 18;

function sampleBackgroundColor(data, info) {
  const { width, height, channels } = info;
  const points = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  const totals = [0, 0, 0];

  for (const [x, y] of points) {
    const offset = (y * width + x) * channels;
    totals[0] += data[offset];
    totals[1] += data[offset + 1];
    totals[2] += data[offset + 2];
  }

  return totals.map((value) => Math.round(value / points.length));
}

function isBackground(r, g, b, a, bg) {
  if (a <= 10) return true;
  return (
    Math.abs(r - bg[0]) <= TOLERANCE &&
    Math.abs(g - bg[1]) <= TOLERANCE &&
    Math.abs(b - bg[2]) <= TOLERANCE
  );
}

function removeBackground({ data, info }) {
  const { width, height, channels } = info;
  const out = Buffer.from(data);
  const bg = sampleBackgroundColor(data, info);
  const visited = new Uint8Array(width * height);
  const queue = [];

  const idx = (x, y) => y * width + x;

  const tryEnqueue = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const i = idx(x, y);
    if (visited[i]) return;
    const offset = i * channels;
    const r = out[offset];
    const g = out[offset + 1];
    const b = out[offset + 2];
    const a = channels === 4 ? out[offset + 3] : 255;
    if (!isBackground(r, g, b, a, bg)) return;
    visited[i] = 1;
    queue.push([x, y]);
  };

  for (let x = 0; x < width; x += 1) {
    tryEnqueue(x, 0);
    tryEnqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    tryEnqueue(0, y);
    tryEnqueue(width - 1, y);
  }

  while (queue.length) {
    const [x, y] = queue.pop();
    const i = idx(x, y);
    const offset = i * channels;
    out[offset + 3] = 0;
    tryEnqueue(x + 1, y);
    tryEnqueue(x - 1, y);
    tryEnqueue(x, y + 1);
    tryEnqueue(x, y - 1);
  }

  return out;
}

async function main() {
  const input = resolve('frontend/public/images/universitet.avif');
  const outputDir = resolve('frontend/public/images');
  const webpPath = resolve(outputDir, 'university.webp');
  const svgPath = resolve(outputDir, 'university.svg');

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const processed = removeBackground({ data, info });
  const width = info.width;
  const height = info.height;

  const pngBuffer = await sharp(processed, {
    raw: { width, height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const webpBuffer = await sharp(processed, {
    raw: { width, height, channels: 4 },
  })
    .webp({ lossless: true, quality: 100, effort: 6, alphaQuality: 100 })
    .toBuffer();

  await mkdir(dirname(webpPath), { recursive: true });
  await writeFile(webpPath, webpBuffer);

  const encoded = pngBuffer.toString('base64');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${encoded}"/>
</svg>
`;
  await writeFile(svgPath, svg, 'utf8');

  console.log(`Saved: ${webpPath}`);
  console.log(`Saved: ${svgPath}`);
  console.log(`Size: ${width}x${height}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
