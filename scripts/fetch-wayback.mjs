// Downloads the most recent Wayback Machine snapshot of every archived content page
// into data/wayback/html (raw) and data/wayback/text (tag-stripped). Re-runnable; skips existing files.
import fs from 'node:fs';
const rows = JSON.parse(fs.readFileSync('data/wayback/cdx-index.json', 'utf8')).slice(1);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const paths = new Set();
for (const [url, mime] of rows) {
  if (mime !== 'text/html' || /cpanel|webmail|wp-login|wp-content|:80\//.test(url)) continue;
  paths.add(new URL(url).pathname);
}
const slug = p => (p.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'home');
const toText = html => html
  .replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, '')
  .replace(/<\/(p|div|h\d|li|tr|section|header|footer|nav|br)>|<br\s*\/?>/gi, '\n')
  .replace(/<h(\d)[^>]*>/gi, (_, n) => '\n' + '#'.repeat(+n) + ' ')
  .replace(/<a [^>]*href="([^"]*)"[^>]*>/gi, '[$1] ')
  .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;/g, "'")
  .replace(/&#8211;/g, '-').replace(/&#8220;|&#8221;/g, '"').replace(/[ \t]+/g, ' ')
  .replace(/\n\s*\n+/g, '\n\n').trim();
for (const p of paths) {
  const out = `data/wayback/html/${slug(p)}.html`;
  if (fs.existsSync(out)) continue;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(`http://web.archive.org/web/2026id_/https://dentalassistantco.com${p}`);
      if (res.status === 429) { await sleep(30000); continue; }
      const html = await res.text();
      fs.writeFileSync(out, html);
      fs.writeFileSync(`data/wayback/text/${slug(p)}.md`, `<!-- source: ${res.url} -->\n` + toText(html));
      console.log(res.status, p);
      break;
    } catch (e) { console.log('ERR', p, e.message); await sleep(10000); }
  }
  await sleep(4000);
}
console.log('done');
