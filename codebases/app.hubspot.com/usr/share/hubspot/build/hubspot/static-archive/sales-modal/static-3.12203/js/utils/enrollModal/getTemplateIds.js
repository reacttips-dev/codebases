'use es6';

import { stepHasEmailTemplateId, getStepEmailTemplateId } from './stepsWithEmailTemplates';
export default function getTemplateIds(sequence) {
  return sequence.get('steps').filter(stepHasEmailTemplateId).map(getStepEmailTemplateId).toJS();
}