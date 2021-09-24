'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';

var ConfirmButton = function ConfirmButton(props) {
  return /*#__PURE__*/_jsx(UIButton, Object.assign({}, props, {
    "data-test-id": "bulk-pause-confirm",
    use: "primary"
  }));
};

export default function BulkPauseConfirmation(_ref) {
  var onCancel = _ref.onCancel,
      onConfirm = _ref.onConfirm,
      selectedAllMatches = _ref.selectedAllMatches,
      selectedEnrollments = _ref.selectedEnrollments;
  return /*#__PURE__*/_jsx(UIConfirmModal, {
    ConfirmButton: ConfirmButton,
    confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkPauseConfirmation.buttons.pause"
    }),
    description: selectedAllMatches ? /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "sequences.enrollmentTable.bulkPauseConfirmation.selectedAllMatches.description"
    }) : /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "sequences.enrollmentTable.bulkPauseConfirmation.description",
      options: {
        count: selectedEnrollments.size
      }
    }),
    message: selectedAllMatches ? /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkPauseConfirmation.selectedAllMatches.header"
    }) : /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkPauseConfirmation.header",
      options: {
        count: selectedEnrollments.size
      }
    }),
    onConfirm: onConfirm,
    onReject: onCancel,
    rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkPauseConfirmation.buttons.cancel"
    })
  });
}