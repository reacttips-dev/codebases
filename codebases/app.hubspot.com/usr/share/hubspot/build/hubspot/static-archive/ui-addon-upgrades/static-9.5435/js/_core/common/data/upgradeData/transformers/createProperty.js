'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
export var createProperty = function createProperty(propertyKey, propertyValue) {
  return Promise.resolve(_defineProperty({}, propertyKey, propertyValue));
};