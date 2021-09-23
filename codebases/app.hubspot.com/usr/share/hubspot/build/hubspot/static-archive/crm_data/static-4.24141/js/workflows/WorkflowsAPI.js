'use es6';

import { get, post, del } from 'crm_data/api/ImmutableAPI';
import makeBatch from 'crm_data/api/makeBatch';
import { Map as ImmutableMap, fromJS } from 'immutable';
export function fetchWorkflows() {
  return get('automation/v3/workflows/?property=name&property=id&property=enabled&stats=false&migration=false', null, function (data) {
    var workflows = fromJS(data.workflows);
    var all = workflows.reduce(function (map, workflow) {
      return map.set(String(workflow.get('id')), workflow);
    }, ImmutableMap());
    return ImmutableMap({
      all: all,
      enabled: workflows.filter(function (workflow) {
        return workflow.get('enabled');
      })
    });
  });
}
export function fetchMemberships(vids) {
  var vid = vids.first();
  return get("automation/v3/workflows/enrollments/contacts/" + vid + "/history", null, function (workflows) {
    var workflowMemberships = workflows.reduce(function (acc, membership) {
      return acc.set(String(membership.workflowId), fromJS(membership));
    }, ImmutableMap());
    return ImmutableMap().set(String(vid), workflowMemberships);
  });
}
export function addToWorkflow(vid, workflowId) {
  return post("automation/v2/workflows/" + workflowId + "/enrollments/contacts/" + vid);
}
export function bulkAddToWorkflow(_ref) {
  var vids = _ref.vids,
      workflowId = _ref.workflowId;
  return post("automation/v2/workflows/" + workflowId + "/enrollments/groupvid", {
    vids: vids
  });
}
export function addAllToWorkflow(listId, workflowId) {
  return post("automation/v2/workflows/" + workflowId + "/enrollments/lists/" + listId);
}
export function removeFromWorkflow(vid, workflowId) {
  return del("automation/v2/workflows/" + workflowId + "/enrollments/contacts/" + vid);
}
export function checkValidEnrollment(vid, workflowId) {
  return get("automation/v3/workflows/valid-enrollments/vid/" + vid + "/workflow/" + workflowId);
}
export function search(searchText) {
  var url = 'automation/v3/workflows/search';
  return get(url, {
    q: searchText
  });
}
export var batchSearch = makeBatch(search, 'WorkflowsAPI.search');