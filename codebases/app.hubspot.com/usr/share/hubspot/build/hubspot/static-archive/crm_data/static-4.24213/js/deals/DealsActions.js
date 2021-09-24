'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Map as ImmutableMap, List, fromJS, Set as ImmutableSet } from 'immutable';
import always from 'transmute/always';
import ifElse from 'transmute/ifElse';
import invariant from 'react-utils/invariant';
import PortalIdParser from 'PortalIdParser';
import { DEALS_REFRESH_QUEUED, DEALS_UPDATED, DEALS_UPDATE_FAILED, DEALS_UPDATE_STARTED, DEALS_UPDATE_SUCCEEDED, DEAL_CREATED, DEAL_PIPELINE_SEARCH_RESULT_EXPIRED, DEAL_STAGE_CHANGE, REVERT_DEAL_STAGE_MOVE, ASSOCIATIONS_REFRESH_QUEUED, OBJECT_ASSOCIATION_SUCCEEDED } from 'crm_data/actions/ActionTypes';
import { dispatchImmediate, dispatchQueue } from 'crm_data/dispatch/Dispatch';
import * as DealsAPI from 'crm_data/deals/api/DealsAPI';
import { getId, getProperty } from 'customer-data-objects/model/ImmutableModel';
import { DEAL_TO_COMPANY, DEAL_TO_CONTACT, DEAL_TO_LINE_ITEM, DEAL_TO_QUOTE, DEAL_TO_TICKET } from 'crm_data/associations/AssociationTypes';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import * as ImmutableModel from 'customer-data-objects/model/ImmutableModel';
var PROPS = 'properties';
var ASSOC_COMPANY_ID = 'associatedcompanyid';
var ASSOC_CONTACT_ID = 'associatedcontactid';
var emptyArray = always([]);

var toIdArray = function toIdArray() {
  for (var _len = arguments.length, ids = new Array(_len), _key = 0; _key < _len; _key++) {
    ids[_key] = arguments[_key];
  }

  return ids;
};

var toId = function toId(dealRecord, prop) {
  return parseInt(getProperty(dealRecord, prop), 10);
};

var toAssociatedIds = function toAssociatedIds(dealRecord, prop) {
  return ifElse(isNaN, emptyArray, toIdArray, toId(dealRecord, prop));
};

var toProperties = function toProperties(dealRecord) {
  return dealRecord.get(PROPS).reduce(function (list, _ref, name) {
    var value = _ref.value,
        sourceId = _ref.sourceId,
        source = _ref.source;
    if (name === ASSOC_CONTACT_ID || name === ASSOC_COMPANY_ID) return list;
    return list.push({
      value: value,
      name: name,
      sourceId: sourceId,
      source: source
    });
  }, List());
};

var getCreateDealPayload = function getCreateDealPayload(dealRecord) {
  var portalId = PortalIdParser.get();
  var associatedCompanyIds = toAssociatedIds(dealRecord, ASSOC_COMPANY_ID);
  var associatedVids = toAssociatedIds(dealRecord, ASSOC_CONTACT_ID);

  if (dealRecord.hasIn(['associations', 'associatedVids'])) {
    associatedVids = [].concat(_toConsumableArray(associatedVids), _toConsumableArray(dealRecord.getIn(['associations', 'associatedVids']).toJS()));
  }

  var associations = {
    associatedCompanyIds: associatedCompanyIds,
    associatedVids: associatedVids
  };
  dealRecord = dealRecord.deleteIn([PROPS, ASSOC_COMPANY_ID]).deleteIn([PROPS, ASSOC_CONTACT_ID]);
  var properties = toProperties(dealRecord);
  return fromJS({
    properties: properties,
    portalId: portalId,
    associations: associations
  });
};

var makeAssociationKey = function makeAssociationKey(id, associationType) {
  return ImmutableMap({
    objectId: id,
    objectType: DEAL,
    associationType: associationType
  });
};

