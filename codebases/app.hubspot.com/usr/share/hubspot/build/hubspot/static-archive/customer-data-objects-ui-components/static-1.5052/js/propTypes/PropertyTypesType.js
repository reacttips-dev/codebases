'use es6';

import * as PropertyTypes from 'customer-data-objects/property/PropertyTypes';
import PropTypes from 'prop-types';
export default PropTypes.oneOf(Object.keys(PropertyTypes).map(function (key) {
  return PropertyTypes[key];
}));