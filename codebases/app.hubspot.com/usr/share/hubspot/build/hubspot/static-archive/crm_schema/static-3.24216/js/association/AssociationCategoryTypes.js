'use es6';

export var HUBSPOT_DEFINED = 'HUBSPOT_DEFINED';
export var USER_DEFINED = 'USER_DEFINED';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = module.exports;
}