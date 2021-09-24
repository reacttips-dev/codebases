'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import Big from 'UIComponents/elements/Big';
export default function SequenceStepSkippedMessage() {
  return /*#__PURE__*/_jsx(Big, {
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "enrollModal.sequenceStepTimeSelection.skipped"
    })
  });
}