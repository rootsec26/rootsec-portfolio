import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const SRC = "public/images/ashraf-1.jpeg";

// Square face-centered crop: cover-fit to 1:1 using saliency-based "attention"
// positioning so the face stays centered with natural padding.
const base = () => sharp(SRC);

async function png(size, out) {
  await base().resize(size, size, { fit: "cover", position: "attention" })
    .png({ compressionLevel: 9 }).toFile(out);
  console.log("wrote", out);
}

await mkdir("src/app", { recursive: true });
await mkdir("public", { recursive: true });

// App Router convention: auto-detected icon + apple icon
await png(512, "src/app/icon.png");
await png(180, "src/app/apple-icon.png");

// Multi-size .ico (32 + 48), PNG-encoded entries
const icon32 = await base().resize(32, 32, { fit: "cover", position: "attention" }).png().toBuffer();
const icon48 = await base().resize(48, 48, { fit: "cover", position: "attention" }).png().toBuffer();

function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // icon
  header.writeUInt16LE(images.length, 4);
  const dirSize = 16 * images.length;
  let offset = 6 + dirSize;
  const entries = [];
  const datas = [];
  for (const { buf, size } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size, 0);
    e.writeUInt8(size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    datas.push(buf);
    offset += buf.length;
  }
  return Buffer.concat([header, ...entries, ...datas]);
}

await writeFile("public/favicon.ico", buildIco([{ buf: icon32, size: 32 }, { buf: icon48, size: 48 }]));
console.log("wrote public/favicon.ico");
