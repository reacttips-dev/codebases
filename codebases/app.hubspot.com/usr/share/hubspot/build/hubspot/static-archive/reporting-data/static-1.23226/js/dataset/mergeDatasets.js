'use es6';

var keyBuckets = function keyBuckets(dataset) {
  return dataset.get('dimension') ? dataset.updateIn(['dimension', 'buckets'], function (buckets) {
    return buckets.toOrderedMap().mapKeys(function (k, bucket) {
      return bucket.get('key');
    }).map(keyBuckets);
  }) : dataset;
};

var unkeyBuckets = function unkeyBuckets(dataset) {
  return dataset.get('dimension') ? dataset.updateIn(['dimension', 'buckets'], function (buckets) {
    return buckets.toList().map(unkeyBuckets);
  }) : dataset;
};

export var mergeDatasets = function mergeDatasets(datasetA, datasetB) {
  return unkeyBuckets(keyBuckets(datasetA).mergeDeep(keyBuckets(datasetB)));
};