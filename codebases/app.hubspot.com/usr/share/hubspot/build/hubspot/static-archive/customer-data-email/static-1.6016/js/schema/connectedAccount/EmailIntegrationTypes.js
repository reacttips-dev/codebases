'use es6';

export { GMAIL, OUTLOOK365 } from './EmailClientTypes';
export var IMAP = 'IMAP';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}