'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Map as ImmutableMap } from 'immutable';
import { currency as formatCurrency } from '../hydrate/numberFormatter';
import fetchProperties from '../properties';
import { extractPropertyNamespace } from '../properties/namespaceProperty';
import { getCurrencyInformation } from '../public/currency';

var getProperties = function getProperties(config) {
  return fetchProperties(config.get('dataType')).then(function (result) {
    return result.reduce(function (memo, properties) {
      return memo.merge(properties);
    }, ImmutableMap());
  });
};

var getExchangeRate = function getExchangeRate(information, currencyCode) {
  var currencyExchangeRates = information.currencyExchangeRates,
      hasMulticurrencyActive = information.hasMulticurrencyActive;

  if (!hasMulticurrencyActive || !currencyExchangeRates) {
    console.error('[reporting-data] currency information not found for this portal');
    return 1;
  }

  var _ref = currencyExchangeRates.find(function (_ref2) {
    var fromCurrencyCode = _ref2.fromCurrencyCode;
    return fromCurrencyCode === currencyCode;
  }) || {},
      conversionMultiplier = _ref.conversionMultiplier;

  if (!conversionMultiplier) {
    console.error('[reporting-data] currency processor not supported for inactive currency %s', currencyCode);
    return 1;
  }

  if (conversionMultiplier <= 0) {
    console.error('[reporting-data] invalid exchange rate $s for currency $s', conversionMultiplier, currencyCode);
    return 1;
  }

  return conversionMultiplier;
};

var isCurrencyProperty = function isCurrencyProperty() {
  var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
  var property = arguments.length > 1 ? arguments[1] : undefined;

  var _extractPropertyNames = extractPropertyNamespace(property),
      propertyName = _extractPropertyNames.propertyName;

  return properties.getIn([property, 'type'], properties.getIn([propertyName, 'type'])) === 'currency';
};

var formatMetrics = function formatMetrics(properties, exchangeRate, currencyCode) {
  return function () {
    var metrics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
    return metrics.map(function () {
      var metric = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
      var property = arguments.length > 1 ? arguments[1] : undefined;
      return isCurrencyProperty(properties, property) ? metric.update(function (metricTypes) {
        return metricTypes.map(function (value) {
          if (value === null) {
            return value;
          }

          var exchanged = value / exchangeRate;
          return ImmutableMap({
            raw: exchanged,
            formatted: formatCurrency(exchanged, {
              currencyCode: currencyCode
            }),
            propertyMeta: {
              type: 'currency',
              currencyCode: currencyCode
            }
          });
        });
      }) : metric;
    });
  };
};

var process = function process(data, properties, exchangeRate, currencyCode) {
  var updated = data.update('metrics', formatMetrics(properties, exchangeRate, currencyCode));
  return updated.hasIn(['dimension', 'buckets']) ? updated.updateIn(['dimension', 'buckets'], function () {
    var buckets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
    return buckets.map(function (bucket) {
      return bucket.has('dimension') ? process(bucket, properties, exchangeRate, currencyCode) : bucket.update('metrics', formatMetrics(properties, exchangeRate, currencyCode));
    });
  }) : updated;
};

export default (function (currencyCode, testXRate) {
  return function (_ref3) {
    var dataConfig = _ref3.dataConfig,
        dataset = _ref3.dataset;
    return Promise.all([getCurrencyInformation(), getProperties(dataConfig)]).then(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          information = _ref5[0],
          properties = _ref5[1];

      var exchangeRate = testXRate || getExchangeRate(information, currencyCode);
      return exchangeRate !== 1 ? process(dataset, properties, exchangeRate, currencyCode) : dataset;
    });
  };
});