'use es6';

import { EditorState } from 'draft-js';
import { stepHasEmailTemplateId, getStepEmailTemplateSubject, EMAIL_TEMPLATE_META_PATH, TEMPLATE_SUBJECT_PATH } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';
export function threadSubject(_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      _ref$hasToggledThread = _ref.hasToggledThreadingOff,
      hasToggledThreadingOff = _ref$hasToggledThread === void 0 ? false : _ref$hasToggledThread;
  var steps = sequenceEnrollment.steps,
      sequenceSettings = sequenceEnrollment.sequenceSettings,
      startingStepOrder = sequenceEnrollment.startingStepOrder;
  var firstEmailTemplateStep = steps.filter(function (step) {
    return stepHasEmailTemplateId(step) && step.get('stepOrder') >= startingStepOrder;
  }).first();

  if (!firstEmailTemplateStep) {
    return sequenceEnrollment;
  }

  var firstEmailTemplateSubject = getStepEmailTemplateSubject(firstEmailTemplateStep);

  if (!firstEmailTemplateSubject) {
    return sequenceEnrollment;
  }

  var firstSubjectContent = firstEmailTemplateSubject.getCurrentContent();
  var updatedSteps = steps.update(function (stepsList) {
    return stepsList.map(function (step) {
      var action = step.get('action');
      var stepSubjectPath = TEMPLATE_SUBJECT_PATH[action];
      var originalSubjectPath = EMAIL_TEMPLATE_META_PATH[action].concat('originalSubject');
      var stepSubject = step.getIn(stepSubjectPath);
      var stepOriginalSubject = step.getIn(originalSubjectPath);

      if (!stepHasEmailTemplateId(step)) {
        return step;
      }

      if (sequenceSettings.get('useThreadedFollowUps')) {
        if (!stepSubject || stepSubject.getCurrentContent() === firstSubjectContent) {
          return step;
        }

        var updatedStep = EditorState.set(stepSubject, {
          directionMap: firstEmailTemplateSubject.getDirectionMap(),
          currentContent: firstSubjectContent
        });
        return step.setIn(stepSubjectPath, updatedStep);
      }

      if (hasToggledThreadingOff) {
        return step.setIn(stepSubjectPath, stepOriginalSubject);
      }

      return step;
    });
  });
  return sequenceEnrollment.set('steps', updatedSteps);
}
export default threadSubject;