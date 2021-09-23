'use es6';

export var ENQUEUED = 'ENQUEUED'; // Step has been scheduled for execution

export var EXECUTING = 'EXECUTING';
export var FINISHED = 'FINISHED'; // A step that successfully executed

var ERROR = 'ERROR';
export var RETRYING = 'RETRYING'; // Blocked by a pausing task or it's the next step on a paused sequence

export var BLOCKED = 'BLOCKED'; // When a pausing task is completed, the next step is then UNBLOCKED.
// It's a temporary state before being scheduled aka ENQUEUED.

var UNBLOCKED = 'UNBLOCKED';
export var SKIPPED = 'SKIPPED'; // eslint-disable-line no-unused-vars

var EXECUTION_ATTEMPTED = [EXECUTING, RETRYING];
var EDITABLE_STATES = [ENQUEUED, BLOCKED, UNBLOCKED,
/*
 *  An erroring stepEnrollment is one that did not execute successfully, e.g. due to connected inbox issues.
 *  This is only encountered in the reenroll modal. Since the user wants to resume the enrollment
 *  from right _after_ the last successful step, an ERROR step should be editable.
 */
ERROR];
export function wasExecuted(stepEnrollment) {
  return stepEnrollment.get('state') === FINISHED;
}
export function executionAttemptedOrFinished(stepEnrollment) {
  return EXECUTION_ATTEMPTED.includes(stepEnrollment.get('state')) || wasExecuted(stepEnrollment);
}
export function isEditable(stepEnrollment) {
  return EDITABLE_STATES.includes(stepEnrollment.get('state'));
}