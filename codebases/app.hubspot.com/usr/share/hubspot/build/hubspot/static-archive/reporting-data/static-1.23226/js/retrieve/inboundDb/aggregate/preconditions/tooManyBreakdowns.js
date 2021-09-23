'use es6';

import { Map as ImmutableMap, List, Set as ImmutableSet } from 'immutable';
import { TooManyBreakdownsException } from '../../../../exceptions';
var DISTINCT_BREAKDOWN_LIMIT = 100;

var countBreakdowns = function countBreakdowns(data) {
  var firstDimension = data.get('aggregations', ImmutableMap());
  var distinctValues = firstDimension.reduce(function (acc, bucket) {
    return acc.union(bucket.reduce(function (set, datapoint) {
      datapoint.get('aggregations', ImmutableMap()).forEach(function (secondDimension) {
        secondDimension.forEach(function (breakdown) {
          set = set.add(breakdown.get('key'));
        });
      });
      return set;
    }, new ImmutableSet()));
  }, new ImmutableSet());
  return distinctValues;
};

var precondition = function precondition(response) {
  var distinctValues = List.isList(response) ? response.reduce(function (set, data) {
    return set.union(countBreakdowns(data));
  }, new ImmutableSet()) : countBreakdowns(response);

  if (distinctValues.count() > DISTINCT_BREAKDOWN_LIMIT) {
    throw new TooManyBreakdownsException();
  }
};

export default precondition;