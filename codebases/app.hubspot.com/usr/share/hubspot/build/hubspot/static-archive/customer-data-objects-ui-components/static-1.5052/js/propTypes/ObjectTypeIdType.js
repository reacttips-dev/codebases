'use es6';

import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';

var ObjectTypeIdType = function ObjectTypeIdType(isRequired, props, propName, componentName) {
  var propValue = props[propName];

  if (propValue == null) {
    if (isRequired) {
      if (propValue === null) {
        return new Error("The prop `" + propName + "` is marked as required in `" + componentName + "`, but its value is `null`.");
      }

      return new Error("The prop `" + propName + "` is marked as required in `" + componentName + "`, but its value is `undefined`.");
    }

    return null;
  }

  if (!isObjectTypeId(propValue)) {
    return new Error("Invalid prop `" + propName + "` of value `" + propValue + "` supplied to `" + componentName + "`, expected an object type id of format \"<meta id>-<id>\"");
  }

  return null;
}; // Support 'ObjectTypeIdType.isRequired'
// See https://github.com/facebook/react/issues/9125
// See https://github.com/facebook/prop-types/blob/master/factoryWithTypeCheckers.js


var chainedObjectTypeIdType = ObjectTypeIdType.bind(null, false);
chainedObjectTypeIdType.isRequired = ObjectTypeIdType.bind(null, true);
export default chainedObjectTypeIdType;