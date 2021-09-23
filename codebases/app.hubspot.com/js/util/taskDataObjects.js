'use es6';

import { fromJS, Map as ImmutableMap } from 'immutable';
import { DAY } from 'SequencesUI/constants/Milliseconds';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';
import TaskRecord from 'customer-data-objects/task/TaskRecord';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import * as TaskTypes from 'customer-data-objects/engagement/TaskTypes';
import * as TaskPriorities from 'customer-data-objects/engagement/taskPriorities';
export var NO_TASK_QUEUE = '';
export var DEFAULT_PRIORITY = TaskPriorities.NONE;
export var DEFAULT_TASK_TYPE = TaskTypes.TODO;
export var WILL_NAVIGATE_AWAY = 'WILL_NAVIGATE_AWAY';
export var convertToSequenceTaskMeta = function convertToSequenceTaskMeta(taskRecord) {
  var manualEmailMeta = getProperty(taskRecord, 'sequences_email_template');
  var hasTemplateId = manualEmailMeta && manualEmailMeta.get('templateId');
  var isEmailTask = getProperty(taskRecord, 'hs_task_type') === TaskTypes.EMAIL;

  if (!isEmailTask || !hasTemplateId) {
    manualEmailMeta = null;
  }

  if (manualEmailMeta) {
    manualEmailMeta = manualEmailMeta.delete(WILL_NAVIGATE_AWAY);
  }

  var queueId = getProperty(taskRecord, 'hs_queue_membership_ids');
  return fromJS({
    subject: getProperty(taskRecord, 'hs_task_subject'),
    taskType: getProperty(taskRecord, 'hs_task_type'),
    priority: getProperty(taskRecord, 'hs_task_priority'),
    taskQueueId: queueId ? Number(queueId) : undefined,
    notes: getProperty(taskRecord, 'hs_task_body'),
    manualEmailMeta: manualEmailMeta
  });
};
export var convertToSequenceTaskPayload = function convertToSequenceTaskPayload(taskRecord) {
  return fromJS({
    action: SequenceStepTypes.SCHEDULE_TASK,
    delay: DAY,
    actionMeta: {
      templateMeta: null,
      taskMeta: convertToSequenceTaskMeta(taskRecord)
    }
  });
};
export var convertToTaskRecord = function convertToTaskRecord(taskMeta) {
  return new TaskRecord.fromJS({
    properties: {
      hs_task_subject: {
        name: 'hs_task_subject',
        value: taskMeta.get('subject') || ''
      },
      hs_task_priority: {
        name: 'hs_task_priority',
        value: taskMeta.get('priority') || DEFAULT_PRIORITY
      },
      hs_task_type: {
        name: 'hs_task_type',
        value: taskMeta.get('taskType') || DEFAULT_TASK_TYPE
      },
      hs_queue_membership_ids: {
        name: 'hs_queue_membership_ids',
        value: "" + (taskMeta.get('taskQueueId') || NO_TASK_QUEUE)
      },
      hs_task_body: {
        name: 'hs_task_body',
        value: taskMeta.get('notes')
      },
      sequences_email_template: {
        name: 'sequences_email_template',
        value: taskMeta.get('manualEmailMeta') || ImmutableMap()
      }
    }
  });
};