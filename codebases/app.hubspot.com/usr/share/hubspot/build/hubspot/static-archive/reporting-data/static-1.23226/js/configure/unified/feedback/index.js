'use es6';

import { Promise } from '../../../lib/promise';
import { UNIFIED_FEEDBACK_TRENDS, UNIFIED_FEEDBACK_WEB, UNIFIED_FEEDBACK_EMAIL } from '../../../constants/dataTypes';
var dataTypes = [UNIFIED_FEEDBACK_TRENDS, UNIFIED_FEEDBACK_WEB, UNIFIED_FEEDBACK_EMAIL];
export var configure = function configure(config) {
  var dataType = config.get('dataType');

  if (dataTypes.includes(dataType)) {
    return Promise.resolve(config);
  }

  return Promise.resolve(config);
};