'use es6';

var PROPERTY = 'dealstage.probability';

var negativeLost = function negativeLost(data) {
  return data.updateIn(['dimension', 'buckets'], function (buckets) {
    return buckets.map(function (bucket) {
      if (bucket.has('dimension')) {
        return negativeLost(bucket);
      } else {
        return data.getIn(['dimension', 'property']) === PROPERTY && bucket.get('key') === 'LOST' ? bucket.update('metrics', function (metrics) {
          return metrics.map(function (metric) {
            return metric.map(function (val) {
              return -1 * val;
            });
          });
        }) : bucket;
      }
    });
  });
};

export default (function (_ref) {
  var dataset = _ref.dataset;
  return negativeLost(dataset);
});