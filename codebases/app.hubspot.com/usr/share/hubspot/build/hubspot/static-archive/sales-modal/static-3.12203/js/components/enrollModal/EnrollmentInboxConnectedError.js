'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import * as ConnectedAccountsActions from 'sales-modal/redux/actions/ConnectedAccountsActions';
import { getInboxAddress, getFromAddress } from 'sales-modal/redux/selectors/SenderSelectors';
import { EnrollTypePropType, EnrollTypes } from 'sales-modal/constants/EnrollTypes';
import { emailIntegrationSettings } from 'sales-modal/lib/links';
import { CANDY_APPLE } from 'HubStyleTokens/colors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H1 from 'UIComponents/elements/headings/H1';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIButton from 'UIComponents/button/UIButton';
import ComponentWithTarget from './ComponentWithTarget';
var UIButtonWithTarget = ComponentWithTarget(UIButton);
var ENROLL_TYPES_WITH_FIXED_FROM_ADDRESS = [EnrollTypes.EDIT, EnrollTypes.RESUME, EnrollTypes.REENROLL];
var EnrollmentInboxConnectedError = createReactClass({
  displayName: "EnrollmentInboxConnectedError",
  propTypes: {
    inboxAddress: PropTypes.string,
    fromAddress: PropTypes.string,
    enrollType: EnrollTypePropType,
    initConnectedAccounts: PropTypes.func.isRequired
  },
  renderParagraph: function renderParagraph() {
    var _this$props = this.props,
        inboxAddress = _this$props.inboxAddress,
        fromAddress = _this$props.fromAddress,
        enrollType = _this$props.enrollType;
    var message;

    if (ENROLL_TYPES_WITH_FIXED_FROM_ADDRESS.includes(enrollType)) {
      var hasAlias = inboxAddress !== fromAddress;
      message = hasAlias ? 'salesModal.enrollmentFromAddressNotConnected.bodyWithAlias' : 'salesModal.enrollmentFromAddressNotConnected.body';
    } else {
      message = inboxAddress ? 'enrollModal.inboxConnectedError.body' : 'enrollModal.inboxConnectedError.bodyNoEmailProvided';
    }

    return /*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: message,
        options: {
          inboxAddress: inboxAddress,
          fromAddress: fromAddress
        }
      })
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs("div", {
      className: "connected-inbox-error enrollment-error inbox-connect text-center p-all-5",
      children: [/*#__PURE__*/_jsx(UIIcon, {
        name: "warning",
        color: CANDY_APPLE
      }), /*#__PURE__*/_jsx(H1, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "salesModal.enrollmentFromAddressNotConnected.title"
        })
      }), this.renderParagraph(), /*#__PURE__*/_jsxs("div", {
        className: "inbox-connect-buttons m-top-4",
        children: [/*#__PURE__*/_jsx(UIButtonWithTarget, {
          className: "m-auto-y-0",
          use: "primary",
          href: emailIntegrationSettings(),
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "enrollModal.inboxConnectedError.action"
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          className: "m-auto-y-0 m-top-2",
          use: "link",
          onClick: this.props.initConnectedAccounts,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "enrollModal.inboxConnectedError.connectionCompleteAction"
          })
        })]
      })]
    });
  }
});
export default connect(function (state) {
  return {
    inboxAddress: getInboxAddress(state),
    fromAddress: getFromAddress(state),
    enrollType: state.enrollType
  };
}, {
  initConnectedAccounts: ConnectedAccountsActions.initConnectedAccounts
})(EnrollmentInboxConnectedError);