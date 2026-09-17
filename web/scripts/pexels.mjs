// Usage: npm run pexels -- "<search query>" <output-name> [index]
// Downloads a Pexels photo into public/images/<output-name>.jpg and records the credit
// in src/data/image-credits.json. Reads PEXELS_API_KEY from ../.env.
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(new URL("../../.env", import.meta.url), "utf8")
    .split(/\r?\n/).filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const [query, name, index = "0"] = process.argv.slice(2);
if (!query || !name) throw new Error('Usage: npm run pexels -- "<query>" <name> [index]');

const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`, {
  headers: { Authorization: env.PEXELS_API_KEY },
});
if (!res.ok) throw new Error(`Pexels ${res.status}`);
const photo = (await res.json()).photos[Number(index)];
if (!photo) throw new Error("No photo at that index");

const img = await fetch(photo.src.large2x);
fs.writeFileSync(`public/images/${name}.jpg`, Buffer.from(await img.arrayBuffer()));

const creditsPath = "src/data/image-credits.json";
const credits = fs.existsSync(creditsPath) ? JSON.parse(fs.readFileSync(creditsPath, "utf8")) : {};
credits[name] = { pexelsId: photo.id, alt: photo.alt, photographer: photo.photographer, photographerUrl: photo.photographer_url, url: photo.url, width: photo.width, height: photo.height };
fs.writeFileSync(creditsPath, JSON.stringify(credits, null, 2) + "\n");
console.log(name, "←", photo.url, "by", photo.photographer, "|", photo.alt);
