'use es6';

import { isIntrospectionEnabled } from './internal/introspection'; // Factory for the .required version of the propType function.
// See https://www.ian-thomas.net/custom-proptype-validation-with-react/

export default function createChainablePropType(validate, propTypeName) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  function checkType(isRequired, props, propName, componentName) {
    if (props[propName] == null) {
      if (isRequired) {
        return new Error("Required prop `" + propName + "` was not specified in `" + componentName + "`.");
      }

      return null;
    }

    for (var _len = arguments.length, rest = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
      rest[_key - 4] = arguments[_key];
    }

    return validate.apply(void 0, [props, propName, componentName].concat(rest));
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  if (isIntrospectionEnabled()) {
    var introspectionObj = {
      args: args,
      type: propTypeName
    };
    chainedCheckType.__INTROSPECTION__ = introspectionObj;
    chainedCheckType.isRequired.__INTROSPECTION__ = Object.assign({}, introspectionObj, {
      isRequired: true
    });
  }

  return chainedCheckType;
}