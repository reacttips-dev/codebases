const ent = require('ent');
const stripTags = require('striptags');

function stripHtml(html) {
  if (!html) return html;
  return stripTags(ent.decode(html));
}

module.exports = { stripHtml };
