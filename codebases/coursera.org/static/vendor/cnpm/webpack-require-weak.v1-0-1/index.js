// @flow
'use strict';

// $FlowFixMe
var isWebpackBundle = require('is-webpack-bundle');

/*::
declare var __webpack_require__: Function;
declare var __webpack_modules__: Object;
*/

function requireWeak(id /*: number | string */) {
  if (__webpack_modules__[id]) {
    return __webpack_require__(id);
  }
}

module.exports = isWebpackBundle ? requireWeak : null;
