'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { List, Seq } from 'immutable';
import compose from 'transmute/compose';
import { MEETING, CALL, NOTE, TASK, CONVERSATION_SESSION } from 'customer-data-objects/engagement/EngagementTypes';
import EngagementRecord from 'customer-data-objects/engagement/EngagementRecord';
import { ENGAGEMENTS } from 'crm_data/actions/ActionNamespaces';
import { ADD_SAMPLE_TIMELINE_ITEMS, DELETE_RECORDING, ENGAGEMENTS_ATTACHMENTS_UPDATED, FETCH_TIMELINE_ITEMS_FOR_VFP_SUCCESS, FETCH_TIMELINE_ITEMS_SUCCESS, POLLING_FETCH_TIMELINE_ITEMS_SUCCESS, TASKS_AND_ENGAGEMENTS_UPDATED } from 'crm_data/actions/ActionTypes';
import { ASSOCIATE_CONTACT_AND_ENGAGEMENT, ASSOCIATE_COMPANY_AND_ENGAGEMENT, ASSOCIATE_DEAL_AND_ENGAGEMENT, DISASSOCIATE_CONTACT_AND_ENGAGEMENT, DISASSOCIATE_COMPANY_AND_ENGAGEMENT, DISASSOCIATE_DEAL_AND_ENGAGEMENT, ASSOCIATE_TICKET_AND_ENGAGEMENT, DISASSOCIATE_TICKET_AND_ENGAGEMENT, ASSOCIATE_UNIVERSAL_ASSOCIATION_AND_ENGAGEMENT, ASSOCIATE_ALL_UNIVERSAL_ASSOCIATIONS_AND_ENGAGEMENT, DISASSOCIATE_UNIVERSAL_ASSOCIATION_AND_ENGAGEMENT } from 'crm_schema/association/AssociationActionTypes';
import { definePooledObjectStore } from 'crm_data/flux/definePooledObjectStore';
import registerPooledObjectService from 'crm_data/flux/registerPooledObjectService';
import { getAssociationPath } from 'customer-data-objects/model/ImmutableEngagementModel';
import { fetch } from 'crm_data/engagements/api/EngagementsAPI';
import { byIds } from 'crm_data/engagements/api/EngagementsAPIQuery';
import dispatcher from 'dispatcher/dispatcher';
import { isEngagementEvent } from './isEngagementEvent'; // Do not put in email events from the timeline. We need to fetch emails from the
// engagement service to get the email body.

var TIMELINE_EVENT_TYPES = Seq([MEETING, CALL, NOTE, TASK, CONVERSATION_SESSION]);

var isSampleEventType = function isSampleEventType(event) {
  return !!event.getIn(['eventData', 'engagement', 'isSample']);
};

var isTimelineEventType = function isTimelineEventType(event) {
  return TIMELINE_EVENT_TYPES.contains(event.getIn(['eventData', 'engagement', 'type']));
};

var isTimelineEvent = function isTimelineEvent(event) {
  return isEngagementEvent(event) && (isTimelineEventType(event) || isSampleEventType(event));
};

var _removeFromList = function _removeFromList(list, toRemove) {
  if (!list) {
    return List();
  }

  return list.filter(function (id) {
    return !toRemove.includes(id);
  });
};

var disassociateFromState = function disassociateFromState(state, subjectId, objectIds, associationPath) {
  var engagementId = "" + subjectId;
  var engagement = state.get(engagementId);

  if (!engagement) {
    return state;
  }

  var ids = engagement.getIn(associationPath);

  var updatedList = _removeFromList(ids, objectIds);

  return state.setIn([engagementId].concat(_toConsumableArray(associationPath)), updatedList);
};

var associateInState = function associateInState(state, subjectId, objectIds, associationPath) {
  var engagementId = "" + subjectId;
  var ids = state.getIn([engagementId].concat(_toConsumableArray(associationPath))) || List();
  return state.setIn([engagementId].concat(_toConsumableArray(associationPath)), ids.concat(objectIds).toSet().toList());
};

