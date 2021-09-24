'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';

var ConfirmButton = function ConfirmButton(props) {
  return /*#__PURE__*/_jsx(UIButton, Object.assign({}, props, {
    "data-test-id": "bulk-resume-confirm",
    use: "primary"
  }));
};

export default function BulkResumeConfirmation(_ref) {
  var onCancel = _ref.onCancel,
      onConfirm = _ref.onConfirm,
      selectedAllMatches = _ref.selectedAllMatches,
      selectedEnrollments = _ref.selectedEnrollments;
  return /*#__PURE__*/_jsx(UIConfirmModal, {
    ConfirmButton: ConfirmButton,
    confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkResumeConfirmation.buttons.pause"
    }),
    description: selectedAllMatches ? /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "sequences.enrollmentTable.bulkResumeConfirmation.selectedAllMatches.description"
    }) : /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "sequences.enrollmentTable.bulkResumeConfirmation.description",
      options: {
        count: selectedEnrollments.size
      }
    }),
    message: selectedAllMatches ? /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkResumeConfirmation.selectedAllMatches.header"
    }) : /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkResumeConfirmation.header",
      options: {
        count: selectedEnrollments.size
      }
    }),
    onConfirm: onConfirm,
    onReject: onCancel,
    rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkResumeConfirmation.buttons.cancel"
    })
  });
}