'use es6';

import memoize from 'transmute/memoize';
import I18n from 'I18n';
import { SEND_TEMPLATE, SCHEDULE_TASK } from 'sales-modal/constants/SequenceStepTypes';
import * as TaskTypes from 'customer-data-objects/engagement/TaskTypes';
export var nameForStartingStepType = memoize(function (stepType, stepTaskType, stepOrder) {
  switch (stepType) {
    case SEND_TEMPLATE:
      return I18n.text('enrollModal.startingStepSelector.autoEmail', {
        stepOrder: stepOrder
      });

    case SCHEDULE_TASK:
      return I18n.text("enrollModal.startingStepSelector." + (stepTaskType || TaskTypes.TODO), {
        stepOrder: stepOrder
      });

    default:
      return '';
  }
});