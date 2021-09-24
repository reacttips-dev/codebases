'use es6';

import { List } from 'immutable';
import { AGGREGATION, TIME_SERIES } from '../../constants/configTypes';
import { EQ, IN } from '../../constants/operators';
import { Promise } from '../../lib/promise';
import { toUpperCase } from '../../lib/string';
import { CURRENCY_PROPERTY_NAME, LEGACY_DEAL_AMOUNT_PROPERTIES } from '../../properties/constants/multiCurrencyProperties';
import { getCurrencyInformation } from '../../public/currency';
import { getFilterByProperty } from '../../config/filters/functions';
var FALLBACK = 'USD';

var getCurrencyCode = function getCurrencyCode(config, homeCurrency) {
  return function (property, propertyInfo) {
    var configType = config.get('configType');
    var currencyPropertyName = propertyInfo.get(CURRENCY_PROPERTY_NAME);
    var currencyFilter = getFilterByProperty(config, currencyPropertyName);

    if ([AGGREGATION, TIME_SERIES].includes(configType) && (currencyPropertyName || LEGACY_DEAL_AMOUNT_PROPERTIES.includes(property))) {
      if (currencyFilter) {
        if (currencyFilter.get('operator') === EQ) {
          return toUpperCase(currencyFilter.get('value'));
        } else if (currencyFilter.get('operator') === IN && currencyFilter.get('values', List()).size === 1) {
          return toUpperCase(currencyFilter.get('values', List()).first());
        }
      } // This scenario is if we are attempting to aggregate on a property that represents multiple currencies, we generally recommend using a property in home currenccies as long as the downstream reporting systems do not do currency conversion


      return null;
    }

    return homeCurrency;
  };
};

export default (function (config, properties) {
  var metrics = config.get('metrics');
  var hasCurrencyProperty = metrics.some(function (metric) {
    var property = metric.get('property');
    return properties.getIn([property, 'type']) === 'currency';
  });
  return hasCurrencyProperty ? getCurrencyInformation().then(function (_ref) {
    var _ref$homeCurrency$cur = _ref.homeCurrency.currencyCode,
        currencyCode = _ref$homeCurrency$cur === void 0 ? FALLBACK : _ref$homeCurrency$cur;
    return getCurrencyCode(config, currencyCode);
  }) : Promise.resolve(function () {
    return null;
  });
});