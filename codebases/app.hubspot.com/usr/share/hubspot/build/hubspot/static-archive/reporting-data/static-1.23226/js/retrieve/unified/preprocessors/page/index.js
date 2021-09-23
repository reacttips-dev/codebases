'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";

var page = function page(spec, config) {
  return function (breakdowns) {
    var _config$offset = config.offset,
        offset = _config$offset === void 0 ? 0 : _config$offset,
        _config$limit = config.limit,
        limit = _config$limit === void 0 ? Infinity : _config$limit;
    return breakdowns.slice(offset, offset + limit);
  };
};

export var get = function get(spec, config) {
  return function (response) {
    var _config$dimensions = config.dimensions;
    _config$dimensions = _config$dimensions === void 0 ? [] : _config$dimensions;

    var _config$dimensions2 = _slicedToArray(_config$dimensions, 1),
        primary = _config$dimensions2[0],
        limit = config.limit,
        offset = config.offset;

    if (!(offset || limit)) {
      return response;
    }

    if (primary === 'sessionDate') {
      var dates = Object.keys(response);
      return dates.reduce(function (paged, date) {
        return Object.assign({}, paged, _defineProperty({}, date, page(spec, config)(response[date])));
      }, {});
    }

    var breakdowns = response.breakdowns;
    return Object.assign({}, response, {
      breakdowns: page(spec, config)(breakdowns)
    });
  };
};