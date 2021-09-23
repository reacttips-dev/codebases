'use es6';

import { List } from 'immutable';
import invariant from '../../lib/invariant';
import { getStage, PROPERTY } from '../../configure/bucket/lifecyclestage';
import reprocess from './reprocess';

var precondition = function precondition(config) {
  var dimensions = config.get('dimensions') || List();
  invariant(dimensions.includes(PROPERTY), "expected " + PROPERTY + " in dimensions, but got %s", dimensions);
};

var oneDimensional = function oneDimensional(config, dataset) {
  var stage = getStage(config);

  var groupBy = function groupBy(bucket) {
    return ['create', bucket.get('key')].includes(stage) ? 'YES' : 'NO';
  };

  return reprocess(groupBy)(config, dataset);
};

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
  return dimensions.indexOf(PROPERTY) === 0 ? oneDimensional(dataConfig, dataset) : twoDimensional(dataConfig, dataset);
});