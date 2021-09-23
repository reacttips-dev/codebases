export default function loadStyles(src) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var newStyles = document.createElement('link');
  Object.keys(attributes).map(function (key) {
    newStyles.setAttribute(key, attributes[key]);
    return key;
  });
  newStyles.type = 'text/css';
  newStyles.rel = 'stylesheet';
  newStyles.href = src;
  document.head.insertBefore(newStyles, document.head.childNodes[document.head.childNodes.length - 1].nextSibling);
}