import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS, List, Map as ImmutableMap, OrderedMap } from 'immutable';
import { AGGREGATION } from '../../../constants/configTypes';
import { toMetricKey } from '../../dataset/datasetMetrics';
var DATA_PATH = ['data', 'data'];

var mapKeysToRows = function mapKeysToRows(dataset, dimension) {
  return dataset.getIn(DATA_PATH).reduce(function (map, row) {
    return map.set(row.get(dimension), row);
  }, OrderedMap());
};

var fillMissingRefs = function fillMissingRefs(references, missingRefs, referencesPath, otherDataset) {
  return missingRefs.reduce(function (refs, key) {
    return refs.set(key, otherDataset.getIn([].concat(_toConsumableArray(referencesPath), [key])));
  }, references);
};

export var densifyComparison = function densifyComparison(config, datasets) {
  var configType = config.get('configType');
  var dimensionality = config.get('dimensions').count();

  if (dimensionality !== 1 || configType !== AGGREGATION) {
    return datasets;
  }

  var primary = datasets.find(function (dataset) {
    return dataset.has('primary');
  }).get('primary');
  var compare = datasets.find(function (dataset) {
    return dataset.has('compare');
  }).get('compare');

  if (primary.getIn(DATA_PATH).isEmpty() && compare.getIn(DATA_PATH).isEmpty()) {
    return datasets;
  }

  var dimension = config.getIn(['dimensions', 0]);
  var primaryMapped = mapKeysToRows(primary, dimension);
  var compareMapped = mapKeysToRows(compare, dimension);
  var mappedJoined = primaryMapped.merge(compareMapped);
  var emptyRow = config.get('metrics').reduce(function (row, metric) {
    return row.merge(metric.get('metricTypes').reduce(function (acc, type) {
      return acc.set(toMetricKey({
        property: metric.get('property'),
        type: type
      }), null);
    }, ImmutableMap()));
  }, ImmutableMap());

  var empty = function empty(key) {
    return ImmutableMap(_defineProperty({}, dimension, key)).merge(emptyRow);
  };

  var primaryMissingRefs = [];
  var compareMissingRefs = [];

  var _mappedJoined$reduce = mappedJoined.reduce(function (_ref, __, key) {
    var _ref2 = _slicedToArray(_ref, 2),
        first = _ref2[0],
        second = _ref2[1];

    if (!primaryMapped.has(key)) {
      primaryMissingRefs.push(key);
    }

    if (!compareMapped.has(key)) {
      compareMissingRefs.push(key);
    }

    return [primaryMapped.has(key) ? first.push(primaryMapped.get(key)) : first.push(empty(key)), compareMapped.has(key) ? second.push(compareMapped.get(key)) : second.push(empty(key))];
  }, [List(), List()]),
      _mappedJoined$reduce2 = _slicedToArray(_mappedJoined$reduce, 2),
      primaryDense = _mappedJoined$reduce2[0],
      compareDense = _mappedJoined$reduce2[1];

  var referencesPath = ['data', 'properties', dimension, 'references'];
  var updatedPrimary = primary.setIn(DATA_PATH, primaryDense).updateIn(referencesPath, function (references) {
    return fillMissingRefs(references, primaryMissingRefs, referencesPath, compare);
  });
  var updatedCompare = compare.setIn(DATA_PATH, compareDense).updateIn(referencesPath, function (references) {
    return fillMissingRefs(references, compareMissingRefs, referencesPath, primary);
  });
  return fromJS([{
    primary: updatedPrimary
  }, {
    compare: updatedCompare
  }]);
};