'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _currencyFormatters;

import I18n from 'I18n';
export var currencyStyles = {
  short: 'short',
  long: 'long'
};

var getCurrencySymbol = function getCurrencySymbol(_ref) {
  var code = _ref.code,
      symbol = _ref.symbol,
      symbolNative = _ref.symbolNative;
  var finalSymbol = symbol;

  if (code === symbol && code !== symbolNative) {
    finalSymbol = symbolNative;
  } else if (code === symbol) {
    finalSymbol = '';
  }

  return finalSymbol;
};

export var formatCurrencyLabel = function formatCurrencyLabel(currencyCode, currencyStyle) {
  var currencyValue = I18n.currencySymbols[currencyCode] || I18n.currencySymbols.USD;
  var code = currencyValue.code;
  var symbol = getCurrencySymbol({
    code: code,
    symbol: currencyValue.symbol,
    symbolNative: currencyValue.symbol_native
  });

  if (currencyStyle === currencyStyles.short) {
    return code + " " + symbol;
  }

  return currencyValue.name + " (" + code + ") " + symbol;
};
export var formatCurrencyCode = function formatCurrencyCode(currencyCode) {
  return formatCurrencyLabel(currencyCode, currencyStyles.short);
};
export var formatCurrencyName = function formatCurrencyName(currencyCode) {
  return formatCurrencyLabel(currencyCode, currencyStyles.long);
};
export var currencyFormatters = (_currencyFormatters = {}, _defineProperty(_currencyFormatters, currencyStyles.short, formatCurrencyCode), _defineProperty(_currencyFormatters, currencyStyles.long, formatCurrencyName), _currencyFormatters);