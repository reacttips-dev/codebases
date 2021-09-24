'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap } from 'immutable';
import * as MetricTypes from '../../../constants/metricTypes';
import { currency as formatCurrency } from '../../../hydrate/numberFormatter';
import { toUpperCase } from '../../../lib/string';
import { DEAL_CURRENCY_CODE, LINE_ITEM_CURRENCY_CODE, CURRENCY_PROPERTY_NAME, LEGACY_DEAL_AMOUNT_PROPERTIES, CURRENCY_CODE_BY_DATA_TYPE } from '../../../properties/constants/multiCurrencyProperties';
import { getCurrencyInformation } from '../../../public/currency';
import { getExtractByProperty } from '../common/extract-properties';
import getProperties from '../../../properties';

var getMetricProperties = function getMetricProperties(config) {
  return config.get('metrics').map(function (metric) {
    return metric.get('property');
  }).toSet();
};

var getExtractForSearch = function getExtractForSearch(config, spec) {
  return getExtractByProperty(getMetricProperties(config).union(spec.hydrate.inputs).add(spec.properties.idProperty).add(DEAL_CURRENCY_CODE).add(LINE_ITEM_CURRENCY_CODE), spec);
};

var getMetrics = function getMetrics(config, propertyValues, multiCurrencyEnabled, allProperties) {
  return ImmutableMap(getMetricProperties(config).map(function (prop) {
    var property = prop === 'projectedAmount' ? 'hs_projected_amount' : prop;
    var dataType = config.get('dataType');
    var value = propertyValues.get(property, '-');
    var currencyPropertyName = allProperties.getIn([dataType, property, CURRENCY_PROPERTY_NAME]);

    if (multiCurrencyEnabled && (currencyPropertyName || LEGACY_DEAL_AMOUNT_PROPERTIES.includes(property))) {
      var currencyCode = toUpperCase(propertyValues.get(currencyPropertyName) || propertyValues.get(CURRENCY_CODE_BY_DATA_TYPE[dataType]));
      return [property, ImmutableMap(_defineProperty({}, MetricTypes.COUNT, ImmutableMap({
        raw: value,
        formatted: formatCurrency(value, {
          currencyCode: currencyCode
        }),
        propertyMeta: {
          type: 'currency',
          currencyCode: currencyCode
        }
      })))];
    } else {
      return [property, ImmutableMap(_defineProperty({}, MetricTypes.COUNT, value))];
    }
  }).toJS());
};

export var transform = function transform(config, spec, response) {
  return Promise.all([getCurrencyInformation(), getExtractForSearch(config, spec), getProperties(config.get('dataType'))]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        information = _ref2[0],
        extract = _ref2[1],
        allProperties = _ref2[2];

    var _ref3 = information || {},
        hasMulticurrencyActive = _ref3.hasMulticurrencyActive;

    return ImmutableMap({
      dimension: ImmutableMap({
        property: spec.properties.idProperty,
        buckets: response.get(spec.search.objectsField).map(function (obj) {
          var propertyValues = extract(obj);
          var keyLabel = spec.hydrate.fn(propertyValues.toJS());
          return ImmutableMap({
            key: String(propertyValues.get(spec.properties.idProperty)),
            keyLabel: keyLabel,
            metrics: getMetrics(config, propertyValues, hasMulticurrencyActive, allProperties)
          });
        })
      }),
      total: response.get('total')
    });
  });
};