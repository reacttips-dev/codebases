'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var pick = function pick(object, keys) {
  return Object.keys(object).filter(function (key) {
    return keys.includes(key);
  }).reduce(function (acculumatedObject, key) {
    return Object.assign({}, acculumatedObject, _defineProperty({}, key, object[key]));
  }, {});
};

export default pick;