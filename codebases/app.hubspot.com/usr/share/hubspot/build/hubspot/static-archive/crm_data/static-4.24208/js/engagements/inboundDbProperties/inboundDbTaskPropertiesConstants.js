'use es6';

export var TASK_BODY = 'hs_task_body';
export var TASK_STATUS = 'hs_task_status';
export var TASK_FOR_OBJECT_TYPE = 'hs_task_for_object_type';
export var TASK_SUBJECT = 'hs_task_subject';
export var TASK_TYPE = 'hs_task_type';
export var TASK_REMINDERS = 'hs_task_reminders';
export var TASK_PRIORITY = 'hs_task_priority';
export var TASK_DUE_DATE = 'hs_timestamp';
export var SEND_DEFAULT_REMINDER = 'hs_task_send_default_reminder';
export var QUEUE_MEMBERSHIP_IDS = 'hs_queue_membership_ids';
export var TASK_COMPLETION_DATE = 'hs_task_completion_date';
export var TASK_SEQUENCE_STEP_ENROLLMENT_ID = 'hs_task_sequence_step_enrollment_id';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}