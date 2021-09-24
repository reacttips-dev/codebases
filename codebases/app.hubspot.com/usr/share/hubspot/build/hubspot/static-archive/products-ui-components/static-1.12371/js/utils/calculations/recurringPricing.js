'use es6';

import { Map as ImmutableMap } from 'immutable';
import { isRecurring } from 'products-ui-components/utils/recurrence';
import getLineItemProperties from 'products-ui-components/utils/properties/getLineItemProperties';
import { PRICE_RATES, ANNUALLY } from 'products-ui-components/constants/PriceRates';
import { getMonthsPerTerm, getTermHasLength } from 'products-ui-components/utils/calculations/terms';
import { getDiscountType, getSelectedDiscountValue, calculateBaseDiscountedLineItemPrice, calculateLineItemDiscount } from 'products-ui-components/utils/calculations/discounts'; // ******************************
// * Recurring Billed Line Items*
// ******************************

export var getMonthsPerRatePeriod = function getMonthsPerRatePeriod(rate) {
  var rateInfo = PRICE_RATES.find(function (_ref) {
    var value = _ref.value;
    return value === rate;
  });
  return rateInfo ? rateInfo.months : 0;
};
export var calculateProRateFactor = function calculateProRateFactor(lineItem, priceRate) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    useFullTerm: false,
    defaultTermLength: null
  };

  /*
   * If a a line item is billed per-month and its term is 8 months and the deal
   * is set to report revenue anually, the pro rate factor is 8/12 since revenue
   * for the recurring line item is earned only 8 of the 12 possible months.
   *
   * When useFullTerm is true, we account for terms greater than the reporting
   * period length (proration factor can be > 1)
   *
   * When defaultTermLength is provided, recurring products with missing terms
   * will use defaultTermLength instead.
   */
  var _getLineItemPropertie = getLineItemProperties(lineItem),
      term = _getLineItemPropertie.term;

  var termToUse = term || options.defaultTermLength;
  var monthsPerReportPeriod = getMonthsPerRatePeriod(priceRate);

  if (!getTermHasLength(termToUse) || !options.useFullTerm && getMonthsPerTerm(termToUse) >= monthsPerReportPeriod) {
    return 1;
  }

  return getMonthsPerTerm(termToUse) / monthsPerReportPeriod;
};
export var calculateReportPeriodRatio = function calculateReportPeriodRatio(lineItem, dealReportFrequency, options) {
  /*
   * If a line item is billed per-quarter with a term of 8 months, and the
   * customer requests a annual revenue report: This will return a ratio of
   * 12/3 * 8/12.
   */
  var _getLineItemPropertie2 = getLineItemProperties(lineItem),
      recurringLineItemBillingFrequency = _getLineItemPropertie2.recurringBillingFrequency;

  var monthsPerReportPeriod = getMonthsPerRatePeriod(dealReportFrequency);
  var monthsPerItemBillingPeriod = getMonthsPerRatePeriod(recurringLineItemBillingFrequency);
  return monthsPerReportPeriod / monthsPerItemBillingPeriod * calculateProRateFactor(lineItem, dealReportFrequency, options);
}; // Pro-rated line item price over the deal's reporting frequency BEFORE discounts

export var calculateRecurringLineItemPrice = function calculateRecurringLineItemPrice(lineItem, priceRate, options) {
  if (!isRecurring(lineItem)) {
    return 0;
  }

  var _getLineItemPropertie3 = getLineItemProperties(lineItem),
      price = _getLineItemPropertie3.price;

  var ratio = calculateReportPeriodRatio(lineItem, priceRate, options);
  return price * ratio;
}; // Pro-rated line item price over the deal's reporting frequency AFTER discounts

export var calculateRecurringDiscountedLineItemPrice = function calculateRecurringDiscountedLineItemPrice(lineItem, priceRate, options) {
  if (!isRecurring(lineItem)) {
    return 0;
  }

  var _getLineItemPropertie4 = getLineItemProperties(lineItem),
      discount = _getLineItemPropertie4.discount,
      discountPercentage = _getLineItemPropertie4.discountPercentage,
      price = _getLineItemPropertie4.price,
      quantity = _getLineItemPropertie4.quantity;

  var discountType = getDiscountType(discount, discountPercentage);
  var discountValue = getSelectedDiscountValue(discount, discountPercentage, discountType);
  var pricePerItemBillingPeriod = calculateBaseDiscountedLineItemPrice(quantity, price, discountValue, discountType);
  var ratio = calculateReportPeriodRatio(lineItem, priceRate, options);
  return pricePerItemBillingPeriod * ratio;
};
/**
 * Returns the total value of all discounts for recurring billed line items, per
 * the specified time period. This includes fixed and percentage discounts.
 *
 * @param {List} lineItems - The lineItems for which to calculate total discount
 * @param {string} priceRate - String representation of the period of time per
 *                             which to calculate total discount.
 * @return {number} The total value of all discounts for recurring billed line items.
 */

