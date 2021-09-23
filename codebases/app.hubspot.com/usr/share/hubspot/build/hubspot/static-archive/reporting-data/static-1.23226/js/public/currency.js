'use es6';

import * as http from '../request/http';
import toJS from '../lib/toJS';

var getV1URL = function getV1URL(endpoint) {
  return "multi-currency/v1/currencies/" + endpoint;
};

var getURL = function getURL(endpoint) {
  return "multi-currency/v2/currencies/" + endpoint;
};

export var getCurrencyInformation = function getCurrencyInformation() {
  return http.get(getURL('information')).then(toJS);
};
export var getExchangeRate = function getExchangeRate(fromCurrency, toCurrency) {
  return http.get(getV1URL("exchange-rates/" + fromCurrency + "/" + toCurrency)).then(toJS);
};