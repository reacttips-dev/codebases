'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
export default function BulkUnenrollConfirmation(_ref) {
  var onConfirm = _ref.onConfirm,
      onReject = _ref.onReject,
      selectedAllMatches = _ref.selectedAllMatches,
      selectedEnrollments = _ref.selectedEnrollments;
  return /*#__PURE__*/_jsx(UIConfirmModal, {
    confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkUnenrollConfirmation.buttons.unenroll",
      options: {
        count: selectedEnrollments.size
      }
    }),
    description: selectedAllMatches ? /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "sequences.enrollmentTable.bulkUnenrollConfirmation.selectedAllMatches.description"
    }) : /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "sequences.enrollmentTable.bulkUnenrollConfirmation.description",
      options: {
        count: selectedEnrollments.size
      }
    }),
    message: selectedAllMatches ? /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkUnenrollConfirmation.selectedAllMatches.header"
    }) : /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkUnenrollConfirmation.header",
      options: {
        count: selectedEnrollments.size
      }
    }),
    onConfirm: onConfirm,
    onReject: onReject,
    rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.bulkUnenrollConfirmation.buttons.cancel",
      options: {
        count: selectedEnrollments.size
      }
    })
  });
}
BulkUnenrollConfirmation.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  selectedAllMatches: PropTypes.bool.isRequired,
  selectedEnrollments: PropTypes.object.isRequired
};