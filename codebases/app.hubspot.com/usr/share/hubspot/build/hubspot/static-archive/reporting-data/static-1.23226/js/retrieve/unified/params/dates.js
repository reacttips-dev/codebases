'use es6';

import makeDateRangeByType from '../../../lib/makeDateRangeByType';
var format = 'YYYYMMDD';
export var get = function get(spec, config) {
  var dataType = config.dataType,
      _config$filters = config.filters;
  _config$filters = _config$filters === void 0 ? {} : _config$filters;
  var _config$filters$dateR = _config$filters.dateRange;
  _config$filters$dateR = _config$filters$dateR === void 0 ? {} : _config$filters$dateR;
  var value = _config$filters$dateR.value;

  var _makeDateRangeByType = makeDateRangeByType(value, format, dataType),
      startDate = _makeDateRangeByType.startDate,
      endDate = _makeDateRangeByType.endDate;

  return {
    start: startDate,
    end: endDate
  };
};