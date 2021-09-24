'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSelectedSenderFromAddress } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIFlex from 'UIComponents/layout/UIFlex';
import UITruncateString from 'UIComponents/text/UITruncateString';

var EnrollmentEditorFooterReadOnly = function EnrollmentEditorFooterReadOnly(_ref) {
  var email = _ref.email,
      onReject = _ref.onReject,
      fromAddress = _ref.fromAddress;
  return /*#__PURE__*/_jsxs("footer", {
    className: "sequence-enroll-modal-footer",
    children: [/*#__PURE__*/_jsx(UIButton, {
      use: "secondary",
      className: "m-right-5 sequence-enroll-footer-button",
      onClick: onReject,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.cancel"
      })
    }), /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      className: "sequence-enroll-footer-email",
      children: [/*#__PURE__*/_jsx("strong", {
        className: "p-all-0 m-right-2",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.to"
        })
      }), /*#__PURE__*/_jsx("span", {
        id: "email",
        className: "is--text--help sequence-enroll-footer-recipient",
        children: /*#__PURE__*/_jsx(UITruncateString, {
          maxWidth: 200,
          useFlex: true,
          children: email
        })
      }), /*#__PURE__*/_jsx("strong", {
        className: "p-all-0 m-right-2",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.from"
        })
      }), /*#__PURE__*/_jsx("span", {
        id: "email",
        className: "is--text--help m-right-4",
        children: fromAddress
      })]
    })]
  });
};

EnrollmentEditorFooterReadOnly.propTypes = {
  email: PropTypes.string.isRequired,
  onReject: PropTypes.func.isRequired,
  fromAddress: PropTypes.string.isRequired
};
export default connect(function (state) {
  return {
    fromAddress: getSelectedSenderFromAddress(state)
  };
})(EnrollmentEditorFooterReadOnly);