export function createDeal(dealRecord) {
  var payload = getCreateDealPayload(dealRecord);
  return DealsAPI.createDeal(payload).then(function (response) {
    var deal = response.first();
    dispatchImmediate(DEAL_CREATED, deal);
    setTimeout(function () {
      return dispatchQueue(DEAL_PIPELINE_SEARCH_RESULT_EXPIRED, deal);
    }, 2000);
    return deal;
  });
}
export function createDealWithAssociations(dealRecord, _ref2) {
  var requestedAssociatedObjects = _ref2.requestedAssociatedObjects;
  var propertyValues = toProperties(dealRecord);
  return DealsAPI.createDealWithAssociations({
    propertyValues: propertyValues,
    requestedAssociatedObjects: requestedAssociatedObjects
  }).then(function (response) {
    var deal = response.first();
    dispatchImmediate(DEAL_CREATED, deal);
    requestedAssociatedObjects.forEach(function (association) {
      dispatchQueue(OBJECT_ASSOCIATION_SUCCEEDED, {
        objectId: association.objectId,
        associationsAdded: [ImmutableModel.getId(deal)],
        fromObjectType: association.objectType,
        toObjectType: DEAL
      });
    });
    setTimeout(function () {
      return dispatchQueue(DEAL_PIPELINE_SEARCH_RESULT_EXPIRED, deal);
    }, 2000);
    return deal;
  });
}
export function deleteDeal(dealId, callback) {
  return DealsAPI.deleteDeal(dealId).then(function () {
    setTimeout(function () {
      dispatchImmediate(DEALS_UPDATED, ImmutableMap().set("" + dealId, null));
    }, 0);
    return typeof callback === 'function' ? callback() : undefined;
  }).done();
}
export function refresh(ids) {
  dispatchQueue(DEALS_REFRESH_QUEUED, ImmutableSet(ids));
  dispatchQueue(ASSOCIATIONS_REFRESH_QUEUED, ImmutableSet([makeAssociationKey(ids[0], DEAL_TO_COMPANY), makeAssociationKey(ids[0], DEAL_TO_CONTACT), makeAssociationKey(ids[0], DEAL_TO_LINE_ITEM), makeAssociationKey(ids[0], DEAL_TO_QUOTE), makeAssociationKey(ids[0], DEAL_TO_TICKET)]));
}
export function revertMove(dealId) {
  return dispatchImmediate(REVERT_DEAL_STAGE_MOVE, dealId);
}
export function updateDealProperties(deal, nextProperties, options) {
  if (options == null) {
    options = {};
  }

  var id = "" + getId(deal);
  var pipeline = getProperty(deal, 'pipeline');
  var properties = nextProperties.map(function (_, name) {
    return getProperty(deal, name);
  });

  if (nextProperties.has('dealstage') && !options.updatedValues) {
    dispatchImmediate(DEAL_STAGE_CHANGE, {
      id: id,
      pipeline: pipeline,
      nextProperties: nextProperties,
      prevProperties: properties,
      options: options
    });
    return Promise.resolve();
  }

  dispatchImmediate(DEALS_UPDATE_STARTED, {
    id: id,
    nextProperties: nextProperties,
    properties: properties
  });
  return DealsAPI.updateDealProperties(deal, nextProperties).then(function (updatedDeal) {
    return dispatchImmediate(DEALS_UPDATE_SUCCEEDED, {
      id: id,
      prevProperties: properties,
      properties: nextProperties,
      deal: updatedDeal
    });
  }, function (error) {
    dispatchImmediate(DEALS_UPDATE_FAILED, {
      error: error,
      id: id,
      nextProperties: nextProperties,
      properties: properties
    });
    throw error;
  });
}
export function updateDeals(deals) {
  invariant(ImmutableMap.isMap(deals), 'DealsActions: expected deals to be a Map but got `%s`', deals);
  return dispatchImmediate(DEALS_UPDATED, deals);
}