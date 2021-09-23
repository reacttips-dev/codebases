'use es6';

export var UNKNOWN = 'UNKNOWN';
export var SENT = 'SENT';
export var PREVIOUSLY_BOUNCED = 'PREVIOUSLY_BOUNCED';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}