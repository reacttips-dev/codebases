const ent = require('ent');
const sanitizeHtmlLib = require('sanitize-html');

const USER_HTML_TAGS_WHITE_LIST = ['a', 'br', 'p'];

const htmlSanitizationOptions = {
  allowedTags: USER_HTML_TAGS_WHITE_LIST,
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
  },
  transformTags: {
    a(tagName, attribs) {
      return {
        tagName,
        attribs: Object.assign(attribs, {
          rel: 'ugc noopener noreferrer',
          target: '_blank',
        }),
      };
    },
  },
};

function sanitizeHtml(html) {
  if (!html) return html;
  return sanitizeHtmlLib(ent.decode(html), htmlSanitizationOptions);
}

module.exports = { sanitizeHtml };
