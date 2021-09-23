'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _currencyOptions;

import I18n from 'I18n';
import sortOptions from './sortOptions';
import { currencyFormatters, currencyStyles } from 'I18n/internal/utils/CurrencyLabelFormatters';
export var currencyOptions = (_currencyOptions = {}, _defineProperty(_currencyOptions, currencyStyles.short, []), _defineProperty(_currencyOptions, currencyStyles.long, []), _currencyOptions);
export var getCurrencyOptions = function getCurrencyOptions(_ref) {
  var currencyStyle = _ref.currencyStyle,
      currenciesFilter = _ref.currenciesFilter,
      validCurrencies = _ref.validCurrencies;

  var filter = currenciesFilter || function (currency) {
    return validCurrencies.indexOf(currency.value) >= 0;
  };

  var initialOptions = currencyOptions[currencyStyle];

  if (!validCurrencies && !currenciesFilter && initialOptions.length) {
    return initialOptions;
  } else if (initialOptions.length) {
    return initialOptions.filter(filter);
  }

  currencyOptions[currencyStyle] = Object.keys(I18n.currencySymbols).map(function (code) {
    return {
      text: currencyFormatters[currencyStyle](code),
      value: code
    };
  }).sort(sortOptions);

  if (validCurrencies || currenciesFilter) {
    return currencyOptions[currencyStyle].filter(filter);
  }

  return currencyOptions[currencyStyle];
};