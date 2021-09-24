'use es6';

import { ANNUALLY } from 'products-ui-components/constants/PriceRates';
import { isRecurring } from 'products-ui-components/utils/recurrence';
import { calculateFixedDiscountedLineItemPrice, calculateFixedSubtotal } from 'products-ui-components/utils/calculations/fixedPricing';
import { calculateRecurringDiscountedLineItemPrice, calculateRecurringSubtotal } from 'products-ui-components/utils/calculations/recurringPricing';
import getLineItemProperties from 'products-ui-components/utils/properties/getLineItemProperties';
import { getSelectedDiscountValue, calculateBaseDiscountedLineItemPrice, getDiscountType } from 'products-ui-components/utils/calculations/discounts';
import { QUANTITY } from 'customer-data-objects/lineItem/PropertyNames'; // *********************************************************
// * Price calculations for fixed AND recurring line items *
// *********************************************************

export var calculateDiscountedLineItemPrice = function calculateDiscountedLineItemPrice(lineItem, priceRate, options) {
  return isRecurring(lineItem) ? calculateRecurringDiscountedLineItemPrice(lineItem, priceRate, options) : calculateFixedDiscountedLineItemPrice(lineItem);
};
export var hasNonPositivelyPricedLineItem = function hasNonPositivelyPricedLineItem(lineItems) {
  var calculateLineItemTotalPrice = function calculateLineItemTotalPrice(lineItem) {
    var _getLineItemPropertie = getLineItemProperties(lineItem),
        price = _getLineItemPropertie.price,
        quantity = _getLineItemPropertie.quantity,
        discount = _getLineItemPropertie.discount,
        discountPercentage = _getLineItemPropertie.discountPercentage;

    var discountType = getDiscountType(discount, discountPercentage);
    var discountValue = getSelectedDiscountValue(discount, discountPercentage, discountType);
    return calculateBaseDiscountedLineItemPrice(quantity, price, discountValue, discountType);
  };

  return lineItems.some(function (lineItem) {
    return calculateLineItemTotalPrice(lineItem) <= 0;
  });
};
export var hasZeroQuantityLineItem = function hasZeroQuantityLineItem(lineItems) {
  return !!lineItems.find(function (lineItem) {
    return getLineItemProperties(lineItem, QUANTITY) === 0;
  });
};
/**
 * Returns the total price of all line items, both single and recurring billed,
 * per the specified time period.
 * Total calculated price includes all discounts, both fixed and percentage, but
 * not costs (to the HubSpot customer).
 *
 * @param {List} lineItems - The lineItems for which to calculate total discounted
                             price.
 * @param {string} priceRate - String representation of the period of time per
 *                             which to calculate total discounted price.
 * @return {number} The total, discounted price of all line items, per the period
 *                  of time specified.
 */

export var calculateSubtotal = function calculateSubtotal(lineItems) {
  var priceRate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ANNUALLY;
  var options = arguments.length > 2 ? arguments[2] : undefined;
  return calculateFixedSubtotal(lineItems) + calculateRecurringSubtotal(lineItems, priceRate, options);
};