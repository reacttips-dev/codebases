'use es6';

import * as UnifiedDataTypes from '../../constants/dataTypes/unified';
export var get = function get(dataType) {
  return Object.prototype.hasOwnProperty.call(UnifiedDataTypes, dataType);
};