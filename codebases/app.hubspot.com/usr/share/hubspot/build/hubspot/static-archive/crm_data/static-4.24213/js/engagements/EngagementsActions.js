'use es6';

import { fromJS, Map as ImmutableMap, List } from 'immutable';
import once from 'transmute/once';
import { TASK } from 'customer-data-objects/constants/ObjectTypes';
import { QUEUES_FETCH_STARTED, ENGAGEMENTS_UPDATED, ENGAGEMENTS_ATTACHMENTS_UPDATED } from 'crm_data/actions/ActionTypes';
import { EMPTY } from 'crm_data/constants/LoadingStatus';
import { transact } from 'crm_data/flux/transact';
import { dispatchImmediate } from 'crm_data/dispatch/Dispatch';
import { getId } from 'customer-data-objects/model/ImmutableModel';
import EngagementsStore from 'crm_data/engagements/EngagementsStore';
import * as EngagementsAPI from 'crm_data/engagements/api/EngagementsAPI';
import { batchUpdateEngagements } from 'crm_data/engagements/api/EngagementsV2API';
import { batchCreateEngagements } from 'crm_data/engagements/api/EngagementsBatchAPI';
import { engagementToInboundDbObject } from 'crm_data/engagements/inboundDbProperties/engagementInboundDbObjectHelpers';
import { connectPromiseSingle } from 'crm_data/flux/connectPromiseSingle';
import CurrentOwnerIdStore from 'crm_data/owners/CurrentOwnerIdStore';
import { engagementIdInvariant, engagementIdsInvariant, engagementsInvariant, engagementRecordInvariant, engagementUpdatesInvariant } from './EngagementInvariants';
import * as ScheduleSendAPI from 'crm_data/email/ScheduleSendAPI';
var getEmptyTask = once(function (ownerId) {
  var ownerProperty = ownerId === -1 ? {} : {
    ownerId: ownerId
  };
  return fromJS({
    engagement: Object.assign({}, ownerProperty, {
      type: TASK
    }),
    metadata: {
      status: 'NOT_STARTED'
    }
  });
});

function engagementsToMap(engagements) {
  return engagements.reduce(function (engagementsMap, engagement) {
    return engagementsMap.set(getId(engagement), engagement);
  }, ImmutableMap());
} // todo - deprecate `engagementsAPI.update`


export function updateEngagement(engagementId, engagementUpdates) {
  engagementIdInvariant(engagementId);
  engagementUpdatesInvariant(engagementUpdates);
  var originalEngagement = EngagementsStore.get(engagementId);
  var updatedEngagement = originalEngagement.mergeDeep(engagementUpdates);
  return transact({
    operation: function operation() {
      return EngagementsAPI.update(engagementId, engagementUpdates.toJS());
    },
    commit: [ENGAGEMENTS_UPDATED, ImmutableMap().set("" + engagementId, updatedEngagement)],
    rollback: [ENGAGEMENTS_UPDATED, ImmutableMap().set("" + engagementId, originalEngagement)]
  });
}
export function addAssociation(engagementId, objectType, objectId) {
  engagementIdInvariant(engagementId);
  return EngagementsAPI.addAssociation(engagementId, objectType, objectId);
}
export function batchUpdate(_ref) {
  var engagementIds = _ref.engagementIds,
      updates = _ref.updates;
  engagementIdsInvariant(engagementIds);
  engagementUpdatesInvariant(updates);
  var originalEngagements = List(EngagementsStore.get(engagementIds));
  var updatedEngagements = originalEngagements.map(function (engagement) {
    return engagement.merge(updates);
  });
  return transact({
    operation: function operation() {
      return batchUpdateEngagements(engagementIds, updates);
    },
    commit: [ENGAGEMENTS_UPDATED, engagementsToMap(updatedEngagements)],
    rollback: [ENGAGEMENTS_UPDATED, engagementsToMap(originalEngagements)]
  });
}
export function createEngagement(engagement) {
  engagementRecordInvariant(engagement);
  return EngagementsAPI.create(engagement);
}
export function createTask(options) {
  return connectPromiseSingle(CurrentOwnerIdStore)().then(function (ownerId) {
    var task = getEmptyTask(ownerId).mergeDeep(options);
    return EngagementsAPI.create(task);
  });
}
export function batchCreate(engagements) {
  var inboundDbEngagements = engagements.map(engagementToInboundDbObject);
  return batchCreateEngagements(inboundDbEngagements);
}
export function editEngagement(updatedEngagement, originalEngagement) {
  engagementRecordInvariant(updatedEngagement);
  engagementRecordInvariant(originalEngagement);
  var engagementId = updatedEngagement.getIn(['engagement', 'id']);
  return transact({
    operation: function operation() {
      return EngagementsAPI.save(updatedEngagement);
    },
    commit: [ENGAGEMENTS_UPDATED, ImmutableMap().set("" + engagementId, updatedEngagement)],
    rollback: [ENGAGEMENTS_UPDATED, ImmutableMap().set("" + engagementId, originalEngagement)]
  });
}
export function deleteEngagement(engagementId, engagementType) {
  engagementIdInvariant(engagementId);
  return EngagementsAPI.deleteEngagement(engagementId).then(function () {
    dispatchImmediate(ENGAGEMENTS_UPDATED, ImmutableMap().set(engagementId, EMPTY));

    if (engagementType === TASK) {
      dispatchImmediate(QUEUES_FETCH_STARTED);
    }
  });
}
export function deleteScheduledEmailEngagement(engagementId, senderEmail, facsimileSendId) {
  return ScheduleSendAPI.deleteAndUnscheduleEmail(senderEmail, facsimileSendId).then(function () {
    dispatchImmediate(ENGAGEMENTS_UPDATED, ImmutableMap().set(engagementId, EMPTY));
  });
}
export function updateAssociations(engagementId, associationUpdates) {
  engagementIdInvariant(engagementId);
  return EngagementsAPI.updateAssociations(engagementId, associationUpdates);
}
export function updateEngagements(engagements) {
  engagementsInvariant(engagements);
  dispatchImmediate(ENGAGEMENTS_UPDATED, engagements);
} // todo - deprecate `engagementsAPI.update`

export function updateEngagementAttachments(originalEngagement, engagementUpdates) {
  var engagementId;

  if (typeof originalEngagement === 'number') {
    engagementId = originalEngagement;
  } else {
    engagementId = originalEngagement.getIn(['engagement', 'id']);
  }

  originalEngagement = EngagementsStore.get(engagementId);
  var updatedEngagement = originalEngagement.set('attachments', engagementUpdates.get('attachments'));
  return transact({
    operation: function operation() {
      return EngagementsAPI.update(engagementId, engagementUpdates.toJS());
    },
    commit: [ENGAGEMENTS_ATTACHMENTS_UPDATED, ImmutableMap().set("" + engagementId, updatedEngagement)],
    rollback: [ENGAGEMENTS_ATTACHMENTS_UPDATED, ImmutableMap().set("" + engagementId, originalEngagement)]
  });
}