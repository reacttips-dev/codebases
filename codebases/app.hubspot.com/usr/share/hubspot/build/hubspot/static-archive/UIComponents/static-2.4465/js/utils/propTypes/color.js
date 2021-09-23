'use es6';

import createChainablePropType from './createChainablePropType';
export var isValidColorHex = function isValidColorHex(color) {
  return /^#?[0-9A-Fa-f]{0,6}$/.test(color);
};

var color = function color(props, propName, componentName) {
  if (props[propName]) {
    var value = props[propName];

    if (!isValidColorHex(value)) {
      return new Error(componentName + ": Invalid color value. Expected format RRGGBB, got \"" + value + "\".");
    }
  }

  return null;
};

export var propType = createChainablePropType(color, 'color');