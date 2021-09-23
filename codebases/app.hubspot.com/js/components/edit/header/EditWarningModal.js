'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIcon from 'UIComponents/icon/UIIcon';
import { MARIGOLD } from 'HubStyleTokens/colors';
import { getOwnerName } from 'SequencesUI/util/owner';

var EditWarningModal = function EditWarningModal(_ref) {
  var sequence = _ref.sequence,
      onConfirm = _ref.onConfirm,
      onReject = _ref.onReject;
  var userView = sequence.get('userView');
  return /*#__PURE__*/_jsx(UIConfirmModal, {
    message: /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      direction: "row",
      children: [/*#__PURE__*/_jsx(UIIcon, {
        name: "warning",
        size: 18,
        color: MARIGOLD,
        className: "m-right-2"
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "editWarningModal.headerText"
      })]
    }),
    description: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "editWarningModal.messageText",
      options: {
        owner: getOwnerName(userView)
      }
    }),
    confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "editWarningModal.buttons.confirmText"
    }),
    onConfirm: onConfirm,
    rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "editWarningModal.buttons.cancel"
    }),
    onReject: onReject,
    size: "auto",
    width: 550
  });
};

EditWarningModal.propTypes = {
  sequence: PropTypes.instanceOf(ImmutableMap).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};
export default EditWarningModal;