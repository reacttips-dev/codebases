'use es6';

import { List } from 'immutable';
import invariant from '../../lib/invariant';
import { PROPERTY } from '../../configure/bucket/dealprogress';
import reprocess from './reprocess';

var precondition = function precondition(config) {
  var dimensions = config.get('dimensions') || List();
  invariant(dimensions.includes(PROPERTY), "expected " + PROPERTY + " in dimensions, but got %s", dimensions);
};

var oneDimensional = reprocess(function (bucket) {
  switch (Number(bucket.get('key'))) {
    case 0:
      return 'LOST';

    case 1:
      return 'WON';

    default:
      return 'OPEN';
  }
});

var twoDimensional = function twoDimensional(config, dataset) {
  return dataset.updateIn(['dimension', 'buckets'], function (aggregations) {
    return aggregations.reduce(function (grouped, aggregation) {
      return grouped.push(oneDimensional(config, aggregation));
    }, List());
  });
};

export default (function (_ref) {
  var dataConfig = _ref.dataConfig,
      dataset = _ref.dataset;
  precondition(dataConfig);
  var dimensions = dataConfig.get('dimensions');
  var bucketedReport = dimensions.indexOf(PROPERTY) === 0 ? oneDimensional(dataConfig, dataset) : twoDimensional(dataConfig, dataset);
  return dimensions.indexOf(PROPERTY) === 0 ? bucketedReport.set('total', bucketedReport.getIn(['dimension', 'buckets']).size) : bucketedReport;
});