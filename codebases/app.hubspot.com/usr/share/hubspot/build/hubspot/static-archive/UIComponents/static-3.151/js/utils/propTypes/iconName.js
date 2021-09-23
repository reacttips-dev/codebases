'use es6';

import PropTypes from 'prop-types';
import createChainablePropType from './createChainablePropType';
var propType;
export function getIconNamePropType() {
  if (!propType) {
    var iconNames = []; // Optimization: omit this require in production builds (which skip proptype validation)

    if (process.env.NODE_ENV !== 'production') {
      var iconNamesModule = require('icons/iconNames');

      iconNames = iconNamesModule.default || iconNamesModule;
    }

    propType = PropTypes.oneOf(iconNames);
  }

  return createChainablePropType(propType, 'iconName');
}