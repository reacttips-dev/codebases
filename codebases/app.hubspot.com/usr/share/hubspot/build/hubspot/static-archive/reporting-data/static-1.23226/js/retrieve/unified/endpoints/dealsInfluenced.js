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
        hydratedDeals = response.hydratedDeals;
    var keys = hydratedDeals.map(function (_ref) {
      var dealId = _ref.dealId;
      return dealId;
    });
    var remapped = hydratedDeals.reduce(function (mapped, deal) {
      return Object.assign({}, mapped, _defineProperty({}, deal.dealId, deal));
    }, {});
    var matrix = {
      dimensions: dimensions,
      metrics: pairs(config),
      keys: [keys],
      data: keys.map(function (key) {
        return metrics.map(function (_ref2) {
          var property = _ref2.property;
          return has(remapped, key) ? has(remapped[key], property) ? remapped[key][property] : has(remapped[key].metadata, property) ? remapped[key].metadata[property] : null : null;
        });
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
    url: spec.url + "/deals-influenced",
    parse: parse(spec, config),
    downgrade: one
  };
};