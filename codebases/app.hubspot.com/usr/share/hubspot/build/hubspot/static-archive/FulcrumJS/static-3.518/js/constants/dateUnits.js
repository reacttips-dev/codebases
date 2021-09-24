'use es6';

export var MILLISECONDS = 'milliseconds';
export var DAYS = 'days';
export var WEEKS = 'weeks';
export var MONTHS = 'months';
export var YEARS = 'years';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}