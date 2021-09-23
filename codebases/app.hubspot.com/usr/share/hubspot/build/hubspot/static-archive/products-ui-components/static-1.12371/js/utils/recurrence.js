'use es6';

import getLineItemProperties from 'products-ui-components/utils/properties/getLineItemProperties';
import { PriceRateNames } from 'products-ui-components/constants/PriceRates';
import { getTermHasLength, getMonthsPerTerm } from 'products-ui-components/utils/calculations/terms';
export function isRecurring(lineItem) {
  var _getLineItemPropertie = getLineItemProperties(lineItem),
      recurringBillingFrequency = _getLineItemPropertie.recurringBillingFrequency;

  return PriceRateNames.includes(recurringBillingFrequency);
}
export function hasAtLeastOneFixed(lineItems) {
  return lineItems.some(function (lineItem) {
    return !isRecurring(lineItem);
  });
}
export function hasAtLeastOneRecurring(lineItems) {
  return lineItems.some(function (lineItem) {
    return isRecurring(lineItem);
  });
}
export function getRecurringLineItemsWithTerm(lineItems) {
  return lineItems.filter(function (lineItem) {
    var _getLineItemPropertie2 = getLineItemProperties(lineItem),
        term = _getLineItemPropertie2.term;

    return isRecurring(lineItem) && getTermHasLength(term);
  });
}
export function getRecurringLineItemsWithTermLessThanOneYear(lineItems) {
  return lineItems.filter(function (lineItem) {
    var _getLineItemPropertie3 = getLineItemProperties(lineItem),
        term = _getLineItemPropertie3.term;

    return isRecurring(lineItem) && getTermHasLength(term) && getMonthsPerTerm(term) < 12;
  });
}
export function getRecurringLineItemsWithHighestTerm(lineItems) {
  return getRecurringLineItemsWithTerm(lineItems).maxBy(function (lineItem) {
    var _getLineItemPropertie4 = getLineItemProperties(lineItem),
        term = _getLineItemPropertie4.term;

    return getMonthsPerTerm(term);
  });
}