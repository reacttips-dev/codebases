'use es6';

import invariant from 'react-utils/invariant';
import isNumber from 'transmute/isNumber';
import isObject from 'transmute/isObject';
var allowedMethods = ['UPDATE', 'DELETE'];
export var enforceProperties = function enforceProperties(_ref) {
  var properties = _ref.properties,
      method = _ref.method;
  if (method === 'DELETE') return;
  invariant(typeof properties !== 'undefined', "expected 'properties' parameter, but one wasn't included.");
  properties.forEach(function (property) {
    invariant(isObject(property), "expected property to be an object but got " + typeof property + " instead");
    invariant(typeof property.name !== 'undefined' && typeof property.value !== 'undefined', "expected property to have keys \"name\" and \"value\" but got " + Object.keys(property) + " instead");
  });
};
export var enforceMethod = function enforceMethod(_ref2) {
  var method = _ref2.method;
  return invariant(Array.from(allowedMethods).includes(method), "expected method to be one of " + allowedMethods + " but got " + method + " instead");
};
export var enforceIdList = function enforceIdList(_ref3) {
  var query = _ref3.query;
  if (!Array.isArray(query)) return;
  query.map(function (id) {
    return invariant(isNumber(id), 'expected method to be a number but got "%s" instead', typeof id);
  });
};