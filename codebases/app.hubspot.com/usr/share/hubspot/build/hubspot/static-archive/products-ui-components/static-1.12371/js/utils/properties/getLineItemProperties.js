'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _propertyGetters, _propertyShortcuts;

import memoize from 'transmute/memoize';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import toNumber from 'products-ui-components/utils/toNumber';
import { getPriceProperty } from 'products-ui-components/utils/properties/integrations';
import { NAME, CREATE_DATE, DESCRIPTION, DISCOUNT, DISCOUNT_PERCENTAGE, QUANTITY, RECURRING_BILLING_FREQUENCY, SKU, START_DATE, TERM, PRICE, UNIT_COST, LINE_ITEM_CURRENCY_CODE, ORDER, PRODUCT_ID } from 'customer-data-objects/lineItem/PropertyNames';
var propertyGetters = (_propertyGetters = {}, _defineProperty(_propertyGetters, NAME, function (lineItem) {
  return getProperty(lineItem, NAME);
}), _defineProperty(_propertyGetters, CREATE_DATE, function (lineItem) {
  return getProperty(lineItem, CREATE_DATE);
}), _defineProperty(_propertyGetters, DESCRIPTION, function (lineItem) {
  return getProperty(lineItem, DESCRIPTION);
}), _defineProperty(_propertyGetters, QUANTITY, function (lineItem) {
  return toNumber(getProperty(lineItem, QUANTITY));
}), _defineProperty(_propertyGetters, PRICE, function (lineItem) {
  return toNumber(getProperty(lineItem, getPriceProperty(lineItem)));
}), _defineProperty(_propertyGetters, DISCOUNT, function (lineItem) {
  return toNumber(getProperty(lineItem, DISCOUNT));
}), _defineProperty(_propertyGetters, DISCOUNT_PERCENTAGE, function (lineItem) {
  return toNumber(getProperty(lineItem, DISCOUNT_PERCENTAGE));
}), _defineProperty(_propertyGetters, UNIT_COST, function (lineItem) {
  return toNumber(getProperty(lineItem, UNIT_COST));
}), _defineProperty(_propertyGetters, PRODUCT_ID, function (lineItem) {
  return getProperty(lineItem, PRODUCT_ID);
}), _defineProperty(_propertyGetters, RECURRING_BILLING_FREQUENCY, function (lineItem) {
  return getProperty(lineItem, RECURRING_BILLING_FREQUENCY);
}), _defineProperty(_propertyGetters, SKU, function (lineItem) {
  return getProperty(lineItem, SKU);
}), _defineProperty(_propertyGetters, TERM, function (lineItem) {
  return getProperty(lineItem, TERM);
}), _defineProperty(_propertyGetters, START_DATE, function (lineItem) {
  return toNumber(getProperty(lineItem, START_DATE));
}), _defineProperty(_propertyGetters, LINE_ITEM_CURRENCY_CODE, function (lineItem) {
  return getProperty(lineItem, LINE_ITEM_CURRENCY_CODE);
}), _defineProperty(_propertyGetters, ORDER, function (lineItem) {
  return toNumber(getProperty(lineItem, ORDER));
}), _propertyGetters);
var propertyShortcuts = (_propertyShortcuts = {}, _defineProperty(_propertyShortcuts, NAME, 'name'), _defineProperty(_propertyShortcuts, CREATE_DATE, 'createDate'), _defineProperty(_propertyShortcuts, DESCRIPTION, 'description'), _defineProperty(_propertyShortcuts, QUANTITY, 'quantity'), _defineProperty(_propertyShortcuts, PRICE, 'price'), _defineProperty(_propertyShortcuts, DISCOUNT, 'discount'), _defineProperty(_propertyShortcuts, DISCOUNT_PERCENTAGE, 'discountPercentage'), _defineProperty(_propertyShortcuts, UNIT_COST, 'unitCost'), _defineProperty(_propertyShortcuts, PRODUCT_ID, 'productId'), _defineProperty(_propertyShortcuts, RECURRING_BILLING_FREQUENCY, 'recurringBillingFrequency'), _defineProperty(_propertyShortcuts, SKU, 'sku'), _defineProperty(_propertyShortcuts, TERM, 'term'), _defineProperty(_propertyShortcuts, START_DATE, 'startDate'), _defineProperty(_propertyShortcuts, LINE_ITEM_CURRENCY_CODE, 'lineItemCurrencyCode'), _defineProperty(_propertyShortcuts, ORDER, 'order'), _propertyShortcuts);
var allProperties = Object.keys(propertyShortcuts);
export default memoize(function (lineItem) {
  for (var _len = arguments.length, properties = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    properties[_key - 1] = arguments[_key];
  }

  if (properties.length === 0) {
    properties = allProperties;
  }

  if (properties.length === 1) {
    if (propertyGetters[properties[0]]) {
      return propertyGetters[properties[0]](lineItem);
    }

    return getProperty(lineItem, properties[0]);
  }

  return properties.reduce(function (acc, property) {
    return propertyGetters[property] ? Object.assign({}, acc, _defineProperty({}, propertyShortcuts[property], propertyGetters[property](lineItem))) : Object.assign({}, acc, _defineProperty({}, property, getProperty(lineItem, property)));
  }, {});
});