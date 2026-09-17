// Replaces snapshots that captured the host's bot-challenge page ("One moment, please...")
// by trying every other capture of the same path, newest first.
import fs from 'node:fs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { toText } = await import('./wayback-text.mjs');
const dir = 'data/wayback/html';
const bad = f => /One moment, please|<title>Loader/.test(fs.readFileSync(`${dir}/${f}`, 'utf8'));
const get = async url => {
  for (let i = 0; i < 4; i++) {
    try { const r = await fetch(url); if (r.status === 429) { await sleep(30000); continue; } return r; }
    catch { await sleep(10000); }
  }
};
for (const f of fs.readdirSync(dir).filter(bad)) {
  const path = '/' + (f === 'home.html' ? '' : f.replace(/\.html$/, '').replace(/__/g, '/') + '/');
  const cdx = await get(`http://web.archive.org/cdx/search/cdx?url=dentalassistantco.com${path}&output=json&fl=timestamp,original&filter=statuscode:200&filter=mimetype:text/html`);
  const caps = cdx ? (await cdx.json().catch(() => [])).slice(1).reverse() : [];
  let fixed = false;
  for (const [ts, orig] of caps) {
    await sleep(4000);
    const r = await get(`http://web.archive.org/web/${ts}id_/${orig}`);
    if (!r) continue;
    const html = await r.text();
    if (/One moment, please|<title>Loader/.test(html)) continue;
    fs.writeFileSync(`${dir}/${f}`, html);
    fs.writeFileSync(`data/wayback/text/${f.replace(/\.html$/, '.md')}`, `<!-- source: ${r.url} -->\n` + toText(html));
    console.log('fixed', path, ts); fixed = true; break;
  }
  if (!fixed) console.log('UNFIXED', path, caps.length, 'captures');
}
console.log('done');
