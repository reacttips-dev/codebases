'use es6';

export var GMAIL = 'GMAIL';
export var OUTLOOK365 = 'OUTLOOK365';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}