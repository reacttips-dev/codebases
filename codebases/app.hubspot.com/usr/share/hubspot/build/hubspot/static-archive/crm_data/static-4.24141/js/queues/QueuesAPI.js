'use es6';

import { connectPromiseSingle } from 'crm_data/flux/connectPromiseSingle';
import CurrentOwnerIdStore from 'crm_data/owners/CurrentOwnerIdStore';
import { Map as ImmutableMap, OrderedMap } from 'immutable';
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import { PUT, GET } from 'crm_data/constants/HTTPVerbs';
import QueueRecord from 'crm_schema/queues/QueueRecord';
export var API_URL = 'engagements/v1/queues';
export var fetchCurrentOwnerId = connectPromiseSingle(CurrentOwnerIdStore);
export function parseFetch(results) {
  return results.reduce(function (acc, queue) {
    var data = queue.get('definition').set('engagementIds', queue.get('engagementIds')).set('userParticipants', queue.get('userParticipants'));
    return acc.set(queue.getIn(['definition', 'id']), QueueRecord.fromJS(data));
  }, OrderedMap());
}
export function getCurrentOwnerId(ownerIdOverride) {
  if (ownerIdOverride) {
    return Promise.resolve(ownerIdOverride);
  }

  return fetchCurrentOwnerId();
}
export function fetch(ownerIdOverride) {
  return getCurrentOwnerId(ownerIdOverride).then(function (ownerId) {
    if (ownerId === -1) {
      return ImmutableMap().set('error', false);
    }

    return ImmutableAPI.send({
      type: GET
    }, API_URL + "/owner/" + ownerId, {
      includeShared: true,
      includeEngagements: false
    }).then(parseFetch);
  }).catch(function (e) {
    console.error(e);
    return ImmutableMap().set('error', true);
  });
}
export function create(_ref) {
  var name = _ref.name,
      accessType = _ref.accessType;
  return fetchCurrentOwnerId().then(function (ownerId) {
    return ImmutableAPI.post(API_URL, {
      name: name,
      ownerId: ownerId,
      accessType: accessType
    }).then(function (resp) {
      return QueueRecord.fromJS(resp);
    });
  });
}
export function updateDefinition(queueId, update) {
  return ImmutableAPI.put(API_URL + "/" + queueId + "/definition", update);
} // send ONLY NEW ids and append id(s) to the end of queue
// can handle tasks that already belong to a different queue

export function addEngagements(queueId, engagementIds) {
  return ImmutableAPI.send({
    type: PUT,
    headers: {
      'X-Source': 'CRM_UI'
    }
  }, API_URL + "/" + queueId + "/append-engagements", engagementIds);
}
export function removeEngagements(queueId, engagementIds) {
  return ImmutableAPI.send({
    type: PUT,
    headers: {
      'X-Source': 'CRM_UI'
    }
  }, API_URL + "/" + queueId + "/remove-engagements", engagementIds);
}
/* DEPRECATED
  send ALL ids to update entire queue for reorder/sort
  passed engagementIds MUST be the exact set currently in the queue, just in a different order
*/

export function updateEngagements(queueId, engagementIds) {
  return ImmutableAPI.send({
    type: PUT,
    headers: {
      'X-Source': 'CRM_UI'
    }
  }, API_URL + "/" + queueId + "/reorder-engagements", engagementIds);
}
export function updateQueueOrder(queueIds) {
  return ImmutableAPI.put(API_URL + "/order", queueIds);
}
export function deleteQueue(queueId) {
  return ImmutableAPI.delete(API_URL + "/" + queueId);
}
export function addUsersToQueueById(queueId, userIds) {
  return ImmutableAPI.send({
    type: PUT,
    headers: {
      'X-Source': 'CRM_UI'
    }
  }, API_URL + "/" + queueId + "/add-participants", userIds);
}
export function removeUsersFromQueueById(queueId, userIds) {
  return ImmutableAPI.send({
    type: PUT,
    headers: {
      'X-Source': 'CRM_UI'
    }
  }, API_URL + "/" + queueId + "/remove-participants", userIds);
}