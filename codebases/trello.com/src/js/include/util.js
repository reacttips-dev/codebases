/* global Sentry */

const Log = require('./logging.js');
const Markdown = require('./pagedown/Markdown.Sanitizer.js');

const converter = Markdown.getSanitizingConverter();

const sanitize = function(text) {
  return String(text).replace(/[&<>"'/]/g, function(s) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
    }[s];
  });
};
window.sanitize = sanitize;

const markdownToHtml = function(text) {
  return converter.makeHtml(text || '');
};
window.markdownToHtml = markdownToHtml;

const handleError = function(context, error) {
  if (/^Invalid context, missing board/.test(error.message)) {
  } else if (/^Plugin disabled on board/.test(error.message)) {
    console.log('[Butler] Power-Up disabled on board.');
  } else {
    Sentry.captureException(error);
    Log.logError(error, context);
  }
};

const makeSlug = function(s, sep) {
  let slug;
  if (sep == null) {
    sep = '-';
  }
  if (s) {
    slug = removeAccents(s.toLowerCase())
      .replace(/[^a-z0-9]+/gi, sep)
      .replace(new RegExp(`^${sep}|${sep}$`, 'g'), '');

    if (slug.length > 128) {
      slug = slug.substr(0, 128);
    }
  }

  return slug || sep;
};

const removeAccents = function(s) {
  // NOTE: If this starts to get too complicated, we might consider using
  // a unicode normalization library
  return s
    .replace(/[àáâãäåāăą]/g, 'a')
    .replace(/æ/g, 'ae')
    .replace(/[çćĉċč]/g, 'c')
    .replace(/[ďđ]/g, 'd')
    .replace(/[èéêëēĕėęě]/g, 'e')
    .replace(/[ĝğġģ]/g, 'g')
    .replace(/[ĥħ]/g, 'h')
    .replace(/[ìíîïĩīĭįı]/g, 'i')
    .replace(/[ñńņňŉŋ]/g, 'n')
    .replace(/[òóôõöōŏő]/g, 'o')
    .replace(/œ/g, 'oe')
    .replace(/ř/g, 'r')
    .replace(/[śŝşš]/g, 's')
    .replace(/ß/g, 'ss')
    .replace(/[ùúûüũūŭůűų]/g, 'u')
    .replace(/[ýÿ]/g, 'y');
};

function normalizeTabForUrl(tab) {
  switch (tab) {
    case 'rule':
    case 'rules':
      return 'rules';
    case 'card-button':
      return 'card-buttons';
    case 'board-button':
      return 'board-buttons';
    case 'schedule':
    case 'schedules':
    case 'scheduled':
      return 'schedule';
    case 'on-dates':
    case 'due-dates':
    case 'duedates':
    case 'dates':
      return 'on-dates';
    case 'suggestions':
      return '';
    case 'connected-apps':
      return 'connected-apps';
    default:
      return tab;
  }
}

module.exports = {
  sanitize,
  markdownToHtml,
  handleError,
  makeSlug,
  normalizeTabForUrl,
};
