'use es6';

import { TODO, CALL, EMAIL } from 'customer-data-objects/engagement/TaskTypes';
import * as TaskPriorities from 'customer-data-objects/engagement/taskPriorities';

var prefix = function prefix(name) {
  return "library.tasks." + name;
}; // Shared


export var SendFollowUpEmail = {
  subject: 'defaultTasks.noTokens.EMAIL',
  taskType: EMAIL
};
export var FollowUpCall = {
  subject: 'defaultTasks.noTokens.CALL',
  taskType: CALL
};
export var CallAndLeaveVoicemail = {
  subject: prefix('callAndLeaveVoicemail'),
  taskType: CALL
};
export var SequenceCompleted = {
  subject: prefix('contactCompletedSequence'),
  taskType: TODO
}; // Trade show

export var ConnectOnLinkedIn = {
  subject: prefix('connectOnLinkedIn.subject'),
  notes: prefix('connectOnLinkedIn.notes'),
  taskType: TODO
}; // Demo request

export var FollowUpCallDemoRequest = {
  subject: prefix('followUpCall.subject'),
  notes: prefix('followUpCall.notes'),
  taskType: CALL,
  priority: TaskPriorities.HIGH
}; // Prospecting

export var CallFirstTouch = {
  subject: prefix('callFirstTouch'),
  taskType: CALL
};
export var CallSecondCall = {
  subject: prefix('callSecondCall'),
  taskType: CALL
};
export var CallThirdCall = {
  subject: prefix('callThirdCall'),
  taskType: CALL
}; // Reschedule meeting

export var CallAndReschedule = {
  subject: prefix('callAndReschedule'),
  taskType: CALL,
  priority: TaskPriorities.HIGH
};