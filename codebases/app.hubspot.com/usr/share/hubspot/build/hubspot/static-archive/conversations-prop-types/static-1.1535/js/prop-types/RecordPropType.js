'use es6';

import { wrapValidator } from './wrapValidator';

function RecordPropType(recordTypeName) {
  if (typeof recordTypeName !== 'string') {
    throw new TypeError('a string is required for the RecordPropType');
  }

  var validator = function recordIsType(props, propName, componentName) {
    var propValue = props[propName];

    if (propValue == null) {
      return null;
    }

    var propValueName = propValue._name;

    if (!propValueName) {
      return new Error("Invalid prop `" + propName + "` of type `" + typeof propValue + "` supplied to `" + componentName + "`. Expected Record of type `" + recordTypeName + "`");
    }

    if (propValueName !== recordTypeName) {
      return new Error("Invalid Record prop `" + propName + "` of type `" + propValueName + "` supplied to `" + componentName + "`. Expected `" + recordTypeName + "`");
    }

    return null;
  };

  validator.isRequired = function requiredRecordIsType(props, propName, componentName) {
    var propValue = props[propName];

    if (!propValue) {
      return new Error("Required " + propName + " was not specified in " + componentName);
    }

    return validator(props, propName, componentName);
  };

  return wrapValidator(validator, "recordIsType: " + recordTypeName);
}

export default RecordPropType;