'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import I18n from 'I18n';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeaderImage from 'UIComponents/dialog/UIDialogHeaderImage';
import UIIllustration from 'UIComponents/image/UIIllustration';
import { accountProp, mapProp } from '../../lib/propTypes';
import { getAccountDisplayName } from '../../lib/constants';
import H2 from 'UIComponents/elements/headings/H2';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
/*
This component could either have an Account or a map returned from SocialOAuthUI describing why we failed to connect one
 */

var ConnectFailureModal = /*#__PURE__*/function (_Component) {
  _inherits(ConnectFailureModal, _Component);

  function ConnectFailureModal() {
    _classCallCheck(this, ConnectFailureModal);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConnectFailureModal).apply(this, arguments));
  }

  _createClass(ConnectFailureModal, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          account = _this$props.account,
          accountConnectFailure = _this$props.accountConnectFailure;
      var accountSlug = account ? account.accountSlug : null;
      var networkName = account ? account.getDisplayName() : null;
      var errorKey = accountConnectFailure.get('failureReason'); // Try to calculate the account slug

      if (!networkName && errorKey.indexOf('youtube') !== -1) {
        accountSlug = 'youtube';
      }

      if (!accountSlug && accountConnectFailure) {
        accountSlug = accountConnectFailure.get('accountSlug');
      } // Get the network name from the account slug


      networkName = accountSlug ? getAccountDisplayName(accountSlug) : null;
      var context = {
        networkName: networkName
      };
      var canShowDescriptiveError = accountConnectFailure && I18n.lookup("sui.accounts.connectFailure.reasons." + errorKey);
      return /*#__PURE__*/_jsxs(UIModal, {
        use: "info",
        width: 540,
        children: [/*#__PURE__*/_jsx(UIDialogHeaderImage, {
          offsetBottom: -23,
          offsetTop: 56,
          children: /*#__PURE__*/_jsx(UIIllustration, {
            alt: "",
            name: "social",
            width: 190
          })
        }), /*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(H2, {
            children: networkName ? /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "sui.accounts.connectFailure.heading",
              options: context
            }) : /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "sui.accounts.connectFailure.headingUnknownAccount"
            })
          }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: this.props.onClose
          })]
        }), /*#__PURE__*/_jsx(UIDialogBody, {
          children: /*#__PURE__*/_jsx("p", {
            children: canShowDescriptiveError ? /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              className: "detail",
              message: "sui.accounts.connectFailure.reasons." + errorKey,
              options: context
            }) : /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.accounts.connectFailure.blurb"
            })
          })
        }), /*#__PURE__*/_jsx(UIDialogFooter, {
          align: "center"
        })]
      });
    }
  }]);

  return ConnectFailureModal;
}(Component);

ConnectFailureModal.propTypes = {
  account: accountProp,
  accountConnectFailure: mapProp,
  onClose: PropTypes.func.isRequired
};
export { ConnectFailureModal as default };