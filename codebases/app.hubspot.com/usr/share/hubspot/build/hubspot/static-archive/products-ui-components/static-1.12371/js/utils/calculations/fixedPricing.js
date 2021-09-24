'use es6';

import { isRecurring } from 'products-ui-components/utils/recurrence';
import getLineItemProperties from 'products-ui-components/utils/properties/getLineItemProperties';
import { getDiscountType, getSelectedDiscountValue, calculateBaseDiscountedLineItemPrice, calculateLineItemDiscount } from 'products-ui-components/utils/calculations/discounts'; // ****************************
// * Single Billed Line Items *
// ***************************

export var calculateFixedLineItemPrice = function calculateFixedLineItemPrice(lineItem) {
  if (isRecurring(lineItem)) {
    return 0;
  }

  var _getLineItemPropertie = getLineItemProperties(lineItem),
      price = _getLineItemPropertie.price;

  return price;
};
export var calculateFixedDiscountedLineItemPrice = function calculateFixedDiscountedLineItemPrice(lineItem) {
  if (isRecurring(lineItem)) {
    return 0;
  }

  var _getLineItemPropertie2 = getLineItemProperties(lineItem),
      discount = _getLineItemPropertie2.discount,
      discountPercentage = _getLineItemPropertie2.discountPercentage,
      price = _getLineItemPropertie2.price,
      quantity = _getLineItemPropertie2.quantity;

  var discountType = getDiscountType(discount, discountPercentage);
  var discountValue = getSelectedDiscountValue(discount, discountPercentage, discountType);
  var fixedDiscountedLineItemPrice = calculateBaseDiscountedLineItemPrice(quantity, price, discountValue, discountType);
  return fixedDiscountedLineItemPrice;
};
/**
 * Returns the total value of all discounts for single billed (fixed price) line items.
 * This includes fixed and percentage discounts.
 *
 * @param {List} lineItems - The lineItems for which to calculate total discount
 * @return {number} The total value of all discounts for single billed line items.
 */

export var calculateTotalSingleBilledDiscount = function calculateTotalSingleBilledDiscount(lineItems) {
  return lineItems.reduce(function (subtotal, lineItem) {
    if (isRecurring(lineItem)) {
      return subtotal;
    }

    var lineItemDiscount = calculateLineItemDiscount(lineItem);
    return subtotal + lineItemDiscount;
  }, 0);
};
/**
 * Returns the total price of all single billed (fixed price) line items.
 * Total calculated price does not include costs (to the HubSpot
 * customer) of these line items.
 *
 * @param {List} lineItems - The lineItems for which to calculate total price
 * @return {number} The total discounted price of all single billed line items.
 */

export var calculateFixedSubtotal = function calculateFixedSubtotal(lineItems) {
  return lineItems.reduce(function (subtotal, lineItem) {
    if (isRecurring(lineItem)) {
      return subtotal;
    }

    return subtotal + calculateFixedDiscountedLineItemPrice(lineItem);
  }, 0);
};