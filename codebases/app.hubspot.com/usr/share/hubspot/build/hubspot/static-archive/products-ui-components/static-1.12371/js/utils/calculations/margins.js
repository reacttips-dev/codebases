'use es6';

import { ANNUALLY } from 'products-ui-components/constants/PriceRates';
import { isRecurring } from 'products-ui-components/utils/recurrence';
import getLineItemProperties from 'products-ui-components/utils/properties/getLineItemProperties';
import { calculateReportPeriodRatio } from 'products-ui-components/utils/calculations/recurringPricing';
import { calculateDiscountedLineItemPrice } from 'products-ui-components/utils/calculations/pricing'; // *****************************
// * HubSpot Customer Margin $$ *
// *****************************

/**
 * Returns the cost to the HubSpot customer for a single line item over the
 * specified time period
 *
 * @param {LineItemRecord} lineItem - The lineItem for which to calculate cost
 * @param {string} priceRate - String representation of the period of time per
 *                             which to calculate total cost.
 * @return {number} The total cost for the given line item during the specified
 * time period.
 */

var calculateLineItemCost = function calculateLineItemCost(lineItem, priceRate, options) {
  var _getLineItemPropertie = getLineItemProperties(lineItem),
      quantity = _getLineItemPropertie.quantity,
      unitCost = _getLineItemPropertie.unitCost;

  var cost = unitCost || 0;

  if (!isRecurring(lineItem)) {
    return quantity * cost;
  }

  var costPerItemBillingPeriod = cost * quantity;
  var ratio = calculateReportPeriodRatio(lineItem, priceRate, options);
  var costPerReportBillingPeriod = costPerItemBillingPeriod * ratio;
  return costPerReportBillingPeriod;
};
/**
 * Base product cost margin calculation for other utilities
 *
 * @param {number} quantity - The number of units.
 * @param {number} unitCost - The cost per unit to seller.
 * @param {number} price - The total price of all units to buyer.
 *
 * @return {number} The margin of the given line item.
 */


export var calculateMargin = function calculateMargin() {
  var price = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var unitCost = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var quantity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return price - quantity * unitCost;
};
/**
 * Returns the line item's margin
 *
 * @param {number} lineItem - The line item to calculate margin
 * @param {number} priceRate - String representation of the period of time per
 *                             which to calculate total margin.
 *
 * @return {number} The line item's margin.
 */

export var calculateLineItemMargin = function calculateLineItemMargin(lineItem, priceRate, options) {
  var lineItemPrice = calculateDiscountedLineItemPrice(lineItem, priceRate, options);
  var lineItemCost = calculateLineItemCost(lineItem, priceRate, options);
  var lineItemMargin = lineItemPrice - lineItemCost;
  return lineItemMargin;
};
/**
 * Returns the total margin of all line items, both single and recurring billed,
 * per the specified time period.
 * Total margin is calculated by subtracting the cost (to the HubSpot customer)
 * of each line item from its discounted price.
 *
 * For recurring billed line items, the price and cost are calculated per the
 * specified time period: base cost is multiplied by the number of times the price
 * rate fits into the specified billing period.
 *
 * @param {List} lineItems - The lineItems for which to calculate total margin.
 * @param {string} priceRate - String representation of the period of time per
 *                             which to calculate total margin.
 * @return {number} The total margin of all line items.
 */

export var calculateTotalMargin = function calculateTotalMargin(lineItems) {
  var priceRate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ANNUALLY;
  var options = arguments.length > 2 ? arguments[2] : undefined;
  return lineItems.reduce(function (subtotal, lineItem) {
    return calculateLineItemMargin(lineItem, priceRate, options) + subtotal;
  }, 0);
};