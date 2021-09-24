'use es6';

import devLogger from 'react-utils/devLogger';

function deprecated(propType, message, defaultValue) {
  var deprecatedPropType = function deprecatedPropType(props, propName, componentName, location) {
    var propValue = props[propName];
    var output = typeof message === 'function' ? message(propName, propValue, props) : message;

    if (output && propValue !== defaultValue) {
      devLogger.warn(output);
    }

    for (var _len = arguments.length, rest = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
      rest[_key - 4] = arguments[_key];
    }

    return propType.apply(void 0, [props, propName, componentName, location].concat(rest));
  };

  if (propType.__INTROSPECTION__) {
    deprecatedPropType.__INTROSPECTION__ = Object.assign({}, propType.__INTROSPECTION__, {
      deprecated: true
    });
  }

  return deprecatedPropType;
}

export default deprecated;