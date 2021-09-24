'use es6';

import { Map as ImmutableMap } from 'immutable';
import User from 'hub-http-shims/UserDataJS/user';
import { CONTACTS, CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import { get, send } from 'crm_data/api/ImmutableAPI';
import { del } from 'crm_data/inboundDB/sharedAPI';
import { getId } from 'customer-data-objects/model/ImmutableModel';
import { PUT, POST } from 'crm_data/constants/HTTPVerbs';
import { byIdsStr } from './DealsAPIQuery';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import { EMPTY } from 'crm_data/flux/LoadingStatus';
var contactsCrmUiSourceHeaders = {
  'X-Properties-Source': CONTACTS,
  'X-Properties-SourceId': CRM_UI
};
var BASE_URI = 'deals/v1/deal';
var BATCH_URI = BASE_URI + "/batch";

var toUri = function toUri(queryStr) {
  return BATCH_URI + "?" + queryStr;
};

export function createDeal(payload) {
  return send({
    headers: contactsCrmUiSourceHeaders,
    type: POST
  }, BASE_URI, payload, function (result) {
    return ImmutableMap().set(result.dealId, DealRecord.fromJS(result));
  });
}
export function createDealWithAssociations(_ref) {
  var propertyValues = _ref.propertyValues,
      requestedAssociatedObjects = _ref.requestedAssociatedObjects;
  return send({
    headers: contactsCrmUiSourceHeaders,
    type: POST
  }, 'inbounddb-objects/v1/create-and-bulk-associate', {
    createObjectType: DEAL,
    propertyValues: propertyValues,
    requestedAssociatedObjects: requestedAssociatedObjects
  }, function (result) {
    result['dealId'] = result.objectId;
    return ImmutableMap().set(result.dealId, DealRecord.fromJS(result));
  });
}
export function deleteDeal(dealId) {
  return del(BASE_URI + "/" + dealId);
}

var parseDeals = function parseDeals(result) {
  return result.reduce(function (coll, val) {
    var deal = DealRecord.fromJS(val);
    var dealId = getId(deal);
    return coll.set(String(dealId), deal);
  }, ImmutableMap());
};

export function fetchById(id) {
  return get(BASE_URI + "/" + id).then(function (deal) {
    return DealRecord.fromJS(deal);
  }).catch(function (err) {
    if (err.status === 404) {
      return EMPTY;
    }

    throw err;
  });
}
export function fetch(ids) {
  return get(toUri(byIdsStr(ids))).then(parseDeals);
}
export function updateDealProperties(deal, propertyUpdates) {
  var dealId = deal.get('dealId');
  return send({
    headers: contactsCrmUiSourceHeaders,
    type: PUT
  }, BASE_URI + "/" + dealId, {
    dealId: dealId,
    properties: propertyUpdates.reduce(function (acc, value, name) {
      acc.push({
        name: name,
        value: value,
        source: CRM_UI,
        sourceId: User.get().get('email')
      });
      return acc;
    }, [])
  }, DealRecord.fromJS);
}