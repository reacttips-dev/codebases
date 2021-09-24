'use es6';

import Storage from '../util/Storage';
var QA_DOT_COM = 'qa.com';
var HUBLET_REGEX = /^(?:local|app)-(.*).(?:hubspot)(?:qa)?.com/;
var storage;

try {
  var localStorage = window && window.localStorage ? window.localStorage : false;
  storage = new Storage(localStorage);
} catch (e) {
  storage = new Storage(false);
}

export function isQa() {
  if (storage.getItem('ENV') === 'qa') {
    return true;
  }

  return document.domain.indexOf(QA_DOT_COM) >= 0;
}
export function getHublet(url) {
  if (HUBLET_REGEX.test(url)) {
    return HUBLET_REGEX.exec(url)[1];
  }

  return 'na1';
}
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}