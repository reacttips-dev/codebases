'use es6';

import { List } from 'immutable';
import { formatToReferencesList } from '../lib/formatReferences';
import http from 'hub-http/clients/apiClient';
import get from 'transmute/get';
import indexBy from 'transmute/indexBy';
import formatMultiCurrencyInformation from '../formatters/formatMultiCurrencyInformation';
var formatter = formatToReferencesList({
  getId: get('fromCurrencyCode'),
  getLabel: get('fromCurrencyCode')
});
export var createFetchAllCurrencies = function createFetchAllCurrencies(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get('multi-currency/v1/currencies').then(function (result) {
      return List(result).filter(get('active')).filter(get('visible'));
    }).then(function (response) {
      return indexBy(get('id'), formatter(response));
    });
  };
};
export var fetchAllCurrencies = createFetchAllCurrencies({
  httpClient: http
});
export var createFetchMultiCurrencyInfo = function createFetchMultiCurrencyInfo(_ref2) {
  var httpClient = _ref2.httpClient;
  return function () {
    return httpClient.get('multi-currency/v1/currencies/information').then(formatMultiCurrencyInformation);
  };
};
export var fetchMultiCurrencyInfo = createFetchMultiCurrencyInfo({
  httpClient: http
});