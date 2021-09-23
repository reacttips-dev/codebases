'use es6';

import { getWindowLocation } from './getWindowLocation';
export var getIsEmbeddedInProduct = function getIsEmbeddedInProduct() {
  return getWindowLocation().paramValue('inApp53') === 'true';
};