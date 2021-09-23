'use es6';

import { ICON_SHIRT_SIZES } from '../constants/FileTypeIcon';
export default function overrideIconDimensionsForCustomIcon(initialProps, passedInPropSize) {
  var iconSize = typeof passedInPropSize === 'number' ? passedInPropSize : ICON_SHIRT_SIZES[String(passedInPropSize).toLowerCase()];
  var iconProps = Object.assign({}, initialProps, {
    size: iconSize || ICON_SHIRT_SIZES['sm']
  });
  return iconProps;
}