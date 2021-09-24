'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { List, OrderedMap } from 'immutable';
import { AGGREGATION } from '../constants/configTypes';
export var densify = function densify(config, base, compare) {
  var joined = base.concat(compare);
  var configType = config.get('configType');
  var dimensionality = config.get('dimensions').count(); // NOTE: only handle 1 dimensional aggregations for now e.g. social-posts

  if (dimensionality !== 1 || configType !== AGGREGATION) {
    return joined;
  }

  var path = [0, 'dimension', 'buckets'];
  var buckets = base.getIn(path, List());
  var comparisons = compare.getIn(path, List());

  if (buckets.isEmpty() && comparisons.isEmpty()) {
    return joined;
  }

  var joinedBuckets = buckets.concat(comparisons);
  var empty = joinedBuckets.getIn([0, 'metrics']).update(function (metrics) {
    return metrics.map(function (points) {
      return points.map(function (metric) {
        return metric.merge({
          raw: null,
          formatted: '-'
        });
      });
    });
  });
  var mappedBuckets = buckets.reduce(function (mapped, bucket) {
    return mapped.set(bucket.get('key'), bucket);
  }, OrderedMap());
  var mappedComparisons = comparisons.reduce(function (mapped, bucket) {
    return mapped.set(bucket.get('key'), bucket);
  }, OrderedMap());
  var mappedEmpty = joinedBuckets.reduce(function (mapped, bucket) {
    return mapped.set(bucket.get('key'), bucket.set('metrics', empty));
  }, OrderedMap());
  var mappedJoined = mappedBuckets.merge(mappedComparisons);

  var _mappedJoined$reduce = mappedJoined.reduce(function (_ref, bucket, key) {
    var _ref2 = _slicedToArray(_ref, 2),
        first = _ref2[0],
        second = _ref2[1];

    return [mappedBuckets.has(key) ? first.push(mappedBuckets.get(key)) : first.push(mappedEmpty.get(key)), mappedComparisons.has(key) ? second.push(mappedComparisons.get(key)) : second.push(mappedEmpty.get(key))];
  }, [List(), List()]),
      _mappedJoined$reduce2 = _slicedToArray(_mappedJoined$reduce, 2),
      denseBuckets = _mappedJoined$reduce2[0],
      denseComparisons = _mappedJoined$reduce2[1];

  var updatedBase = base.setIn(path, denseBuckets);
  var updatedCompare = compare.setIn(path, denseComparisons);
  return updatedBase.concat(updatedCompare);
};