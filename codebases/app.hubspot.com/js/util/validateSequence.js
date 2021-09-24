'use es6';

import * as InvalidSequenceTypes from 'SequencesUI/constants/InvalidSequenceTypes';
import { getVisibleSequenceSteps } from 'SequencesUI/util/sequenceBuilderUtils';
var SEQUENCE_NAME_CHARACTER_LIMIT = 200;
export var sequenceNameIsValid = function sequenceNameIsValid(name) {
  var trimmedName = name ? name.trim() : '';
  return trimmedName ? trimmedName.length < SEQUENCE_NAME_CHARACTER_LIMIT : false;
};
export var validateSequence = function validateSequence(sequence) {
  var errors = [];

  if (getVisibleSequenceSteps(sequence).size === 0) {
    errors.push(InvalidSequenceTypes.NO_STEPS);
  }

  if (!sequenceNameIsValid(sequence.get('name'))) {
    errors.push(InvalidSequenceTypes.NAME_NOT_VALID);
  }

  return errors.length === 0 ? null : errors;
};