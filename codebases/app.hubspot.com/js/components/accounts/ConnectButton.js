'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { CONNECT_STEPS, getAppRoot } from '../../lib/constants';
import { logBreadcrumb } from '../../lib/utils';
import SocialContext from '../app/SocialContext';

var ConnectButton = /*#__PURE__*/function (_Component) {
  _inherits(ConnectButton, _Component);

  function ConnectButton() {
    var _this;

    _classCallCheck(this, ConnectButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ConnectButton).call(this));

    _this.onClickConnect = function () {
      logBreadcrumb('click connect account');

      if (_this.props.isComposerEmbed || window.top !== window) {
        window.top.location.href = "/" + getAppRoot() + "/" + _this.props.portalId + "/settings";
      } else {
        _this.props.push('settings');

        _this.props.setConnectStep(CONNECT_STEPS.selectNetwork);
      }
    };

    _this.state = {
      connectStep: undefined,
      connectingAccountSlug: undefined
    };
    return _this;
  }

  _createClass(ConnectButton, [{
    key: "isButtonDisabled",
    value: function isButtonDisabled() {
      if (this.props.isTrial) {
        return this.props.totalConnectedChannels >= this.props.connectedChannelsLimit;
      }

      return false;
    }
  }, {
    key: "renderButton",
    value: function renderButton() {
      var connectButtonText = this.props.connectButtonText || I18n.text('sui.accounts.connectButton');

      var buttonEl = /*#__PURE__*/_jsx(UIButton, {
        className: "connect-account",
        use: "tertiary",
        onClick: this.onClickConnect,
        disabled: this.isButtonDisabled(),
        children: connectButtonText
      });

      if (this.isButtonDisabled()) {
        this.context.trackInteraction('accounts over the limit');
        return /*#__PURE__*/_jsx(UITooltip, {
          title: I18n.text('sui.accounts.limitTooltip', {
            limit: this.props.connectedChannelsLimit
          }),
          children: buttonEl
        });
      }

      return buttonEl;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx("span", {
        className: "connect-button-container",
        children: this.renderButton()
      });
    }
  }]);

  return ConnectButton;
}(Component);

ConnectButton.propTypes = {
  portalId: PropTypes.number.isRequired,
  isComposerEmbed: PropTypes.bool,
  connectButtonText: PropTypes.string,
  push: PropTypes.func,
  setConnectStep: PropTypes.func,
  totalConnectedChannels: PropTypes.number.isRequired,
  connectedChannelsLimit: PropTypes.number.isRequired,
  isTrial: PropTypes.bool
};
ConnectButton.contextType = SocialContext;
export { ConnectButton as default };