var updateEngagementsFromTimelineEvents = function updateEngagementsFromTimelineEvents(state, data) {
  var sampleEvents = data.sampleEvents;
  var events = sampleEvents && sampleEvents.size ? sampleEvents : data.get('events');

  if (!events) {
    return state;
  }

  return events.reduce(function (acc, event) {
    if (!isTimelineEvent(event)) {
      return acc;
    }

    var id = event.getIn(['eventData', 'engagement', 'id']);
    var record = EngagementRecord(event.get('eventData'));
    return acc.set("" + id, record);
  }, state);
};

registerPooledObjectService({
  actionTypePrefix: ENGAGEMENTS,
  fetcher: compose(fetch, byIds)
});
export default definePooledObjectStore({
  actionTypePrefix: ENGAGEMENTS
}).defineName('EngagementsStore').defineResponseTo([DISASSOCIATE_CONTACT_AND_ENGAGEMENT, DISASSOCIATE_COMPANY_AND_ENGAGEMENT, DISASSOCIATE_DEAL_AND_ENGAGEMENT, DISASSOCIATE_TICKET_AND_ENGAGEMENT], function (state, _ref) {
  var subjectId = _ref.subjectId,
      objectIds = _ref.objectIds,
      objectType = _ref.objectType;
  var associationPath = getAssociationPath(objectType);
  return disassociateFromState(state, subjectId, objectIds, associationPath);
}).defineResponseTo([ASSOCIATE_CONTACT_AND_ENGAGEMENT, ASSOCIATE_COMPANY_AND_ENGAGEMENT, ASSOCIATE_DEAL_AND_ENGAGEMENT, ASSOCIATE_TICKET_AND_ENGAGEMENT], function (state, _ref2) {
  var subjectId = _ref2.subjectId,
      objectIds = _ref2.objectIds,
      objectType = _ref2.objectType;
  var associationPath = getAssociationPath(objectType);
  return associateInState(state, subjectId, objectIds, associationPath);
}).defineResponseTo([FETCH_TIMELINE_ITEMS_SUCCESS, POLLING_FETCH_TIMELINE_ITEMS_SUCCESS, ADD_SAMPLE_TIMELINE_ITEMS, FETCH_TIMELINE_ITEMS_FOR_VFP_SUCCESS], updateEngagementsFromTimelineEvents).defineResponseTo(DELETE_RECORDING, function (state, _ref3) {
  var engagementId = _ref3.engagementId;
  return state.setIn(["" + engagementId, 'metadata', 'recordingUrl'], null);
}).defineResponseTo(ENGAGEMENTS_ATTACHMENTS_UPDATED, function (state, engagements) {
  var engagement = engagements.first();
  var engagementId = engagement.getIn(['engagement', 'id']);
  return state.setIn(["" + engagementId, 'attachments'], engagement.get('attachments'));
}).defineResponseTo([ASSOCIATE_ALL_UNIVERSAL_ASSOCIATIONS_AND_ENGAGEMENT], function (state, _ref4) {
  var engagementId = _ref4.engagementId,
      universalAssociationMap = _ref4.universalAssociationMap;
  return state.setIn(["" + engagementId, 'associations', 'universalAssociations'], universalAssociationMap);
}).defineResponseTo([ASSOCIATE_UNIVERSAL_ASSOCIATION_AND_ENGAGEMENT, DISASSOCIATE_UNIVERSAL_ASSOCIATION_AND_ENGAGEMENT], function (state, _ref5) {
  var engagementId = _ref5.engagementId,
      updatedAssociationRecord = _ref5.updatedAssociationRecord;
  var toObjectTypeId = updatedAssociationRecord.get('toObjectTypeId');
  return state.setIn(["" + engagementId, 'associations', 'universalAssociations', toObjectTypeId], updatedAssociationRecord);
}).defineResponseTo(TASKS_AND_ENGAGEMENTS_UPDATED, function (state, _ref6) {
  var engagementsMap = _ref6.engagementsMap;
  return state.mergeDeep(engagementsMap);
}).register(dispatcher);