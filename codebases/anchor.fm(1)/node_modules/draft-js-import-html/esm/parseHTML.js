export default function parseHTML(html) {
  var doc;

  if (typeof DOMParser !== 'undefined') {
    var parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');
  } else {
    doc = document.implementation.createHTMLDocument('');

    if (doc.documentElement) {
      doc.documentElement.innerHTML = html;
    }
  } // This makes Flow happy


  return doc.body || doc.createElement('body');
}