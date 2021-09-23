'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { has } from '../../../lib/has';
import { pairs } from './metrics';
import { zero } from './fill';
import { chain } from './chain';
import { one } from './downgrade';
import * as frequency from './frequency';
export var parse = function parse(spec, config) {
  return function (response) {
    var dimensions = config.dimensions,
        _config$metrics = config.metrics,
        metrics = _config$metrics === void 0 ? [] : _config$metrics;
    var keys = Object.keys(response);
    var remapped = keys.reduce(function (mapped, key) {
      return Object.assign({}, mapped, _defineProperty({}, key, response[key][0]));
    }, {});
    var matrix = {
      dimensions: dimensions,
      metrics: pairs(config),
      keys: [keys],
      data: keys.map(function (key) {
        return metrics.map(function (_ref) {
          var property = _ref.property;
          return has(remapped, key) ? has(remapped[key], property) ? remapped[key][property] : 0 : 0;
        });
      }),
      total: [keys.length] // TODO: determine count vs. total

    };
    return {
      response: response,
      matrix: matrix
    };
  };
};
export var get = function get(spec, config) {
  return {
    url: spec.url + "/summarize/" + frequency.get(config),
    parse: chain(zero, parse)(spec, config),
    downgrade: one
  };
};