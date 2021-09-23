'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { pluginUtils } from 'draft-extend';
import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
import { ENTITY_TYPE } from 'sales-modal/utils/enrollModal/missingMergeTags';
import { getStepSendLimitError } from 'sales-modal/utils/enrollModal/getStepSendLimitError';
import { stepHasEmailTemplateId, getStepEmailTemplateSubject, getStepEmailTemplateBody } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';
import { HAS_MISSING_MERGE_TAGS, HAS_SEND_LIMIT_ERRORS, HAS_PRIVATE_TEMPLATE, HAS_NO_TIME_SLOTS } from 'sales-modal/constants/StepErrorTypes';
import * as SendTimesNotAvailableReasons from 'sales-modal/constants/SendTimesNotAvailableReasons';
var entityStrategy = pluginUtils.entityStrategy;

var hasMissingTags = function hasMissingTags(editorState) {
  if (editorState === null || editorState === undefined) {
    return false;
  }

  var contentState = editorState.getCurrentContent();
  return contentState.getBlockMap().some(function (contentBlock) {
    var someExists = false;
    entityStrategy(ENTITY_TYPE)(contentBlock, function () {
      return someExists = true;
    }, contentState);
    return someExists;
  });
};

var hasSendTimeErrorForStep = function hasSendTimeErrorForStep(sequenceEnrollment, index, stepsWithSendTimeErrors) {
  if (!stepsWithSendTimeErrors) {
    return false;
  }

  return !!getStepSendLimitError({
    stepsWithSendTimeErrors: stepsWithSendTimeErrors,
    sequenceEnrollment: sequenceEnrollment,
    index: index
  });
};

export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      stepsWithSendTimeErrors = _ref.stepsWithSendTimeErrors;
  var currentStartingStep = sequenceEnrollment.get('startingStepOrder');

  if (sequenceEnrollment != null) {
    return sequenceEnrollment.get('steps').reduce(function (stepErrors, step, index) {
      var errors = ImmutableSet();

      if (index < currentStartingStep) {
        return stepErrors;
      }

      if (stepHasEmailTemplateId(step)) {
        var subject = getStepEmailTemplateSubject(step);
        var body = getStepEmailTemplateBody(step);

        if (body === null) {
          errors = errors.add(HAS_PRIVATE_TEMPLATE);
        }

        if (hasMissingTags(subject) || hasMissingTags(body)) {
          errors = errors.add(HAS_MISSING_MERGE_TAGS);
        }
      }

      if (step.get('action') === SEND_TEMPLATE) {
        if (hasSendTimeErrorForStep(sequenceEnrollment, index, stepsWithSendTimeErrors)) {
          var sendTimeErrorType = getStepSendLimitError({
            stepsWithSendTimeErrors: stepsWithSendTimeErrors,
            sequenceEnrollment: sequenceEnrollment,
            index: index
          });
          errors = errors.add(sendTimeErrorType === SendTimesNotAvailableReasons.SEND_LIMIT_EXCEEDED ? HAS_SEND_LIMIT_ERRORS : HAS_NO_TIME_SLOTS);
        }
      }

      if (errors.size) {
        return stepErrors.set(index, errors);
      }

      return stepErrors;
    }, ImmutableMap());
  }

  return null;
}