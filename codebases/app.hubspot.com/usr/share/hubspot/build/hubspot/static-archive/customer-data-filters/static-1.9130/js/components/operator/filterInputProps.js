'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _allowedProps;

var allowedProps = (_allowedProps = {}, _defineProperty(_allowedProps, 'data-selenium-test', true), _defineProperty(_allowedProps, 'placeholder', true), _defineProperty(_allowedProps, 'onChange', true), _defineProperty(_allowedProps, 'className', true), _defineProperty(_allowedProps, 'value', true), _allowedProps);
/**
 * Filter out props that are not supported by Canvas components.
 *
 * Canvas components pass all the props they receive to the native HTML elements
 * as {...rest}. That makes react complain about unrecognized props
 * e.g "Warning: React does not recognize the filterFamily prop on a DOM element."
 */

export var getTransferableProps = function getTransferableProps(props) {
  var customPropsToAllow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.keys(props).reduce(function (acc, key) {
    if (allowedProps[key] || customPropsToAllow[key]) {
      acc[key] = props[key];
    }

    return acc;
  }, {});
};