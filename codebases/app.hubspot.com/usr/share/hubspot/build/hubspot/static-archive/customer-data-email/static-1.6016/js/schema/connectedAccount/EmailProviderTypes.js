'use es6';

export var GOOGLE_FREE = 'GOOGLE_FREE';
export var GOOGLE_APPS = 'GOOGLE_APPS';
export var OUTLOOK365 = 'OUTLOOK365';
export var UNKNOWN = 'UNKNOWN';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}