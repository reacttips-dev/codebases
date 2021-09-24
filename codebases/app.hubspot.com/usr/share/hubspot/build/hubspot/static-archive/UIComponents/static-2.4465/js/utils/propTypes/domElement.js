'use es6';

import createChainablePropType from './createChainablePropType';

var domElementPropType = function domElementPropType(props, propName, componentName) {
  var value = props[propName];
  if (value == null || typeof value === 'object' && value.nodeType === 1) return null;
  return new Error(componentName + ": Invalid " + propName + " value. Expected a DOM element.");
};

export default createChainablePropType(domElementPropType, 'DOM element');