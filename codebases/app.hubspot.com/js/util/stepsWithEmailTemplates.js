'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _TEMPLATE_ID_PATH, _EMAIL_TEMPLATE_META_;

import { SEND_TEMPLATE, SCHEDULE_TASK, FINISH_ENROLLMENT } from 'SequencesUI/constants/SequenceStepTypes';
export var TEMPLATE_ID_PATH = (_TEMPLATE_ID_PATH = {}, _defineProperty(_TEMPLATE_ID_PATH, SEND_TEMPLATE, ['actionMeta', 'templateMeta', 'id']), _defineProperty(_TEMPLATE_ID_PATH, SCHEDULE_TASK, ['actionMeta', 'taskMeta', 'manualEmailMeta', 'templateId']), _defineProperty(_TEMPLATE_ID_PATH, FINISH_ENROLLMENT, []), _TEMPLATE_ID_PATH);
export var EMAIL_TEMPLATE_META_PATH = (_EMAIL_TEMPLATE_META_ = {}, _defineProperty(_EMAIL_TEMPLATE_META_, SEND_TEMPLATE, ['actionMeta', 'templateMeta']), _defineProperty(_EMAIL_TEMPLATE_META_, SCHEDULE_TASK, ['actionMeta', 'taskMeta', 'manualEmailMeta']), _defineProperty(_EMAIL_TEMPLATE_META_, FINISH_ENROLLMENT, []), _EMAIL_TEMPLATE_META_);
export var getStepEmailTemplateId = function getStepEmailTemplateId(step) {
  return step.getIn(TEMPLATE_ID_PATH[step.get('action')]);
};
export var stepHasEmailTemplateId = function stepHasEmailTemplateId(step) {
  if (step.get('action') === FINISH_ENROLLMENT) {
    return null;
  }

  var templateId = getStepEmailTemplateId(step);
  return templateId !== null && templateId !== undefined;
};