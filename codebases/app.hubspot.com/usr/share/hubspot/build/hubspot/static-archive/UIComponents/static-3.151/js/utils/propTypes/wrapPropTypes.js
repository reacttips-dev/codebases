'use es6';

import * as PropTypes from 'prop-types';
import * as decorators from './decorators';
/**
 * Takes a component and returns the propTypes for that component
 * where all required props with a default value are made optional.
 * This is intended to make wrapper component prop types easier
 * to construct.
 */

export function wrapPropTypes(_ref) {
  var propTypes = _ref.propTypes,
      defaultProps = _ref.defaultProps;
  var result = {};

  for (var _i = 0, _Object$keys = Object.keys(propTypes); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    var original = propTypes[key];

    if (typeof original !== 'function') {
      original = PropTypes.any;
    }

    var required = !original.isRequired;
    var hasDefault = Object.prototype.hasOwnProperty.call(defaultProps, key);

    if (required && hasDefault) {
      // in this case we have no reference back to the non-required version
      result[key] = decorators.notRequired(original);
    } else {
      result[key] = original || propTypes.any;
    }
  }

  return result;
}