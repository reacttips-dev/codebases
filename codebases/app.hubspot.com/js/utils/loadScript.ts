export default function loadScript(scriptSrc) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var otherScript = document.getElementsByTagName('script')[0];
  var newScript = document.createElement('script');

  if (attributes.defer) {
    newScript.defer = attributes.defer;
    delete attributes.defer;
  } else {
    newScript.async = true;
  }

  newScript.src = scriptSrc;
  newScript.onload = attributes.onload;
  delete attributes.onload;
  newScript.onerror = attributes.onerror;
  delete attributes.onerror;
  Object.keys(attributes).map(function (key) {
    newScript.setAttribute(key, attributes[key]);
    return key;
  });

  if (otherScript && otherScript.parentNode) {
    otherScript.parentNode.insertBefore(newScript, otherScript);
  } else {
    /* no op, to FIX, otherScript could be null */
  }
}