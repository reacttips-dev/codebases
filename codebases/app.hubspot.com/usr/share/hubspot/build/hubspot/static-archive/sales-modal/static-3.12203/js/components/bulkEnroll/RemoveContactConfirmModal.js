'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
export default function RemoveContactConfirmModal(_ref) {
  var contactName = _ref.contactName,
      onConfirm = _ref.onConfirm,
      onReject = _ref.onReject,
      sequenceName = _ref.sequenceName;
  return /*#__PURE__*/_jsx(UIConfirmModal, {
    "data-selenium-test": "sequence-bulk-enroll-remove-confirm-dialog",
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "bulkEnroll.body.confirmRemoveContact.message",
      options: {
        contactName: contactName,
        sequenceName: sequenceName
      }
    }),
    description: "",
    confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "bulkEnroll.body.confirmRemoveContact.confirmLabel"
    }),
    onConfirm: onConfirm,
    rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "bulkEnroll.body.confirmRemoveContact.rejectLabel"
    }),
    onReject: onReject
  });
}