'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

var _AMOUNT_PROPERTIES_BY, _CURRENCY_CODE_BY_DAT;

import * as dataTypes from '../../constants/dataTypes';
import { namespaceProperty } from '../namespaceProperty';
var DEAL_AMOUNT_PROPERTIES = ['amount_in_deal_currency', 'closed_amount_in_deal_currency', 'projected_amount_in_deal_currency', 'amount', 'closedAmount', 'hs_closed_amount', 'projectedAmount', 'hs_projected_amount', 'hs_tcv', 'hs_mrr', 'hs_arr'];
export var LEGACY_DEAL_AMOUNT_PROPERTIES = ['projectedAmount', 'closedAmount'];
var LINE_ITEM_AMOUNT_PROPERTIES = ['amount', 'price', 'hs_tcv'];
export var CURRENCY_PROPERTY_NAME = 'currencyPropertyName';
export var DEAL_CURRENCY_CODE = 'deal_currency_code';
export var LINE_ITEM_CURRENCY_CODE = 'hs_line_item_currency_code';
export var AMOUNT_PROPERTIES_BY_DATA_TYPE = (_AMOUNT_PROPERTIES_BY = {}, _defineProperty(_AMOUNT_PROPERTIES_BY, dataTypes.DEALS, DEAL_AMOUNT_PROPERTIES), _defineProperty(_AMOUNT_PROPERTIES_BY, dataTypes.LINE_ITEMS, LINE_ITEM_AMOUNT_PROPERTIES), _defineProperty(_AMOUNT_PROPERTIES_BY, dataTypes.CROSS_OBJECT, [].concat(_toConsumableArray(DEAL_AMOUNT_PROPERTIES.map(function (property) {
  return namespaceProperty(dataTypes.DEALS, property);
})), _toConsumableArray(LINE_ITEM_AMOUNT_PROPERTIES.map(function (property) {
  return namespaceProperty(dataTypes.LINE_ITEMS, property);
})))), _AMOUNT_PROPERTIES_BY);
export var AMOUNT_PROPERTIES = Object.values(AMOUNT_PROPERTIES_BY_DATA_TYPE).reduce(function (acc, arr) {
  return [].concat(_toConsumableArray(acc), _toConsumableArray(arr));
}, []);
export var CURRENCY_CODE_BY_DATA_TYPE = (_CURRENCY_CODE_BY_DAT = {}, _defineProperty(_CURRENCY_CODE_BY_DAT, dataTypes.DEALS, DEAL_CURRENCY_CODE), _defineProperty(_CURRENCY_CODE_BY_DAT, dataTypes.LINE_ITEMS, LINE_ITEM_CURRENCY_CODE), _CURRENCY_CODE_BY_DAT);
export var CURRENCY_PROPERTIES = [DEAL_CURRENCY_CODE, namespaceProperty(dataTypes.DEALS, DEAL_CURRENCY_CODE), LINE_ITEM_CURRENCY_CODE, namespaceProperty(dataTypes.LINE_ITEMS, LINE_ITEM_CURRENCY_CODE)];
export var SINGLE_OBJECT_AMOUNT_IN_HOME_CURRENCY_PROPERTIES = ['amount_in_home_currency', 'projectedAmountInHomeCurrency', 'hs_projected_amount_in_home_currency', 'closedAmountInHomeCurrency', 'hs_closed_amount_in_home_currency', 'deal_amount_in_home_currency', 'deal_projectedAmountInHomeCurrency', 'deal_closedAmountInHomeCurrency'];
export var CROSS_OBJECT_AMOUNT_IN_HOME_CURRENCY_PROPERTIES = SINGLE_OBJECT_AMOUNT_IN_HOME_CURRENCY_PROPERTIES.map(function (property) {
  return namespaceProperty(dataTypes.DEALS, property);
});
export var AMOUNT_IN_HOME_CURRENCY_PROPERTIES = [].concat(SINGLE_OBJECT_AMOUNT_IN_HOME_CURRENCY_PROPERTIES, _toConsumableArray(CROSS_OBJECT_AMOUNT_IN_HOME_CURRENCY_PROPERTIES));