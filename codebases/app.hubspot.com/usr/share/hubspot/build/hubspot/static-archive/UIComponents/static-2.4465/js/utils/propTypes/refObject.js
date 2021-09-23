'use es6';

import createChainablePropType from './createChainablePropType';

var refPropType = function refPropType(props, propName, componentName) {
  if (typeof props[propName] === 'object' && Object.prototype.hasOwnProperty.call(props[propName], 'current')) {
    return null;
  }

  return new Error(componentName + ": Invalid " + propName + " value. Expected an object created with React.createRef().");
};

export default createChainablePropType(refPropType, 'ref object');