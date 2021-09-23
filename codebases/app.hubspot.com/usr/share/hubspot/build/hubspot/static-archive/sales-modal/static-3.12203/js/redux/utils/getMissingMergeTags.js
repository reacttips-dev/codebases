'use es6';

import { Map as ImmutableMap } from 'immutable';
import memoize from 'transmute/memoize';
import getMissingTags from './getMissingTags';
import { stepHasEmailTemplateId, getStepEmailTemplateSubject, getStepEmailTemplateBody } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';
export default memoize(function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment;
  var currentStartingStep = sequenceEnrollment.get('startingStepOrder');
  return sequenceEnrollment.get('steps').reduce(function (missingTags, step) {
    if (step.get('stepOrder') < currentStartingStep || !stepHasEmailTemplateId(step)) {
      return missingTags;
    }

    var bodyState = getStepEmailTemplateBody(step);
    var subjectState = getStepEmailTemplateSubject(step);
    var bodyStateMissingTags = getMissingTags(bodyState).map(function (entityKeys) {
      return entityKeys.first();
    });
    var subjectStateMissingTags = getMissingTags(subjectState).map(function (entityKeys) {
      return entityKeys.first();
    });
    return missingTags.merge(subjectStateMissingTags, bodyStateMissingTags);
  }, ImmutableMap());
});