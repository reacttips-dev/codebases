'use es6';

export var TODO = 'TODO';
export var CALL = 'CALL';
export var EMAIL = 'EMAIL';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}