'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { canWrite } from 'SequencesUI/lib/permissions';
import { validateSequence } from './validateSequence';
import * as InvalidSequenceTypes from 'SequencesUI/constants/InvalidSequenceTypes';
export var disableCopySequence = function disableCopySequence(_ref) {
  var sequence = _ref.sequence;

  if (!canWrite()) {
    return true;
  }

  return validateSequence(sequence) !== null;
};
export var disableUpdateSequence = function disableUpdateSequence(_ref2) {
  var saved = _ref2.saved,
      sequence = _ref2.sequence,
      isFromLibrary = _ref2.isFromLibrary;
  var isSaved = !isFromLibrary && saved;

  if (isSaved || !canWrite()) {
    return true;
  }

  return validateSequence(sequence) !== null;
};

var mapErrorsToMessage = function mapErrorsToMessage(errors, sequence) {
  if (!canWrite()) {
    return 'sequences.missingSequencesWriteScope.editSequence';
  }

  if (errors === null) {
    return null;
  }

  var message;

  switch (errors[0]) {
    case InvalidSequenceTypes.NO_STEPS:
      message = 'edit.buttons.saveDisabledTooltip.noSteps';
      break;

    case InvalidSequenceTypes.NAME_NOT_VALID:
      message = sequence.get('name').trim() === '' ? 'edit.buttons.saveDisabledTooltip.noName' : 'edit.buttons.saveDisabledTooltip.nameTooLong';
      break;

    default:
  }

  return message;
};

export var getSaveSequenceTooltipProps = function getSaveSequenceTooltipProps(sequence) {
  var errors = validateSequence(sequence);
  var message = mapErrorsToMessage(errors, sequence);
  return {
    title: message ? /*#__PURE__*/_jsx(FormattedMessage, {
      message: message
    }) : null,
    disabled: !message
  };
};