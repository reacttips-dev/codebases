'use es6';

import { List, Map as ImmutableMap } from 'immutable';
import { SEARCH } from '../../constants/configTypes';
import { normalizeDatasetEmptiness } from '../../lib/normalizeEmptiness';
import { shouldBeSmallScale } from '../../lib/smallScale';
import { fromMetricKey, METRIC_DELIMITER } from './datasetMetrics';
import { Dataset } from './datasetRecords';
import { enhanceColumnDataset } from './enhanceColumns';
import { upgradeData } from './upgradeData';
import { upgradeLabels } from './upgradeLabels';
import { upgradeProperty } from './upgradeProperties';
import { formatForScientificNotation } from './utils';

var cleanupSearchDataset = function cleanupSearchDataset(dataset) {
  return dataset.update('properties', function () {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
    // https://github.com/immutable-js/immutable-js/issues/1364
    return properties.reduce(function (acc, value, key) {
      if (acc.has(fromMetricKey(key).property)) {
        return acc;
      }

      return acc.set(fromMetricKey(key).property, value);
    }, ImmutableMap());
  }).update('data', function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
    return data.map(function (row) {
      return row.filter(function (value) {
        return !(List.isList(value) && value.isEmpty());
      }).mapKeys(function (key) {
        return fromMetricKey(key).property;
      });
    });
  }).update(normalizeDatasetEmptiness);
};

export var fixScientificNotation = function fixScientificNotation(data, properties) {
  return data.map(function (row) {
    return row.map(function (value, key) {
      var propertyType = properties.getIn([key, 'type']);
      return propertyType === 'number' || propertyType === 'id' ? formatForScientificNotation(value) : value;
    });
  });
};
export var fromDataset = function fromDataset(config, oldDataset) {
  var propertiesByDataType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ImmutableMap();

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      comparePropertyLabel = _ref.comparePropertyLabel,
      _ref$isSummary = _ref.isSummary,
      isSummary = _ref$isSummary === void 0 ? false : _ref$isSummary;

  var isSearch = config.get('configType') === SEARCH;
  var searchDimension = isSearch && oldDataset.getIn(['dimension', 'property']);
  config = isSearch ? config.set('dimensions', List([searchDimension])).update('metrics', function () {
    var metrics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
    return metrics.map(function (m) {
      return m.set('metricTypes', List.of('COUNT'));
    });
  }) : config;
  var dataType = config.get('dataType');
  var currentDataTypeProperties = propertiesByDataType.get(dataType) || ImmutableMap();
  var properties = upgradeLabels(config, oldDataset, isSummary).map(function (propertyData, propertyOrMetric) {
    var _fromMetricKey = fromMetricKey(propertyOrMetric),
        property = _fromMetricKey.property;

    var propertyInfo = upgradeProperty(currentDataTypeProperties.get(property), config);
    return propertyInfo ? propertyInfo.merge(propertyData) : propertyData;
  });
  var data = fixScientificNotation(upgradeData(oldDataset), properties);
  var paginationSize = oldDataset.getIn(['total', 'raw']);
  var dataAge = oldDataset.get('dataAge');
  var dataset = Dataset({
    data: data,
    properties: properties,
    paginationSize: paginationSize,
    dataAge: dataAge
  });

  if (isSearch) {
    dataset = cleanupSearchDataset(dataset).set('searchDimension', searchDimension);
  }

  var smallScaleMetrics = shouldBeSmallScale(dataset, List(dataset.get('properties').keys()).filter(function (key) {
    return key.includes(METRIC_DELIMITER);
  }));
  dataset = dataset.update('properties', function (props) {
    return props.map(function (property, propertyName) {
      return smallScaleMetrics.get(propertyName) ? property.set('shouldBeSmallScale', true) : property;
    });
  });
  var comparisonLabelPath = ['properties', config.getIn(['dimensions', 0]), 'label'];

  if (comparePropertyLabel && dataset.hasIn(comparisonLabelPath)) {
    dataset = dataset.setIn(comparisonLabelPath, comparePropertyLabel);
  }

  return enhanceColumnDataset(dataset, config);
};