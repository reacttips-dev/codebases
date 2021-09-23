'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap, List, Set as ImmutableSet } from 'immutable';
/**
 * Collect subaggregation keys
 *
 * @param {Immutable.Map} data Data format
 * @returns {Immutable.Set} Set of subaggregation keys
 */

export var collectSubaggregationKeys = function collectSubaggregationKeys(data) {
  return data.getIn(['dimension', 'buckets'], List()).reduce(function (keys, outer) {
    return outer.getIn(['dimension', 'buckets'], List()).reduce(function (memo, inner) {
      return memo.add(inner.get('key'));
    }, keys);
  }, ImmutableSet());
};
/**
 * Create dense dataset
 *
 * @param {Immutable.Set} keys Set of subaggregation keys
 * @param {Immutable.Map} data Data format
 * @returns {Immutable.Map} Dense data format
 */

export var createDenseDataset = function createDenseDataset(keys, data, metric) {
  var empty = ImmutableMap(_defineProperty({}, metric.get('property'), metric.get('metricTypes').reduce(function (acc, type) {
    return acc.set(type, 0);
  }, ImmutableMap())));
  return data.updateIn(['dimension', 'buckets'], function () {
    var outers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
    return outers.map(function (outer) {
      return outer.updateIn(['dimension', 'buckets'], function () {
        var inners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
        var mapped = inners.reduce(function (memo, inner) {
          return memo.set(inner.get('key'), inner);
        }, ImmutableMap());
        var missing = keys.filter(function (key) {
          return !mapped.has(key);
        }).map(function (key) {
          return ImmutableMap({
            key: key,
            metrics: empty
          });
        });
        return inners.concat(missing);
      });
    });
  });
};