'use es6';

var fallback = function fallback(html) {
  var doc = document.implementation.createHTMLDocument('');
  doc.documentElement.innerHTML = html;
  return doc;
};

export default function parseHTML(html) {
  var doc;

  if (typeof DOMParser !== 'undefined') {
    var parser = new DOMParser();
    doc = parser.parseFromString("<html><body>" + html + "</body></html>", 'text/html');

    if (doc === null || doc.body === null) {
      doc = fallback(html);
    }
  } else {
    doc = fallback(html);
  }

  return doc.body;
}