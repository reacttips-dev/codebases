/**
 * safeHtmlId(str) makes any string safe for use as an html id by replacing
 * all non-allowed characters with 'Z' + <char code> + 'Z' and by prepending 'I'.
 * (And of course safeHtmlId also replaces 'Z' with 'Z90Z' in order to
 * prevent collisions).
 */
export default function (str) {
  return (
    'I' +
    str.replace(/[^a-zA-Y0-9]/, function (match) {
      return 'Z' + match.charCodeAt(0) + 'Z';
    })
  );
}
