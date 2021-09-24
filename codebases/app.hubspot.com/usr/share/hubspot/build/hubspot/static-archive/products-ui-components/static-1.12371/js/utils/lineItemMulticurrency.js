'use es6';

import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { LINE_ITEM_CURRENCY_CODE, PRICE, getCurrencyPriceProperty } from 'customer-data-objects/lineItem/PropertyNames';
import LineItemRecord from 'customer-data-objects/lineItem/LineItemRecord';
import getLineItemProperties from 'products-ui-components/utils/properties/getLineItemProperties';
import toNumber from 'products-ui-components/utils/toNumber';
export var dealHasMismatchedLineItemCurrency = function dealHasMismatchedLineItemCurrency(effectiveCurrencyCode, lineItem) {
  var lineItemCurrencyCode = getProperty(lineItem, LINE_ITEM_CURRENCY_CODE);
  return lineItemCurrencyCode && lineItemCurrencyCode !== effectiveCurrencyCode;
};
export var dealHasMismatchedLineItemCurrencies = function dealHasMismatchedLineItemCurrencies(effectiveCurrencyCode, lineItems) {
  return lineItems.some(function (lineItem) {
    return dealHasMismatchedLineItemCurrency(effectiveCurrencyCode, lineItem);
  });
};
export var getPrimaryPriceProperty = function getPrimaryPriceProperty(_ref) {
  var subject = _ref.subject,
      currencyCode = _ref.currencyCode,
      _ref$isMultiCurrencyA = _ref.isMultiCurrencyActive,
      isMultiCurrencyActive = _ref$isMultiCurrencyA === void 0 ? false : _ref$isMultiCurrencyA;
  return subject instanceof LineItemRecord || !isMultiCurrencyActive ? PRICE : getCurrencyPriceProperty(currencyCode);
};
/**
 * Returns the value for the primary price property of a product or line item
 * For line items and non-HubSpot (Ecomm) products, the primary price property
 * is `price`. Also, if multicurrency is inactive, the primary price property
 * is `price`.
 * If multicurrency is active, and `subject` is a HubSpot product, the primary
 * price property should be the price property for the passed-in currency code.
 *
 * @param {ProductRecord|LineItemRecord} subject - The product or line item record
 *                                                 whose price value to get
 * @param {string} currencyCode - The currency code for which to get the subject's
 *                                price property, but only if it's a HubSpot product
 *                                and multicurrency is active on the portal.
 * @param {Boolean} isMultiCurrencyActive - Whether multicurrency is active on portal
 *                                          (not relevant for line items)
 * @return {number} - Returns the value of the correct price property, or `undefined`
 *                    if the product does not have a value for the correct currency
 *                    price property.
 */

export var getPrimaryPrice = function getPrimaryPrice(subject, currencyCode) {
  var isMultiCurrencyActive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var priceProperty = getPrimaryPriceProperty({
    subject: subject,
    currencyCode: currencyCode,
    isMultiCurrencyActive: isMultiCurrencyActive
  });
  return toNumber(getLineItemProperties(subject, priceProperty));
};