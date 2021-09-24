'use es6';

var SPACING_SCALE_STEP_SIZE = 4;
/** Returns the spacing scale value for the given step index
 * @param {number} step Number of steps into the spacing scale
 * @return {string} A CSS length (with units)
 */

export var space = function space(step) {
  return "" + (step < 0 ? '-' : '') + Math.abs(step) * SPACING_SCALE_STEP_SIZE + "px";
};
/** @constant {string} S1 The 1st value in the spacing scale */

export var S1 = space(1);
/** @constant {string} S2 The 2nd value in the spacing scale */

export var S2 = space(2);
/** @constant {string} S3 The 3rd value in the spacing scale */

export var S3 = space(3);
/** @constant {string} S4 The 4th value in the spacing scale */

export var S4 = space(4);
/** @constant {string} S5 The 5th value in the spacing scale */

export var S5 = space(5);
/** @constant {string} S6 The 6th value in the spacing scale */

export var S6 = space(6);
/** @constant {string} S7 The 7th value in the spacing scale */

export var S7 = space(7);
/** @constant {string} S8 The 8th value in the spacing scale */

export var S8 = space(8);

var isValidSide = function isValidSide(sideOrAlias) {
  switch (sideOrAlias) {
    case 'all':
    case 'x':
    case 'y':
    case 'top':
    case 'right':
    case 'bottom':
    case 'left':
      return true;

    default:
      {
        return false;
      }
  }
}; // Mapping of side aliases to sides


var SIDE_ALIAS_MAP = {
  all: ['top', 'right', 'bottom', 'left'],
  x: ['left', 'right'],
  y: ['top', 'bottom']
}; // Returns a list of sides for a given side or side alias

var flattenSideAlias = function flattenSideAlias(sideOrAlias) {
  return SIDE_ALIAS_MAP[sideOrAlias] || [sideOrAlias];
};

var buildSpacingMixin = function buildSpacingMixin(spacingType) {
  var propertyNameForSide = {
    top: spacingType + "Top",
    right: spacingType + "Right",
    bottom: spacingType + "Bottom",
    left: spacingType + "Left"
  };
  return function (side, value) {
    if (typeof side === 'number' && value == null) {
      /* eslint-disable no-param-reassign */
      value = side;
      side = 'all';
      /* eslint-enable no-param-reassign */
    }

    if (!isValidSide(side)) {
      return '';
    }

    var pxDistance = space(value);
    return flattenSideAlias(side).map(function (s) {
      return propertyNameForSide[s];
    }).reduce(function (rules, property) {
      if (property) rules[property] = pxDistance;
      return rules;
    }, {});
  };
};
/**
 * Mixin function for adding padding to a styled component based on a spacing scale.
 * @param {string} [side=all] Can be "all", "x", "y", "top", "right", "bottom", or "left". If omitted, defaults to "all".
 * @param {number} value Spacing scale value (0, 1, 2, 3, 4, 5…)
 * @returns {(Object|string)} styled-components interpolation (mixin)
 */


export var padding = buildSpacingMixin('padding');
/**
 * Mixin function for adding margin to a styled component based on a spacing scale.
 * @param {string} [side=all] Can be "all", "x", "y", "top", "right", "bottom", or "left". If omitted, defaults to "all".
 * @param {number} value Spacing scale value (0, 1, 2, 3, 4, 5…)
 * @returns {(Object|string)} styled-components interpolation (mixin)
 */

export var margin = buildSpacingMixin('margin');