export var calculateTotalRecurringDiscount = function calculateTotalRecurringDiscount(lineItems, priceRate, options) {
  return lineItems.reduce(function (subtotal, lineItem) {
    if (!isRecurring(lineItem)) {
      return subtotal;
    }

    var discountPerItemFrequency = calculateLineItemDiscount(lineItem);
    var ratio = calculateReportPeriodRatio(lineItem, priceRate, options);
    var discountPerReportFrequency = ratio * discountPerItemFrequency;
    return subtotal + discountPerReportFrequency;
  }, 0);
};
/**
 * Returns the total price of all recurring billed line items, per the specified
 * time period.
 * Total calculated price does not include costs (to the HubSpot
 * customer) of these line items.
 *
 * @param {List} lineItems - The lineItems for which to calculate total price
 * @param {string} priceRate - String representation of the period of time per
 *                             which to calculate total price.
 * @return {number} The total discounted price of all recurring billed line
 *                  items, per the period of time specified.
 */

export var calculateRecurringSubtotal = function calculateRecurringSubtotal(lineItems) {
  var priceRate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ANNUALLY;
  var options = arguments.length > 2 ? arguments[2] : undefined;
  return lineItems.reduce(function (subtotal, lineItem) {
    return subtotal + calculateRecurringDiscountedLineItemPrice(lineItem, priceRate, options);
  }, 0);
};
export function getAllBilledFrequencies(lineItems) {
  return lineItems.filter(function (lineItem) {
    return isRecurring(lineItem);
  }).map(function (lineItem) {
    var _getLineItemPropertie5 = getLineItemProperties(lineItem),
        recurringBillingFrequency = _getLineItemPropertie5.recurringBillingFrequency;

    return recurringBillingFrequency;
  }).toSet().toList().sortBy(function (frequency) {
    return getMonthsPerRatePeriod(frequency);
  });
}
/**
 * Returns the total discount amount for all recurring billed line items
 * that are billed for a particular frequency.
 * It will filter out passed-in line items that aren't billed for that frequency.
 *
 * @param {List} lineItems - The lineItems for which to calculate total discount
 * @param {string} frequency - The billing frequency of line items whose discounts to total.
 * @return {number} The total discount amount for all line items billed at given frequency.
 */

var getDiscountPerFrequency = function getDiscountPerFrequency(lineItems, frequency) {
  return lineItems.reduce(function (acc, lineItem) {
    var _getLineItemPropertie6 = getLineItemProperties(lineItem),
        recurringBillingFrequency = _getLineItemPropertie6.recurringBillingFrequency;

    if (recurringBillingFrequency === frequency) {
      return acc + calculateLineItemDiscount(lineItem);
    }

    return acc;
  }, 0);
};
/**
 * Returns the total discounted price amount for all recurring billed line items
 * that are billed for a particular frequency.
 * It will filter out passed-in line items that aren't billed for that frequency.
 *
 * @param {List} lineItems - The lineItems for which to calculate total discounted price
 * @param {string} frequency - The billing frequency of line items whose prices to total.
 * @return {number} The total discounted price amount for all line items billed at given frequency.
 */


var getSubtotalPerFrequency = function getSubtotalPerFrequency(lineItems, frequency) {
  return lineItems.reduce(function (acc, lineItem) {
    var _getLineItemPropertie7 = getLineItemProperties(lineItem),
        recurringBillingFrequency = _getLineItemPropertie7.recurringBillingFrequency;

    if (recurringBillingFrequency === frequency) {
      return acc + calculateRecurringDiscountedLineItemPrice(lineItem, frequency);
    }

    return acc;
  }, 0);
};
/**
 * Returns the total discounted price amount, and discount, for all recurring billed line
 * items, grouped by frequency.
 *
 * @param {List} lineItems - The lineItems for which to calculate total discounted price and discount.
 * @return {List(Map)} - A List of Maps for each frequency that line items are billed for.
                         Maps reference the frequency, total discount, and total discounted
                         price of all line items billed for that frequency.
 */


export var getTotalsPerFrequency = function getTotalsPerFrequency(lineItems) {
  return getAllBilledFrequencies(lineItems).map(function (frequency) {
    return new ImmutableMap({
      frequency: frequency,
      discount: getDiscountPerFrequency(lineItems, frequency),
      subtotal: getSubtotalPerFrequency(lineItems, frequency)
    });
  });
};