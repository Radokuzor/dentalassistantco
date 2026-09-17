// HTML -> rough markdown text used for the saved Wayback snapshots.
export const toText = html => html
  .replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, '')
  .replace(/<\/(p|div|h\d|li|tr|section|header|footer|nav|br)>|<br\s*\/?>/gi, '\n')
  .replace(/<h(\d)[^>]*>/gi, (_, n) => '\n' + '#'.repeat(+n) + ' ')
  .replace(/<a [^>]*href="([^"]*)"[^>]*>/gi, '[$1] ')
  .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;/g, "'")
  .replace(/&#8211;/g, '-').replace(/&#8220;|&#8221;/g, '"').replace(/[ \t]+/g, ' ')
  .replace(/\n\s*\n+/g, '\n\n').trim();
