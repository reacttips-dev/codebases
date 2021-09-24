'use es6';

import I18n from 'I18n';
import * as DelayOptionTypes from 'SequencesUI/constants/DelayOptionTypes';
import * as TaskTypes from 'customer-data-objects/engagement/TaskTypes';
import { DAY } from 'SequencesUI/constants/Milliseconds';
import { FINISH_ENROLLMENT } from 'SequencesUI/constants/SequenceStepTypes';
export var getTaskCardIcon = function getTaskCardIcon(taskType) {
  switch (taskType) {
    case TaskTypes.TODO:
      return 'tasks';

    case TaskTypes.CALL:
      return 'calling';

    case TaskTypes.EMAIL:
      return 'email';

    case TaskTypes.LINKED_IN_MESSAGE:
    case TaskTypes.LINKED_IN_CONNECT:
      return 'socialBlockLinkedin';

    default:
      return null;
  }
};
export var getVisibleSequenceSteps = function getVisibleSequenceSteps(sequence) {
  return sequence.get('steps').filter(function (step) {
    // Library sequences are non-immutable when rendering for preview, so we have to handle both here.
    var action = step.action || step.get('action');
    return action !== FINISH_ENROLLMENT;
  });
};
export var getSequenceTotalSteps = function getSequenceTotalSteps(sequence) {
  return getVisibleSequenceSteps(sequence).size;
};
export var getSequenceTotalTimeToComplete = function getSequenceTotalTimeToComplete(sequence) {
  var totalMs = sequence.get('delays').reduce(function (ms, delay) {
    return ms + delay;
  }, 0);
  return totalMs / DAY;
};
export var getDelayOptions = function getDelayOptions() {
  return Object.keys(DelayOptionTypes).map(function (key) {
    return {
      text: I18n.text("edit.delaySelector.delayOptions." + key),
      value: DelayOptionTypes[key]
    };
  });
};