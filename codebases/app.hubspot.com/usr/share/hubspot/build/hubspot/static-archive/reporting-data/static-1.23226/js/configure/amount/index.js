'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap, List } from 'immutable';
import { DEALS, LINE_ITEMS } from '../../constants/dataTypes';
import compose from '../../lib/compose';
import { configureMetrics, configureFilters } from '../common';
var mapping = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, DEALS, {
  amount_in_deal_currency: 'amount',
  closed_amount_in_deal_currency: 'hs_closed_amount',
  projected_amount_in_deal_currency: 'hs_projected_amount'
}), _defineProperty(_ImmutableMap, LINE_ITEMS, {
  amount: 'amount',
  price: 'price'
}), _ImmutableMap));

var shouldConfigure = function shouldConfigure(config) {
  var dataType = config.get('dataType');

  if (!mapping.has(dataType)) {
    return false;
  }

  return Boolean(config.get('metrics', List()).find(function (metric) {
    return mapping.hasIn([dataType, metric.get('property')]);
  }));
};

var configure = compose(configureFilters(mapping), configureMetrics(mapping));
export default (function (config) {
  return shouldConfigure(config) ? configure(config) : config;
});