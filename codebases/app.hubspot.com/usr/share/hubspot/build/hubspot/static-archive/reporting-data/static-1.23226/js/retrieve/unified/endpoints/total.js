'use es6';

import { has } from '../../../lib/has';
import { pairs } from './metrics';
import { zero } from './downgrade';

var parse = function parse(spec, config) {
  return function (response) {
    var _config$metrics = config.metrics,
        metrics = _config$metrics === void 0 ? [] : _config$metrics;
    var total = response.total,
        _response$totals = response.totals,
        totals = _response$totals === void 0 ? {} : _response$totals;
    var matrix = {
      dimensions: [],
      metrics: pairs(config),
      keys: [],
      data: metrics.map(function (_ref) {
        var property = _ref.property;
        return has(totals, property) ? totals[property] : 0;
      }),
      total: [total]
    };
    return {
      response: response,
      matrix: matrix
    };
  };
};

export var get = function get(spec, config) {
  return {
    url: spec.url + "/total",
    parse: parse(spec, config),
    downgrade: zero
  };
};