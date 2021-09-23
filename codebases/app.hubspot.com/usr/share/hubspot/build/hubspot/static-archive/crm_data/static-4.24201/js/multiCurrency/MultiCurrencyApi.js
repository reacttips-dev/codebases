'use es6';

import translate from 'transmute/translate';
import { get } from 'crm_data/api/ImmutableAPI';
import { EMPTY } from 'crm_data/constants/LoadingStatus';
var baseUrl = 'multi-currency/v2/currencies';
export var fetchHomeCurrency = function fetchHomeCurrency() {
  return get(baseUrl + "/home-currency").then(translate({
    homeCurrencyCode: 'currencyCode'
  })).catch(function (err) {
    var status = err.status;

    if ([403, 404].includes(status)) {
      return EMPTY;
    }

    throw err;
  });
};