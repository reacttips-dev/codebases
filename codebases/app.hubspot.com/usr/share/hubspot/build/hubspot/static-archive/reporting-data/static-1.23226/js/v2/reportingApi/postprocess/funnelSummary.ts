import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { fromJS, Map as ImmutableMap } from 'immutable';
import { number } from '../../../hydrate/numberFormatter';
var COUNT_METRIC = 'SUM|count';

var calculateTotal = function calculateTotal(data) {
  return data.reduce(function (total, row) {
    return total + row.get(COUNT_METRIC);
  }, 0);
};

export var createFunnelSummary = function createFunnelSummary(datasets) {
  var primary = datasets.find(function (dataset) {
    return dataset.has('primary');
  }).get('primary');
  var total = calculateTotal(primary.getIn(['data', 'data']));
  var summary = fromJS({
    summary: {
      data: {
        data: [_defineProperty({}, COUNT_METRIC, total)],
        properties: _defineProperty({}, COUNT_METRIC, primary.getIn(['data', 'properties', COUNT_METRIC]).set('references', ImmutableMap(_defineProperty({}, String(total), {
          label: number(total)
        }))))
      }
    }
  });
  return [].concat(_toConsumableArray(datasets), [summary]);
};