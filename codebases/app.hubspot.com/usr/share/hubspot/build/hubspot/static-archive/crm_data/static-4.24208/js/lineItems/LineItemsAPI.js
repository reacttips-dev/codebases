'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap, List } from 'immutable';
import User from 'hub-http-shims/UserDataJS/user';
import { get, send } from 'crm_data/api/ImmutableAPI';
import { createObject } from '../utils/lineItems';
import LineItemRecord from 'customer-data-objects/lineItem/LineItemRecord';
import { POST, DELETE, PUT } from 'crm_data/constants/HTTPVerbs';
import { getId } from 'customer-data-objects/model/ImmutableModel';
import { CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import { QUOTE, DEAL } from 'customer-data-objects/constants/ObjectTypes';
import { catchAndRethrowNetworkError } from 'crm_data/quotes/monitoring/errorUtils';
var baseUrl = 'line-items/v1/line-items';
var batchUrl = baseUrl + "/batch";

var headers = function headers() {
  return {
    'X-Properties-Source': CRM_UI,
    'X-Properties-SourceId': User.get().get('email')
  };
};

export var reviver = function reviver(response) {
  return ImmutableMap(response).map(LineItemRecord.fromJS);
};
export function batchFetch(lineItemIds) {
  var lineItemsToFetch = lineItemIds.filterNot(function (lineItemId) {
    return typeof lineItemId === 'string' && lineItemId.includes('line-item-temp-id-');
  }).toArray();
  return get(batchUrl, {
    id: lineItemsToFetch,
    includeAllValues: true
  }, reviver).catch(catchAndRethrowNetworkError);
}
export function create(lineItems, associatedObjectId, associatedObjectType) {
  if (lineItems.isEmpty()) {
    return Promise.resolve(List());
  }

  var skipSourceValidation = true;
  var body = lineItems.map(function (lineItem) {
    var associationKey;

    switch (associatedObjectType) {
      case DEAL:
        associationKey = 'LINE_ITEM_TO_DEAL';
        break;

      case QUOTE:
        associationKey = 'LINE_ITEM_TO_QUOTE';
        break;

      default:
        associationKey = null;
    }

    var hasAssociations = associationKey && associatedObjectId;
    var associations = hasAssociations ? _defineProperty({}, associationKey, [associatedObjectId]) : {};
    return {
      object: createObject(lineItem, skipSourceValidation),
      associations: associations
    };
  }).toArray();
  return send({
    headers: headers(),
    type: POST
  }, baseUrl + "/create-without-product-properties-copier/batch", body).then(function (res) {
    return res.map(LineItemRecord.fromJS);
  }).catch(catchAndRethrowNetworkError);
}
export function update(lineItems) {
  if (lineItems.isEmpty()) {
    return Promise.resolve(List());
  }

  var body = lineItems.map(function (lineItem) {
    return Object.assign({
      lineItemId: getId(lineItem)
    }, createObject(lineItem));
  }).toArray();
  return send({
    headers: headers(),
    type: PUT
  }, batchUrl, body).then(function (res) {
    return res.map(LineItemRecord.fromJS);
  }).catch(catchAndRethrowNetworkError);
}
export function remove(lineItemIds) {
  if (lineItemIds.isEmpty()) {
    return Promise.resolve(List());
  }

  return send({
    type: DELETE,
    query: {
      id: lineItemIds.toArray()
    }
  }, batchUrl + "/").catch(catchAndRethrowNetworkError);
}