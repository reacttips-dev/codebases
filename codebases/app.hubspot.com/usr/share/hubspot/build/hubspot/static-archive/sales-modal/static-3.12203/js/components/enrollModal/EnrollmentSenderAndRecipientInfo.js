'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UITruncateString from 'UIComponents/text/UITruncateString';
import SelectConnectedAccount from './SelectConnectedAccount';

var EnrollmentSenderAndRecipientInfo = function EnrollmentSenderAndRecipientInfo(_ref) {
  var email = _ref.email;
  return /*#__PURE__*/_jsxs(UIFlex, {
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
    }), /*#__PURE__*/_jsx(SelectConnectedAccount, {})]
  });
};

EnrollmentSenderAndRecipientInfo.propTypes = {
  email: PropTypes.string.isRequired
};
export default EnrollmentSenderAndRecipientInfo;