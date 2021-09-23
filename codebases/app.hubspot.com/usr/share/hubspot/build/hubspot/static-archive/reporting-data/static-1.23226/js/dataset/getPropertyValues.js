'use es6';

import { Set as ImmutableSet, Record, Map as ImmutableMap, List } from 'immutable';
var value = Record({
  raw: null,
  label: null
});

function extractRecurse(property, dataset, values) {
  var nextValues = values;

  if (dataset.has('metrics')) {
    nextValues = dataset.get('metrics').reduce(function (memo, metricValue, metricProperty) {
      return metricProperty === property ? memo.concat(metricValue.valueSeq().flatMap(function (val) {
        return List.isList(val) ? val : List([val]);
      }).map(function (raw) {
        return ImmutableMap.isMap(raw) ? raw : value({
          raw: raw
        });
      })) : memo;
    }, nextValues);
  }

  if (dataset.getIn(['dimension', 'property']) === property) {
    nextValues = nextValues.concat(dataset.getIn(['dimension', 'buckets']).map(function (bucket) {
      return value({
        raw: bucket.get('key'),
        label: bucket.get('keyLabel')
      });
    }));
  }

  if (dataset.has('dimension') && dataset.hasIn(['dimension', 'buckets'])) {
    nextValues = dataset.getIn(['dimension', 'buckets']).reduce(function (memo, bucket) {
      return extractRecurse(property, bucket, memo);
    }, nextValues);
  }

  return nextValues;
}

export default (function (property, dataset) {
  return extractRecurse(property, dataset, ImmutableSet());
});