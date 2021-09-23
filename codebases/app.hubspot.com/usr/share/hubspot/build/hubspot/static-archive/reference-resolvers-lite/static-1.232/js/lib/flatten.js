'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

var flatten = function flatten(arr) {
  var _ref;

  return (_ref = []).concat.apply(_ref, _toConsumableArray(arr));
};

export default flatten;