'use es6';

import devLogger from 'react-utils/devLogger'; // Backwards compatibility for UIComponents/avatar/UIAvatar (HubSpot/UIComponents#4738)

/* backcompat old `shape` prop values */

export var computeShapeProp = function computeShapeProp(shape) {
  if (shape === 'square') {
    devLogger.warn({
      message: 'UIAvatar: `shape="square"` is deprecated. Use `shape="default"` instead.',
      key: 'UIAvatar: deprecated `shape="square"` prop value'
    });
    return 'default';
  }

  return shape;
}; // aliases for old `size` prop values

var sizePropAliases = {
  'extra-small': 'xs',
  small: 'sm',
  medium: 'md',
  large: 'lg',
  'extra-large': 'xl'
};
/** backcompat old UIAvatar `size` prop values */

export var computeSizeProp = function computeSizeProp(rawSizeProp) {
  var size = sizePropAliases[rawSizeProp] || rawSizeProp;

  if (size !== rawSizeProp) {
    devLogger.warn({
      message: "UIAvatar: `size=\"" + rawSizeProp + "\"` is deprecated. Use `size=\"" + size + "\"` instead.",
      key: "UIAvatar: deprecated `size=\"" + rawSizeProp + "\"` prop value"
    });
  }

  return size;
};