'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { has } from '../../../lib/has';
import { pairs } from './metrics';
import { one } from './downgrade';

var parse = function parse(spec, config) {
  return function (response) {
    var dimensions = config.dimensions,
        _config$metrics = config.metrics,
        metrics = _config$metrics === void 0 ? [] : _config$metrics;
    var total = response.total,
        totals = response.totals,
        _response$breakdowns = response.breakdowns,
        breakdowns = _response$breakdowns === void 0 ? [] : _response$breakdowns;
    var keys = breakdowns.map(function (_ref) {
      var breakdown = _ref.breakdown;
      return breakdown;
    });
    var remapped = breakdowns.reduce(function (mapped, breakdown) {
      return Object.assign({}, mapped, _defineProperty({}, breakdown.breakdown, breakdown));
    }, {});
    var matrix = Object.assign({
      dimensions: dimensions,
      metrics: pairs(config),
      keys: [keys],
      data: keys.map(function (key) {
        return metrics.map(function (_ref2) {
          var property = _ref2.property;
          return has(remapped, key) ? has(remapped[key], property) ? remapped[key][property] : has(remapped[key].metadata, property) ? remapped[key].metadata[property] : null : null;
        });
      }),
      // TODO: determine count vs. total
      total: [total]
    }, totals ? {
      totals: metrics.map(function (_ref3) {
        var property = _ref3.property;
        return has(totals, property) ? totals[property] : 0;
      })
    } : {});
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
    downgrade: one
  };
};