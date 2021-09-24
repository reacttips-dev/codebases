'use es6';

import { ENGAGEMENT_OBJECT_TYPE_ID } from '../constants/ObjectTypeIds';
import { fetchMultipleProperties } from './PropertiesAPI';
export var TASK_PROPERTIES = ['hs_task_body', 'hs_task_reminders', 'hs_timestamp', 'hs_task_completion_date', 'hs_task_type', 'hs_engagement_type', 'hs_task_subject', 'hs_created_by', 'hs_task_status', 'hs_task_priority', 'hubspot_owner_id', 'hs_queue_membership_ids', 'hs_task_sequence_step_enrollment_id'];
export function fetchProperties() {
  return fetchMultipleProperties({
    objectType: ENGAGEMENT_OBJECT_TYPE_ID,
    data: TASK_PROPERTIES
  });
}