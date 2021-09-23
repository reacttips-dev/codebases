'use es6';

import { fromJS, Map as ImmutableMap } from 'immutable';
import reduce from 'transmute/reduce';
import { TASK } from 'customer-data-objects/constants/ObjectTypes';
import EngagementRecord from 'customer-data-objects/engagement/EngagementRecord';
import { GET, POST } from 'crm_data/constants/HTTPVerbs';
import { send } from 'crm_data/api/ImmutableAPI';
import { del, patch, post, put } from 'crm_data/inboundDB/sharedAPI';
import Raven from 'Raven';
var API = 'engagements/v1/engagements';
export var API_V2 = 'engagements/v2/engagements';

var uri = function uri(engagementId) {
  return API + "/" + engagementId;
};

var parseSaveResponse = function parseSaveResponse(engagement) {
  // If is a task, check if we have the taskType property
  if (engagement.getIn(['engagement', 'type']) === TASK) {
    if (!engagement.hasIn(['metadata', 'taskType'])) {
      engagement = engagement.setIn(['metadata', 'taskType'], null);
    }
  }

  return engagement;
};

var toSaveable = reduce(ImmutableMap(), function (acc, val, key) {
  if (ImmutableMap.isMap(val) || key === 'attachments') {
    return acc.set(key, fromJS(val));
  }

  return acc;
});
export function addAssociation(engagementId, objectType, objectId) {
  return put(uri(engagementId) + "/associations/" + objectType + "/" + objectId, {});
}
export function associateEngagmentToObject(engagementId, objectType, subjectId) {
  return put(uri(engagementId) + "/associations/" + objectType + "/" + subjectId);
} // todo eventually - move this out to `EngagementsBatchAPI`

export function batchFetch(data, resultsOption) {
  if (!resultsOption) {
    resultsOption = {
      reducerInitialValue: ImmutableMap()
    };
  }

  var options = {
    type: POST,
    timeout: 12000
  };
  return send(options, API + "/batch-get", data, function (results) {
    return results.reduce(function (keyedEngagments, result) {
      return keyedEngagments.set("" + result.engagement.id, EngagementRecord.fromJS(result));
    }, resultsOption.reducerInitialValue);
  });
} // don't use this anymore, use `batchFetch`
// todo - replace this with `batchFetch`

export function fetch(query) {
  var options = {
    type: GET,
    timeout: 10000
  };
  return send(options, API + "/batch", query, function (results) {
    return results.reduce(function (keyedEngagments, result) {
      return keyedEngagments.set("" + result.engagement.id, EngagementRecord.fromJS(result));
    }, ImmutableMap());
  });
}
export function create(engagement) {
  // temporary for https://git.hubteam.com/HubSpot/CRM-Issues/issues/426
  var ownerId = engagement.getIn && engagement.getIn(['engagement', 'ownerId']);

  if (!ownerId) {
    Raven.captureMessage('Engagement on create missing ownerId', {
      extra: {
        engagement: engagement
      }
    });
  }

  return post(API + "/", engagement, function (result) {
    return {
      createdEngagementRecord: EngagementRecord.fromJS(result),
      associationCreateFailures: result.associationCreateFailures
    };
  });
}
export function deleteEngagement(engagementId) {
  return del(uri(engagementId));
}
export function save(engagement) {
  var saveableEngagement = toSaveable(engagement);
  var id = saveableEngagement.getIn(['engagement', 'id']) || saveableEngagement.getIn(['eventData', 'engagement', 'id']);
  return put(uri(id), saveableEngagement).then(parseSaveResponse);
} // todo - deprecate this - causes too many issues w/firewalls

export function update(engagementId, updates) {
  return patch(uri(engagementId), toSaveable(fromJS(updates))).then(parseSaveResponse);
}
export function updateAssociations(engagementId, associationUpdates) {
  return put(uri(engagementId) + "/associations", associationUpdates);
}