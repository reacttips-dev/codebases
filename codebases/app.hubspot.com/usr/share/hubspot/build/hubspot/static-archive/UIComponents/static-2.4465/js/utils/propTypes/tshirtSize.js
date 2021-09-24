'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import createChainablePropType from './createChainablePropType';
var tshirtLonghandMap = {
  xs: 'extra-small',
  sm: 'small',
  md: 'medium',
  lg: 'large',
  xl: 'extra-large'
};
var tshirtShorthandMap = {
  'extra-small': 'xs',
  small: 'sm',
  medium: 'md',
  large: 'lg',
  'extra-large': 'xl'
};
/**
 * @param {string} size
 * @returns {string} The shorthand size corresponding to the given longhand size, or `size` itself.
 */

export var toShorthandSize = function toShorthandSize(size) {
  return tshirtShorthandMap[size] || size;
};
var shortNames = Object.keys(tshirtLonghandMap);
/**
 * @param  [] supportedSizes
 * @param  [] extras - add custom size names here and maybe we'll let it slide
 * @default ['xs', 'sm', 'md', 'lg', 'xl']
 */

export var propTypeForSizes = function propTypeForSizes() {
  var supportedSizes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : shortNames;
  var extras = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!Array.isArray(supportedSizes)) {
    throw new Error("expected sizes array, got " + supportedSizes);
  }

  if (!supportedSizes.length || !supportedSizes.every(function (size) {
    return tshirtLonghandMap[size];
  })) {
    throw new Error("expected sizes array to include only valid sizes from [xs, sm, md, lg, xl], got [" + supportedSizes.join(', ') + "]");
  }

  var mostValues = [].concat(_toConsumableArray(supportedSizes), _toConsumableArray(supportedSizes.map(function (k) {
    return tshirtLonghandMap[k];
  })));
  var allValues = [].concat(_toConsumableArray(mostValues), _toConsumableArray(extras));

  var validator = function validator(props, propName, componentName) {
    if (props[propName]) {
      var value = props[propName];

      if (allValues.indexOf(value) === -1) {
        return new Error(componentName + ": Invalid " + propName + " value. Expected T-Shirt Size (" + mostValues.join(', ') + "), got \"" + value + "\".");
      }
    }

    return null;
  };

  return createChainablePropType(validator, 'tshirtSize', {
    sizes: supportedSizes,
    aliases: tshirtLonghandMap
  });
};
export var allSizes = propTypeForSizes();