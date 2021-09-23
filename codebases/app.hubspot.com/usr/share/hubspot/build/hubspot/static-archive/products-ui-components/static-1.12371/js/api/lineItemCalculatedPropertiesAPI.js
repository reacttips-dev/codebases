'use es6';

import promiseClient from 'hub-http/adapters/promiseClient';
import { createStack } from 'hub-http';
import * as core from 'hub-http/middlewares/core';
import * as hubapi from 'hub-http/middlewares/hubapi';
import * as externalAuth from 'hub-http/middlewares/externalAuth';
import * as debug from 'hub-http/middlewares/debug';
import { Map as ImmutableMap, List } from 'immutable';
import getLineItemProperties from 'products-ui-components/utils/properties/getLineItemProperties';
import { LINE_ITEM_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { OEM_CALCULATION_PROPERTY_NAMES } from 'products-ui-components/utils/properties/table';
import { PRICE, DISCOUNT, QUANTITY, TERM, RECURRING_BILLING_FREQUENCY, UNIT_COST, DISCOUNT_PERCENTAGE, LINE_ITEM_CURRENCY_CODE } from 'customer-data-objects/lineItem/PropertyNames';
import { getId } from 'customer-data-objects/protocol/Identifiable';
var retryerClient = promiseClient(createStack(core.services, hubapi.defaults, debug.allowTimeoutOverride, core.jsonBody, core.httpsOnly, hubapi.hubapi, externalAuth.cookieAuthentication, core.withQuery, debug.rewriteUrl, hubapi.timeoutInQuery, hubapi.setRequest, core.reportOptionsError, hubapi.logoutOnUnauthorized, core.retry(function (response) {
  return response.status >= 500 || response.status === 0 && response.errorCode === 'NETWORKERROR';
}, {
  reason: 'retrying fetching calculated property previews',
  maxRetries: 1000
}), core.validateStatus, core.jsonResponse));
var BATCH_CALCULATION_PREVIEW_ENDPOINT = 'inbounddb-objects/v1/calculation-preview/calculated-properties/batch';
/**
 * @param {array} response - array of objects containing calculationOutputs lists
 * @param {List<LineItemRecord>} lineItems - List of line items in the same order as responses
 * @returns {Map} Map of Lists of PropertyValueRecord objects (name, value)
 */

export function parseCalculatedPropertyValuesResponse(response) {
  var lineItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : List();

  if (!response || !response.map || lineItems.isEmpty()) {
    return ImmutableMap();
  }

  return ImmutableMap(response.map(function (outputs, index) {
    return [getId(lineItems.get(index)), List(outputs.calculationOutputs)];
  }));
}
export function getCalculatedPropertyValues() {
  var lineItems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  var data = lineItems.map(function (lineItem) {
    var _getLineItemPropertie = getLineItemProperties(lineItem),
        price = _getLineItemPropertie.price,
        discount = _getLineItemPropertie.discount,
        discountPercentage = _getLineItemPropertie.discountPercentage,
        quantity = _getLineItemPropertie.quantity,
        term = _getLineItemPropertie.term,
        recurringBillingFrequency = _getLineItemPropertie.recurringBillingFrequency,
        unitCost = _getLineItemPropertie.unitCost,
        lineItemCurrencyCode = _getLineItemPropertie.lineItemCurrencyCode;

    return {
      objectTypeId: LINE_ITEM_TYPE_ID,
      calculatedPropertyNames: OEM_CALCULATION_PROPERTY_NAMES,
      inputPropertyValues: [{
        name: DISCOUNT,
        value: discount
      }, {
        name: DISCOUNT_PERCENTAGE,
        value: discountPercentage
      }, {
        name: PRICE,
        value: price
      }, {
        name: QUANTITY,
        value: quantity
      }, {
        name: RECURRING_BILLING_FREQUENCY,
        value: recurringBillingFrequency
      }, {
        name: TERM,
        value: term
      }, {
        name: UNIT_COST,
        value: unitCost
      }, {
        name: LINE_ITEM_CURRENCY_CODE,
        value: lineItemCurrencyCode
      }]
    };
  });
  return retryerClient.post(BATCH_CALCULATION_PREVIEW_ENDPOINT, {
    data: data
  }).then(function (response) {
    return parseCalculatedPropertyValuesResponse(response, List(lineItems));
  });
}