'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { has } from '../../../lib/has';
import { pairs } from './metrics';
import { zero } from './fill';
import { chain } from './chain';
import { two } from './downgrade';
import * as frequency from './frequency';
export var parse = function parse(spec, config) {
  return function (response) {
    var dimensions = config.dimensions,
        _config$metrics = config.metrics,
        metrics = _config$metrics === void 0 ? [] : _config$metrics;
    var keys = Object.keys(response);
    var subkeys = keys.reduce(function (points, key) {
      return [].concat(_toConsumableArray(points), _toConsumableArray(response[key]));
    }, []).reduce(function (memo, _ref) {
      var breakdown = _ref.breakdown;
      return !memo.includes(breakdown) ? [].concat(_toConsumableArray(memo), [breakdown]) : memo;
    }, []);
    var remapped = keys.reduce(function (mapped, key) {
      return Object.assign({}, mapped, _defineProperty({}, key, response[key].reduce(function (keyed, point) {
        return Object.assign({}, keyed, _defineProperty({}, point.breakdown, point));
      }, {})));
    }, {});
    var matrix = {
      dimensions: dimensions,
      metrics: pairs(config),
      keys: [keys, subkeys],
      data: keys.map(function (key) {
        return subkeys.map(function (subkey) {
          return metrics.map(function (_ref2) {
            var property = _ref2.property;
            return has(remapped, key) ? has(remapped[key], subkey) ? has(remapped[key][subkey], property) ? remapped[key][subkey][property] : 0 : 0 : 0;
          });
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
    url: spec.url + "/" + frequency.get(config),
    parse: chain(zero, parse)(spec, config),
    downgrade: two
  };
};