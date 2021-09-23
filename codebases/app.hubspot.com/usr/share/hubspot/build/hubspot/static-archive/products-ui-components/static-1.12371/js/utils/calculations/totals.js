'use es6';

import { TCV, ACV, MRR, ARR, TERM } from 'customer-data-objects/lineItem/PropertyNames';
import { ANNUALLY, MONTHLY } from 'products-ui-components/constants/PriceRates';
import { NOT_APPLICABLE, DEAL_AMOUNT_PREFERENCES, MARGIN_PROPERTIES } from 'products-ui-components/constants/DealAmountOptions';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import toNumber from 'products-ui-components/utils/toNumber';
import { calculateTotalMargin } from 'products-ui-components/utils/calculations/margins';
import { isRecurring, getRecurringLineItemsWithTermLessThanOneYear, getRecurringLineItemsWithHighestTerm } from 'products-ui-components/utils/recurrence';
import { calculateSubtotal } from 'products-ui-components/utils/calculations/pricing';
import { calculateRecurringSubtotal } from 'products-ui-components/utils/calculations/recurringPricing';
import { getLargestBillingCycleLength } from 'products-ui-components/utils/approximateBillingCycleLength';
/**
 * Returns HubSpot calculated totals and margins given a list of line items.
 *
 * @param {List} lineItems - The lineItems to calculate totals for.
 * @return {Object} - Returns the calculated totals, margins, and I18n keys when
 *                    returned totals are not applicable.
 */

export function calculateSummaryTotals(lineItems) {
  var recurringLineItems = lineItems.filter(function (lineItem) {
    return isRecurring(lineItem);
  });
  var recurringLineItemWithHighestTerm = getRecurringLineItemsWithHighestTerm(lineItems);
  var defaultTermLength = recurringLineItemWithHighestTerm ? getProperty(recurringLineItemWithHighestTerm, TERM) : null;
  var tcv = calculateSubtotal(lineItems, ANNUALLY, {
    useFullTerm: true,
    defaultTermLength: defaultTermLength
  });
  var tcvMargin = calculateTotalMargin(lineItems, ANNUALLY, {
    useFullTerm: true,
    defaultTermLength: defaultTermLength
  });
  var TCVNotApplicableReason = null;
  var canCalculateARR = recurringLineItems.size > 0;
  var arr = canCalculateARR ? calculateRecurringSubtotal(lineItems, ANNUALLY) : NOT_APPLICABLE;
  var arrMargin = canCalculateARR ? calculateTotalMargin(recurringLineItems, ANNUALLY) : NOT_APPLICABLE;
  var ARRNotApplicableReason = null;
  var canCalculateMRR = recurringLineItems.size > 0 && getRecurringLineItemsWithTermLessThanOneYear(lineItems).size === 0;
  var mrr = canCalculateMRR ? calculateRecurringSubtotal(lineItems, MONTHLY) : NOT_APPLICABLE;
  var mrrMargin = canCalculateMRR ? calculateTotalMargin(recurringLineItems, MONTHLY) : NOT_APPLICABLE;
  var MRRNotApplicableReason = mrr === NOT_APPLICABLE && recurringLineItems.size > 0 ? 'lineItems.priceSummary.MRRNotApplicableTooltip' : null;
  return {
    TCV: tcv,
    TCVMargin: tcvMargin,
    TCVNotApplicableReason: TCVNotApplicableReason,
    ARR: arr,
    ARRMargin: arrMargin,
    ARRNotApplicableReason: ARRNotApplicableReason,
    MRR: mrr,
    MRRMargin: mrrMargin,
    MRRNotApplicableReason: MRRNotApplicableReason
  };
}
export function getCalculatedTotalsFromPreference(dealAmountPreference, lineItems) {
  var totals = calculateSummaryTotals(lineItems);
  var total = totals[dealAmountPreference],
      margin = totals[dealAmountPreference + "Margin"],
      notApplicableReason = totals[dealAmountPreference + "NotApplicableReason"];
  return {
    total: total,
    margin: margin,
    notApplicableReason: notApplicableReason
  };
}
/**
 * Returns whether or not the calculated deal amount using the last saved line
 * items matches the current deal amount value.
 *
 * @param {DealRecord} deal - The deal for which to compare if deal amount has
 *                            been manually overwritten.
 * @param {Integer} calculatedDealAmount - The deal amount preference calculated from line items
 * @return {Boolean} - Returns true when the current deal amount has a mismatch
 *                     with the calculated deal amount (eg. user manually updated)
 *                     dealAmount. False otherwise.
 */

export function hasMismatchedDealAmount(deal, calculatedDealAmount) {
  var dealAmount = toNumber(getProperty(deal, 'amount')) || 0;
  return dealAmount !== calculatedDealAmount;
}

function calculateLegacyTotals(lineItems) {
  var largestBillingCycleLength = getLargestBillingCycleLength(lineItems);
  return {
    total: calculateSubtotal(lineItems, largestBillingCycleLength),
    margin: calculateTotalMargin(lineItems, largestBillingCycleLength)
  };
}
/**
 * Returns the total and margin for the selected preference type
 *  *
 * @param {List} lineItems - The lineItems for which to calculate total and margin
 * @param {Integer} type - The deal amount preference which has been selected as a portal wide
 *                         setting.
 * @return {Object} - Returns the total and margin for the line items based on the
 *                    deal amount preference specified in type.
 */


export function calculateDealAmountByPreference(lineItems, type) {
  switch (type) {
    case DEAL_AMOUNT_PREFERENCES[TCV]:
    case DEAL_AMOUNT_PREFERENCES[ACV]:
    case DEAL_AMOUNT_PREFERENCES[ARR]:
    case DEAL_AMOUNT_PREFERENCES[MRR]:
      {
        var total = lineItems.reduce(function (acc, lineItem) {
          return acc + toNumber(getProperty(lineItem, type));
        }, 0);
        var margin = lineItems.reduce(function (acc, lineItem) {
          return acc + toNumber(getProperty(lineItem, MARGIN_PROPERTIES[type]));
        }, 0);
        return {
          total: total,
          margin: margin
        };
      }

    case DEAL_AMOUNT_PREFERENCES['legacy']:
      return calculateLegacyTotals(lineItems);

    default:
      return {};
  }
}