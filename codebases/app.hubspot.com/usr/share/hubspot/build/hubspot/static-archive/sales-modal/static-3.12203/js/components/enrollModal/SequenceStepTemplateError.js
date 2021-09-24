'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIAlert from 'UIComponents/alert/UIAlert';
export default function SequenceStepTemplateError() {
  return /*#__PURE__*/_jsx(UIAlert, {
    className: "sequence-step-editor-error m-bottom-6",
    type: "warning",
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "enrollModal.stepEditor.errorTitle"
    }),
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "enrollModal.stepEditor.errorDescription"
    })
  });
}