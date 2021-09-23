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
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIButton from 'UIComponents/button/UIButton';
import { accountProp } from '../../lib/propTypes';
import UIIllustration from 'UIComponents/image/UIIllustration';
import { ACCOUNT_TYPES } from '../../lib/constants';
import H2 from 'UIComponents/elements/headings/H2';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';

var ConnectSuccessModal = /*#__PURE__*/function (_Component) {
  _inherits(ConnectSuccessModal, _Component);

  function ConnectSuccessModal() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ConnectSuccessModal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ConnectSuccessModal)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onLaunchCompose = function () {
      _this.props.onClose();

      _this.props.goToManageUrl();

      _this.props.initBroadcastGroup();
    };

    return _this;
  }

  _createClass(ConnectSuccessModal, [{
    key: "renderPrimaryButton",
    value: function renderPrimaryButton() {
      var account = this.props.account;

      if (account.accountSlug === ACCOUNT_TYPES.youtube) {
        var reportsPath = "/social/" + account.portalId + "/analyze?networks=youtube";
        return /*#__PURE__*/_jsxs(UIButton, {
          use: "primary",
          href: reportsPath,
          children: [' ', /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sui.accounts.connectSuccess.reportsCta"
          })]
        });
      } else {
        return /*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          className: "publish",
          onClick: this.onLaunchCompose,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sui.accounts.connectSuccess.composerCta"
          })
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var illustrationName = this.props.account.accountSlug === ACCOUNT_TYPES.youtube ? 'events' : 'social-connected';
      var blurbKey = this.props.account.accountSlug === ACCOUNT_TYPES.youtube ? 'sui.accounts.connectSuccess.reportsBlurb' : 'sui.accounts.connectSuccess.blurb';
      return /*#__PURE__*/_jsxs(UIModal, {
        className: "connect-success-modal",
        use: "success",
        centered: true,
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: this.props.onClose
          }), /*#__PURE__*/_jsx(H2, {
            className: "p-bottom-5",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.accounts.connectSuccess.heading",
              options: {
                count: this.props.numberOfNewlyConnectedChannels
              }
            })
          })]
        }), /*#__PURE__*/_jsxs(UIDialogBody, {
          children: [/*#__PURE__*/_jsx(UIIllustration, {
            name: illustrationName,
            width: "100%"
          }), /*#__PURE__*/_jsx("p", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: blurbKey,
              options: {
                count: this.props.numberOfNewlyConnectedChannels
              }
            })
          })]
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          align: "center",
          children: [this.renderPrimaryButton(), /*#__PURE__*/_jsx(UIButton, {
            className: "cancel",
            onClick: this.props.onClose,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.accounts.connectSuccess.cancelButton"
            })
          })]
        })]
      });
    }
  }]);

  return ConnectSuccessModal;
}(Component);

ConnectSuccessModal.propTypes = {
  account: accountProp,
  numberOfNewlyConnectedChannels: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  initBroadcastGroup: PropTypes.func.isRequired,
  goToManageUrl: PropTypes.func.isRequired
};
export { ConnectSuccessModal as default };