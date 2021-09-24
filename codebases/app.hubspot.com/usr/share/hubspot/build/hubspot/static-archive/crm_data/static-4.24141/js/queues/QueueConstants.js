/*
 todo follow up - https://git.hubteam.com/HubSpot/Engagements/issues/410
*/
'use es6';

import keyMirror from 'react-utils/keyMirror';
export var QUEUE_MAX = 20; // Attempting to add a task to a queue where it already exists

export var OWNED_BY_OTHER_USER = 'OWNED_BY_OTHER_USER';
export var MAX_QUEUES_PER_OWNER_EXCEEDED = 'MAX_QUEUES_PER_OWNER_EXCEEDED'; // todo - get errorType

export var NON_EXISTENT_TASK = 'Cannot assign non-existent engagements to queue';
export var QueueSelectLocation = keyMirror({
  TIMELINE: null,
  COMMUNICATOR: null,
  TASKS: null
});
export var DraggableTableRowTypes = keyMirror({
  QUEUE: null,
  STANDARD: null
});
export var QueueControlTypes = keyMirror({
  SKIP: null,
  NEXT: null,
  COMPLETE: null,
  IS_COMPLETED: null,
  IS_RESCHEDULED: null,
  FINISH: null,
  BACK_TO_TASKS: null,
  RESCHEDULE: null,
  REMAINING: null
});