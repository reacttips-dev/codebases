'use es6';

import Raven from 'Raven';
var TIMEOUT = 30000;
var scripts = {};
export default function loadScript(url) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (scripts[url]) {
    return scripts[url];
  }

  var promise = new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    var timeout = setTimeout(function () {
      handleScriptLoad(Error("Loading " + url + " timed out.")); // eslint-disable-line no-use-before-define
    }, TIMEOUT);

    function handleScriptLoad(event) {
      script.onload = null;
      script.onerror = null;
      clearTimeout(timeout);

      if (event.type === 'error') {
        var err = Error("Script " + url + " could not be loaded.");
        Raven.captureException(err);
        reject(err);
      } else {
        resolve();
      }
    }

    script.type = 'text/javascript';
    script.async = true;
    script.timeout = TIMEOUT;
    script.onload = handleScriptLoad;
    script.onerror = handleScriptLoad;
    script.src = url;
    Object.keys(attributes).forEach(function (key) {
      script.setAttribute(key, attributes[key]);
    });
    document.getElementsByTagName('head')[0].appendChild(script);
  });
  scripts[url] = promise;
  return promise;
}