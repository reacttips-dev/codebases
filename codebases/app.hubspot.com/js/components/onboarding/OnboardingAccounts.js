'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import UISection from 'UIComponents/section/UISection';
import UIList from 'UIComponents/list/UIList';
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
import { CONNECT_STEPS } from '../../lib/constants';
import { connectStepProp, listProp, logicalChannelsProp, setProp } from '../../lib/propTypes';
import AccountTypeButton from '../accounts/AccountTypeButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';

var OnboardingAccounts = /*#__PURE__*/function (_Component) {
  _inherits(OnboardingAccounts, _Component);

  function OnboardingAccounts() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, OnboardingAccounts);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(OnboardingAccounts)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onClickNetwork = function (accountSlug) {
      _this.props.createAccount(accountSlug);
    };

    _this.renderNetwork = function (accountSlug) {
      var channels = _this.props.channels.filter(function (c) {
        return c.accountSlug === accountSlug;
      });

      var tooltipText = channels.map(function (c) {
        return c.name;
      }).toArray().join(', ');
      return /*#__PURE__*/_jsx(AccountTypeButton, {
        accountSlug: accountSlug,
        channelsConnectedCount: channels.size,
        onClick: _this.onClickNetwork,
        tooltipText: tooltipText
      }, accountSlug);
    };

    return _this;
  }

  _createClass(OnboardingAccounts, [{
    key: "renderAccounts",
    value: function renderAccounts() {
      // todo handle if user cannot connect accounts and publish to shared ones (require Marketer/ All accounts or higher to complete onboarding)
      if (!(this.props.accounts && this.props.channels)) {
        return null;
      }

      return this.props.connectableAccountTypes.map(this.renderNetwork);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsxs(UISection, {
        className: "onboarding-accounts",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "intro",
          children: [/*#__PURE__*/_jsx(H4, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.onboarding.connect.heading"
            })
          }), /*#__PURE__*/_jsx("p", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.onboarding.connect.blurb"
            })
          })]
        }), /*#__PURE__*/_jsx(UIList, {
          className: "networks",
          children: this.renderAccounts()
        }), this.props.connectStep === CONNECT_STEPS.saving && /*#__PURE__*/_jsx(UILoadingOverlay, {})]
      });
    }
  }]);

  return OnboardingAccounts;
}(Component);

OnboardingAccounts.propTypes = {
  accounts: listProp,
  channels: logicalChannelsProp,
  user: PropTypes.object.isRequired,
  connectStep: connectStepProp,
  createAccount: PropTypes.func.isRequired,
  connectableAccountTypes: setProp
};
export { OnboardingAccounts as default };