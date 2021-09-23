'use es6';

export function stripHtmlFromString(html) {
  return html.replace(/<[^>]+>/g, '');
}