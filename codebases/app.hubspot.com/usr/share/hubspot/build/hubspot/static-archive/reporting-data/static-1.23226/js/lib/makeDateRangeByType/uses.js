'use es6';

import * as DataTypes from '../../constants/dataTypes';
import * as UnifiedDataTypes from '../../constants/dataTypes/unified';
export var utc = [DataTypes.TEMPLATES];
export var sunday = Object.keys(UnifiedDataTypes);
export var get = function get(dataType) {
  return {
    utc: utc.includes(dataType) || false,
    sunday: sunday.includes(dataType) || false
  };
};