'use es6';

import getProperties from './';
import * as PropertyTypes from '../constants/property-types';
export function getPropertyType(dataType, property) {
  return getProperties(dataType).then(function (properties) {
    return properties.getIn([dataType, property, 'type'], PropertyTypes.UNKNOWN);
  });
}