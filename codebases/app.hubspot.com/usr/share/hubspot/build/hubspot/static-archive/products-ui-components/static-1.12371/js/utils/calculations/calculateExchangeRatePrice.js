'use es6';

import I18n from 'I18n';
export default function calculateExchangeRatePrice(multicurrencies, fromCurrencyCode, toCurrencyCode, initialPrice) {
  if (!multicurrencies) {
    return null;
  }

  var currencyInfo = I18n.currencySymbols[toCurrencyCode];
  var decimalDigits = currencyInfo !== undefined && currencyInfo.decimal_digits !== undefined ? currencyInfo.decimal_digits : 2;
  var fromInitialCurrency = multicurrencies.find(function (currency) {
    return currency.referencedObject.get('active') && currency.referencedObject.get('fromCurrencyCode') === fromCurrencyCode;
  });
  var fromTargetCurrency = multicurrencies.find(function (currency) {
    return currency.referencedObject.get('active') && currency.referencedObject.get('fromCurrencyCode') === toCurrencyCode;
  });

  if (!fromInitialCurrency || !fromTargetCurrency) {
    // The set of multicurrencies does not have the either the from OR target
    // currencies (eg. it may have been archived)
    return null;
  }

  var toHomeCurrencyMultiplier = fromInitialCurrency ? fromInitialCurrency.referencedObject.get('conversionMultiplier') : 1;
  var toTargetCurrencyMultiplier = 1 / fromTargetCurrency.referencedObject.get('conversionMultiplier');
  var untruncatedResult = initialPrice * toHomeCurrencyMultiplier * toTargetCurrencyMultiplier;
  return parseFloat(untruncatedResult.toFixed(decimalDigits));
}