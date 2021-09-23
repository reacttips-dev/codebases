'use es6';

export var VERTICAL = 'VERTICAL';
export var HORIZONTAL = 'HORIZONTAL';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}