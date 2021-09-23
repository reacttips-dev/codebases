'use es6';

import { findContactFilters, findEngagementFilters, findSubmissionFilters } from '../../../configure/unified/feedback/common';
import * as DataTypes from '../../../constants/dataTypes';
var dataTypes = [DataTypes.UNIFIED_FEEDBACK_WEB, DataTypes.UNIFIED_FEEDBACK_EMAIL, DataTypes.UNIFIED_FEEDBACK_TRENDS];
export var get = function get(spec, config) {
  var supported = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : dataTypes;
  var dataType = config.dataType,
      _config$filters = config.filters;
  _config$filters = _config$filters === void 0 ? {} : _config$filters;
  var _config$filters$custo = _config$filters.custom,
      custom = _config$filters$custo === void 0 ? [] : _config$filters$custo;

  if (supported.includes(dataType)) {
    var contactFilters = findContactFilters(custom);
    var engagementFilters = findEngagementFilters(custom);
    var submissionFilters = findSubmissionFilters(custom);
    return {
      method: 'POST',
      data: {
        contactFilters: contactFilters,
        engagementFilters: engagementFilters,
        submissionFilters: submissionFilters
      }
    };
  }

  return {
    method: 'GET',
    data: {}
  };
};