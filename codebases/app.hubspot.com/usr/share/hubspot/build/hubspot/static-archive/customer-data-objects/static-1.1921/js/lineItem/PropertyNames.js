'use es6';

export var AMOUNT = 'amount';
export var CREATE_DATE = 'createdate';
export var DESCRIPTION = 'description';
export var DISCOUNT = 'discount';
export var DISCOUNT_PERCENTAGE = 'hs_discount_percentage';
export var LINE_ITEM_CURRENCY_CODE = 'hs_line_item_currency_code';
export var NAME = 'name';
export var ORDER = 'hs_position_on_quote';
export var PRODUCT_ID = 'hs_product_id';
export var PRICE = 'price';
export var QUANTITY = 'quantity';
export var RECURRING_BILLING_FREQUENCY = 'recurringbillingfrequency';
export var SKU = 'hs_sku';
export var START_DATE = 'hs_recurring_billing_start_date';
export var TAX = 'tax';
export var TERM = 'hs_recurring_billing_period';
export var TERM_IN_MONTHS = 'hs_term_in_months';
export var UNIT_COST = 'hs_cost_of_goods_sold';
export var MARGIN = 'hs_margin';
export var TCV = 'hs_tcv';
export var ACV = 'hs_acv';
export var ARR = 'hs_arr';
export var MRR = 'hs_mrr';
export var TCV_MARGIN = 'hs_margin_tcv';
export var ACV_MARGIN = 'hs_margin_acv';
export var ARR_MARGIN = 'hs_margin_arr';
export var MRR_MARGIN = 'hs_margin_mrr';
export var PRE_DISCOUNT_AMOUNT = 'hs_pre_discount_amount';
export var TOTAL_DISCOUNT = 'hs_total_discount';
export var currencyPricePrefix = 'hs_price_';
export var isCurrencyPriceProperty = function isCurrencyPriceProperty(propertyName) {
  return propertyName.indexOf(currencyPricePrefix) === 0;
};
export var getCurrencyCodeForPriceProperty = function getCurrencyCodeForPriceProperty(propertyName) {
  var currencyCode = propertyName.split(currencyPricePrefix)[1];
  return currencyCode ? currencyCode.toUpperCase() : null;
};
export var getCurrencyPriceProperty = function getCurrencyPriceProperty(currencyCode) {
  return "" + currencyPricePrefix + currencyCode.toLowerCase();
}; // TODO: Add Shopify prop names here