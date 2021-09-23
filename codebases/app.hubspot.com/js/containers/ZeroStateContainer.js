'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'react-redux';
import { getConnectedChannelsLimit, getTotalConnectedChannels, portalIsTrial } from '../redux/selectors/gates';
import { getPortalId } from '../redux/selectors/index';
import { getUserCanConnectAccounts } from '../redux/selectors/user';
import { isComposerEmbed } from '../redux/selectors/embed';
import { NavMarker } from 'react-rhumb';
import { passPropsFor } from '../lib/utils';
import { PureComponent } from 'react';
import { push } from 'react-router-redux';
import { setConnectStep } from '../redux/actions/ui';
import ConnectButton from '../components/accounts/ConnectButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIList from 'UIComponents/list/UIList';

var mapStateToProps = function mapStateToProps(state) {
  return {
    connectedChannelsLimit: getConnectedChannelsLimit(state),
    isComposerEmbed: isComposerEmbed(state),
    isTrial: portalIsTrial(state),
    portalId: getPortalId(state),
    totalConnectedChannels: getTotalConnectedChannels(state),
    userCanConnectAccounts: getUserCanConnectAccounts(state)
  };
};

var mapDispatchToProps = {
  push: push,
  setConnectStep: setConnectStep
};

var ZeroState = /*#__PURE__*/function (_PureComponent) {
  _inherits(ZeroState, _PureComponent);

  function ZeroState() {
    _classCallCheck(this, ZeroState);

    return _possibleConstructorReturn(this, _getPrototypeOf(ZeroState).apply(this, arguments));
  }

  _createClass(ZeroState, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          mode = _this$props.mode,
          userCanConnectAccounts = _this$props.userCanConnectAccounts;
      var heading = I18n.text(this.props.mode ? "sui.accounts.zeroState." + mode + ".heading" : 'sui.accounts.zeroState.heading');
      var blurb = I18n.text(this.props.mode ? "sui.accounts.zeroState." + mode + ".blurb" : 'sui.accounts.zeroState.blurb');
      return /*#__PURE__*/_jsx(NavMarker, {
        name: "ZERO_STATE_LOADED",
        children: /*#__PURE__*/_jsxs("div", {
          className: "zero-state",
          children: [this.props.showIllustration && /*#__PURE__*/_jsx(UIIllustration, {
            name: "social",
            width: "100%"
          }), /*#__PURE__*/_jsx(H4, {
            children: heading
          }), /*#__PURE__*/_jsx("p", {
            children: blurb
          }), /*#__PURE__*/_jsx("div", {
            className: "connectionCtaList",
            children: /*#__PURE__*/_jsxs(UIList, {
              className: "p-all-0",
              styled: true,
              children: [/*#__PURE__*/_jsx("span", {
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: "sui.accounts.zeroState.bullet1"
                })
              }), /*#__PURE__*/_jsx("span", {
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: "sui.accounts.zeroState.bullet2"
                })
              }), /*#__PURE__*/_jsx("span", {
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: "sui.accounts.zeroState.bullet3"
                })
              }), /*#__PURE__*/_jsx("span", {
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: "sui.accounts.zeroState.bullet4"
                })
              })]
            })
          }), userCanConnectAccounts ? /*#__PURE__*/_jsx(ConnectButton, Object.assign({}, passPropsFor(this.props, ConnectButton))) : /*#__PURE__*/_jsx(UIAlert, {
            type: "info",
            className: "cannot-configure",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.onboarding.userCannotConfigure"
            })
          })]
        })
      });
    }
  }]);

  return ZeroState;
}(PureComponent);

ZeroState.displayName = 'ZeroState';
ZeroState.propTypes = Object.assign({}, ConnectButton.propTypes, {
  mode: PropTypes.oneOf(['streamEdit']),
  showIllustration: PropTypes.bool.isRequired
});
ZeroState.defaultProps = {
  showIllustration: true
};
export default connect(mapStateToProps, mapDispatchToProps)(ZeroState);