'use es6';

import createChainablePropType from './createChainablePropType';
export default function createLazyPropType(rawPropType) {
  var propTypeWithFuncEval = function propTypeWithFuncEval(props, propName) {
    var value = props[propName];

    if (!value || typeof value === 'function') {
      return null;
    } // If the value is not a function, check that it satisfies rawPropType


    for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rest[_key - 2] = arguments[_key];
    }

    return rawPropType.apply(void 0, [props, propName].concat(rest));
  }; // Name this propType "lazyX", where "X" is the name of the raw prop type


  var rawPropTypeName = rawPropType.__INTROSPECTION__ ? rawPropType.__INTROSPECTION__.type : 'value';
  var lazyPropTypeName = "lazy" + (rawPropTypeName.charAt(0).toUpperCase() + rawPropTypeName.slice(1));
  var chainablePropType = createChainablePropType(propTypeWithFuncEval, lazyPropTypeName);
  return chainablePropType;
}