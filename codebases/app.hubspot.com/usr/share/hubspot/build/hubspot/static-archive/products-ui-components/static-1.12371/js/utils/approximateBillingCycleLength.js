'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { List } from 'immutable';
import { PriceRateNames, PRICE_RATES, ANNUALLY } from 'products-ui-components/constants/PriceRates';
import getLineItemProperties from 'products-ui-components/utils/properties/getLineItemProperties';
import { getMonthsPerRatePeriod } from 'products-ui-components/utils/calculations/recurringPricing';
import { isRecurring } from 'products-ui-components/utils/recurrence';
import { calculateSubtotal } from 'products-ui-components/utils/calculations/pricing';

var getDifferencesByCycleLength = function getDifferencesByCycleLength(dealAmount, lineItemsInDeal) {
  var rateCosts = PriceRateNames.map(function (rate) {
    return calculateSubtotal(lineItemsInDeal, rate);
  });
  return rateCosts.map(function (cost) {
    return Math.abs(dealAmount - cost);
  });
};

var getClosestCycleLength = function getClosestCycleLength(differencesFromDealAmount) {
  // Return index of ANNUALLY if all items are fixed cost
  if (differencesFromDealAmount.every(function (difference) {
    return difference === 0;
  })) {
    return ANNUALLY;
  }

  var smallestDifference = Math.min.apply(Math, _toConsumableArray(differencesFromDealAmount));
  var smallestDifferenceIndex = List(differencesFromDealAmount).findIndex(function (difference) {
    return difference === smallestDifference;
  });
  return PriceRateNames[smallestDifferenceIndex];
};

export var approximateBillingCycleLength = function approximateBillingCycleLength(dealAmount, lineItemsInDeal) {
  /**
   * This function attempts to guess how long the products in a deal
   * were purchased for, given the cost-per-time-period of each product,
   * and the deal amount. This is important as many products are
   * actually services billed for a recurring time period.
   *
   * For example, if the deal amount is $10,000 and it consists of
   * one product which costs $20,000 per two years, we will guess
   * the product was purchased for one year.
   *
   * @param {number} dealAmount - The total dollar amount specified on the deal.
   * @param {List} lineItemsInDeal - The line items (products) on the deal.
   * @return {String} The approximated period of time the deal is for.
   */
  if (lineItemsInDeal.size === 0) return ANNUALLY;
  var rateDifferencesFromDealAmount = getDifferencesByCycleLength(dealAmount, lineItemsInDeal);
  return getClosestCycleLength(rateDifferencesFromDealAmount);
};
export function getLargestBillingCycleLength(lineItems) {
  // Returns the highest billing cycle length given a list of line items
  var recurringLineItems = lineItems.filter(isRecurring);

  if (recurringLineItems.isEmpty()) {
    return ANNUALLY;
  }

  var largestBillingPeriod = recurringLineItems.reduce(function (currentMax, lineItem) {
    var _getLineItemPropertie = getLineItemProperties(lineItem),
        recurringBillingFrequency = _getLineItemPropertie.recurringBillingFrequency;

    return Math.max(currentMax, getMonthsPerRatePeriod(recurringBillingFrequency));
  }, 0);
  var rateInfo = PRICE_RATES.find(function (_ref) {
    var months = _ref.months;
    return months === largestBillingPeriod;
  });
  return rateInfo ? rateInfo.value : ANNUALLY;
}