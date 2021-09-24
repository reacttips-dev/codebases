'use es6';

import I18n from 'I18n';
import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
import * as TaskTypes from 'customer-data-objects/engagement/TaskTypes';

function getTitleIcon(_ref) {
  var stepType = _ref.stepType,
      taskType = _ref.taskType;

  if (stepType === SEND_TEMPLATE) {
    return 'send';
  }

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
}

export function getBuilderProps(_ref2) {
  var stepIndex = _ref2.stepIndex,
      stepType = _ref2.stepType,
      taskType = _ref2.taskType;
  taskType = taskType || TaskTypes.TODO;
  var isTemplateStep = stepType === SEND_TEMPLATE;
  var cardHeaderKey;

  if (isTemplateStep) {
    cardHeaderKey = 'enrollModal.cardHeader.autoEmail';
  } else {
    cardHeaderKey = "enrollModal.cardHeader." + taskType;
  }

  return {
    title: I18n.text(cardHeaderKey, {
      stepOrder: stepIndex + 1
    }),
    titleIcon: getTitleIcon({
      stepType: stepType,
      taskType: taskType
    }),
    titleUse: isTemplateStep ? 'heffalump' : 'oz'
  };
}