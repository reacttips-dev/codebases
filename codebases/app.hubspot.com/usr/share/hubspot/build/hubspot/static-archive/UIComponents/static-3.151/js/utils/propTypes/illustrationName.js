'use es6';

import PropTypes from 'prop-types';
import createChainablePropType from './createChainablePropType';
var illustrationNames;
var propType;
export function getUniqueIllustrationNames() {
  if (!illustrationNames) {
    illustrationNames = process.env.NODE_ENV === 'production' ? [] : Object.keys(require('ui-images/metadata').illustrations);
  }

  return illustrationNames;
}
export function getIllustrationNamePropType() {
  if (!propType) {
    propType = PropTypes.oneOf(getUniqueIllustrationNames());
  }

  return createChainablePropType(propType, 'illustrationName');
}