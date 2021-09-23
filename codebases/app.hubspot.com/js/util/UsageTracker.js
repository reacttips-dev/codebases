'use es6';

import { createTracker } from 'usage-tracker';
import events from 'SequencesUI/events.yaml';
import { SCHEDULE_TASK, SEND_TEMPLATE } from 'SequencesUI/constants/SequenceStepTypes';
import { getSequenceTotalTimeToComplete } from 'SequencesUI/util/sequenceBuilderUtils';
import { ACCOUNT_BASED } from 'SequencesUI/constants/SellingStrategyTypes';
import * as SharingOptionTypes from 'sales-content-partitioning/constants/SharingOptionTypes';
import { BUSINESS_DAYS } from 'SequencesUI/constants/EligibleFollowUpDays';
export var tracker = createTracker({
  events: events
});
export var trackViewSequencesPermissionTooltip = function trackViewSequencesPermissionTooltip(subscreen) {
  return tracker.track('sequencesInteraction', {
    action: 'viewSequencesAccessRequestTooltip',
    subscreen: subscreen
  });
};
export var trackViewTemplatesPermissionTooltip = function trackViewTemplatesPermissionTooltip() {
  return tracker.track('templateInteraction', {
    action: 'viewTemplateAccessRequestTooltip'
  });
};
export var getTaskTrackingProperties = function getTaskTrackingProperties(_ref) {
  var payload = _ref.payload,
      taskMeta = _ref.taskMeta;
  taskMeta = taskMeta || payload && payload.getIn(['actionMeta', 'taskMeta']);

  if (!taskMeta) {
    return {};
  }

  var notes = taskMeta.get('notes');
  var EMPTY_NOTE_HTML = '<p></p>';
  return {
    taskType: taskMeta.get('taskType'),
    priority: taskMeta.get('priority'),
    taskQueue: !!taskMeta.get('taskQueueId'),
    hasNotes: !!notes && notes !== EMPTY_NOTE_HTML
  };
};
export var buildCreateOrEditSequenceActionString = function buildCreateOrEditSequenceActionString(strings, action) {
  var str0 = strings[0];
  var str1 = strings[1];
  var trackerStepType = 'other';

  if (action === SEND_TEMPLATE) {
    trackerStepType = 'email';
  } else if (action === SCHEDULE_TASK) {
    trackerStepType = 'task';
  }

  return "" + str0 + trackerStepType + str1;
};
export var getPermissionSaveAction = function getPermissionSaveAction(sharingOption) {
  switch (sharingOption) {
    case SharingOptionTypes.PRIVATE:
      return 'Set to private';

    case SharingOptionTypes.SPECIFIC:
      return 'Shared with users & teams';

    case SharingOptionTypes.EVERYONE:
    default:
      return 'Shared with everyone';
  }
};
export var getSequenceCreateOrEditEventProperties = function getSequenceCreateOrEditEventProperties(sequence) {
  var properties = {
    task_count: sequence.get('steps').count(function (step) {
      return step.get('action') === SCHEDULE_TASK;
    }),
    email_count: sequence.get('steps').count(function (step) {
      return step.get('action') === SEND_TEMPLATE;
    }),
    followUpOnWeekdays: sequence.getIn(['sequenceSettings', 'eligibleFollowUpDays']) === BUSINESS_DAYS,
    threadFollowUpEmails: sequence.getIn(['sequenceSettings', 'useThreadedFollowUps']),
    accountBasedSellingChecked: sequence.getIn(['sequenceSettings', 'sellingStrategy']) === ACCOUNT_BASED,
    hasReminder: sequence.getIn(['sequenceSettings', 'individualTaskRemindersEnabled']),
    sequenceId: sequence.get('id')
  };

  if (sequence.get('delays')) {
    properties.length = getSequenceTotalTimeToComplete(sequence);
  }

  return properties;
};