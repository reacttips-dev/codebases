'use es6';

import { Map as ImmutableMap } from 'immutable';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
export default (function (_ref) {
  var currencyExchangeRates = _ref.currencyExchangeRates,
      hasMulticurrencyActive = _ref.hasMulticurrencyActive,
      homeCurrency = _ref.homeCurrency;
  var defaultRecord = ReferenceRecord({
    id: 'default',
    label: homeCurrency.currencyCode,
    referencedObject: ImmutableMap(Object.assign({}, homeCurrency, {
      hasMulticurrencyActive: hasMulticurrencyActive
    }))
  });
  var exchangeRecords = currencyExchangeRates.reduce(function (acc, exchangeRate) {
    return acc.set(exchangeRate.fromCurrencyCode, ReferenceRecord({
      id: exchangeRate.fromCurrencyCode,
      label: exchangeRate.fromCurrencyCode,
      description: "" + exchangeRate.conversionMultiplier,
      referencedObject: ImmutableMap(exchangeRate)
    }));
  }, ImmutableMap());
  return exchangeRecords.set('default', defaultRecord);
});