'use es6';

import { Map as ImmutableMap } from 'immutable';
import { stepHasEmailTemplateId, getStepEmailTemplateId } from 'SequencesUI/util/stepsWithEmailTemplates';
export var getTemplateIdsFromSequence = function getTemplateIdsFromSequence(sequence) {
  return sequence.get('steps').filter(stepHasEmailTemplateId).map(getStepEmailTemplateId).reduce(function (acc, id) {
    return acc.set(id, id);
  }, ImmutableMap());
};