'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { ASSOCIATE_COMPANY_AND_DEAL, DISASSOCIATE_COMPANY_AND_DEAL, ASSOCIATE_CONTACT_AND_DEAL, DISASSOCIATE_CONTACT_AND_DEAL } from 'crm_schema/association/AssociationActionTypes';
import { DEAL_CREATED, DEALS_UPDATE_STARTED, DEALS_UPDATE_SUCCEEDED, DEALS_UPDATE_FAILED } from 'crm_data/actions/ActionTypes';
import { fetch } from 'crm_data/deals/api/DealsAPI';
import { definePooledObjectStore } from 'crm_data/flux/definePooledObjectStore';
import { List } from 'immutable';
import { getProperty, setProperty } from 'customer-data-objects/model/ImmutableModel';
import registerPooledObjectService from 'crm_data/flux/registerPooledObjectService';
var PREFIX = 'DEALS';
registerPooledObjectService({
  actionTypePrefix: PREFIX,
  fetcher: fetch
});
var DealsStore = definePooledObjectStore({
  actionTypePrefix: PREFIX
}).defineResponseTo(DEAL_CREATED, function (state, deal) {
  var dealId = "" + deal.get('dealId');
  return state.set(dealId, deal);
}).defineResponseTo(DEALS_UPDATE_STARTED, function (state, _ref) {
  var id = _ref.id,
      nextProperties = _ref.nextProperties;

  if (!state.has(id)) {
    return state;
  }

  return state.updateIn([id], function (deal) {
    return nextProperties.reduce(function (acc, value, name) {
      return setProperty(acc, name, value);
    }, deal);
  });
}).defineResponseTo(DEALS_UPDATE_SUCCEEDED, function (state, _ref2) {
  var id = _ref2.id,
      deal = _ref2.deal;
  return state.set(id, deal);
}).defineResponseTo(DEALS_UPDATE_FAILED, function (state, _ref3) {
  var id = _ref3.id,
      nextProperties = _ref3.nextProperties,
      properties = _ref3.properties;
  return state.updateIn([id], function (deal) {
    return properties.reduce(function (acc, value, name) {
      // don't overwrite changes made since the update began
      if (nextProperties.get(name) !== getProperty(acc, name)) {
        return acc;
      }

      return setProperty(acc, name, value);
    }, deal);
  });
}).defineResponseTo(ASSOCIATE_COMPANY_AND_DEAL, function (state, _ref4) {
  var objectId = _ref4.objectId,
      subjectId = _ref4.subjectId;
  var dealId = "" + subjectId;

  if (!state.get(dealId)) {
    return state;
  }

  return state.setIn([dealId, 'associations', 'associatedCompanyIds'], List.of(objectId));
}).defineResponseTo(DISASSOCIATE_COMPANY_AND_DEAL, function (state, _ref5) {
  var subjectId = _ref5.subjectId;
  var dealId = "" + subjectId;

  if (!state.get(dealId)) {
    return state;
  }

  return state.setIn([dealId, 'associations', 'associatedCompanyIds'], List());
}).defineResponseTo(ASSOCIATE_CONTACT_AND_DEAL, function (state, _ref6) {
  var objectId = _ref6.objectId,
      subjectId = _ref6.subjectId;
  var dealId = "" + subjectId;

  if (!state.get(dealId)) {
    return state;
  }

  var path = [dealId, 'associations', 'associatedVids'];
  var associatedVids = state.getIn(path) || List();

  if (!associatedVids.contains(objectId)) {
    associatedVids = associatedVids.push(objectId);
    state = state.setIn(path, associatedVids);
  }

  return state;
}).defineResponseTo(DISASSOCIATE_CONTACT_AND_DEAL, function (state, _ref7) {
  var objectId = _ref7.objectId,
      subjectId = _ref7.subjectId;
  var dealId = "" + subjectId;

  if (!state.get(dealId)) {
    return state;
  }

  var path = [dealId, 'associations', 'associatedVids'];
  var associatedVids = state.getIn(path);
  var objectIdIndex = associatedVids.indexOf(objectId);

  if (objectIdIndex > -1) {
    associatedVids = associatedVids.remove(objectIdIndex);
    state = state.setIn(path, associatedVids);
  }

  return state;
}).register(dispatcher);
export default DealsStore;