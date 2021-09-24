'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import apiClient from 'hub-http/clients/apiClient';
import { SEQUENCE_ENROLLMENT_OBJECT_TYPE_ID } from 'SequencesUI/constants/ObjectTypeIds';
import { fetchMultipleProperties } from './PropertiesAPI';
export var SEQUENCE_ENROLLMENT_PROPERTIES = ['hs_company_id', 'hs_company_name', 'hs_contact_id', 'hs_ended_at', 'hs_enrolled_at', 'hs_enrolled_by', 'hs_enrollement_action', 'hs_enrollment_state', 'hs_last_executed_email_step_order', 'hs_last_executed_step_order', 'hs_last_executed_task_step_order', 'hs_last_step_executed_at', 'hs_step_error_type', 'hs_timestamp', 'hs_unenrolled_source', 'hs_sequence_id', 'hs_email_open_count', 'hs_email_click_count', 'hs_latest_email_clicked_date', 'hs_latest_email_opened_date', 'hs_meeting_booked_count', 'hs_latest_meeting_booked_date', 'hs_latest_email_replied_date', 'hs_email_reply_count'];
export function fetchProperties() {
  return fetchMultipleProperties({
    objectType: SEQUENCE_ENROLLMENT_OBJECT_TYPE_ID,
    data: SEQUENCE_ENROLLMENT_PROPERTIES
  });
}
export function fetchCRMObjects(objectTypeId, searchQuery) {
  return apiClient.post('crm-search/search', {
    data: Object.assign({
      objectTypeId: objectTypeId,
      requestOptions: {
        includeAllValues: true
      }
    }, searchQuery.toJS())
  });
}
export function fetchReports(query) {
  return apiClient.post('crm-search/report', {
    data: query
  });
}
var ACTIVE_ENROLLMENT_FILTERS = [{
  property: 'hs_enrollment_state',
  value: 'EXECUTING',
  operator: 'EQ'
}];
var MANUAL_PAUSED_ENROLLMENT_FILTERS = [{
  property: 'hs_enrollment_state',
  value: 'PAUSED',
  operator: 'EQ'
}, {
  property: 'hs_dependency_type',
  value: 'MANUAL_PAUSE',
  operator: 'EQ'
}];
export function fetchSequenceContacts(sequenceId, userId, isActive) {
  var stateFilters = isActive ? ACTIVE_ENROLLMENT_FILTERS : MANUAL_PAUSED_ENROLLMENT_FILTERS;
  var query = {
    objectTypeId: 'SEQUENCE_ENROLLMENT',
    timeZone: 'US/Eastern',
    filterGroups: [{
      filters: [{
        property: 'hs_sequence_id',
        value: sequenceId,
        operator: 'EQ'
      }, {
        property: 'hs_enrolled_by',
        value: userId,
        operator: 'EQ'
      }].concat(_toConsumableArray(stateFilters))
    }]
  };
  return apiClient.post('crm-search/search', {
    data: query
  });
}
export function fetchAllUserContacts(userId, isActive) {
  var stateFilters = isActive ? ACTIVE_ENROLLMENT_FILTERS : MANUAL_PAUSED_ENROLLMENT_FILTERS;
  var query = {
    objectTypeId: 'SEQUENCE_ENROLLMENT',
    timeZone: 'US/Eastern',
    filterGroups: [{
      filters: [{
        property: 'hs_created_by_user_id',
        value: userId,
        operator: 'EQ'
      }].concat(_toConsumableArray(stateFilters))
    }]
  };
  return apiClient.post('crm-search/search', {
    data: query
  });
}