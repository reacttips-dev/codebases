'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import I18n from 'I18n';
import UIIcon from 'UIComponents/icon/UIIcon';
import UISelectableBox from 'UIComponents/button/UISelectableBox';
import UIRibbon from 'UIComponents/ribbon/UIRibbon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import Small from 'UIComponents/elements/Small';
import { getAccountDisplayName, getAccountIcon, getAccountColor, ACCOUNT_TYPES } from '../../lib/constants';
import { accountTypeProp } from '../../lib/propTypes';

var AccountTypeButton = /*#__PURE__*/function (_PureComponent) {
  _inherits(AccountTypeButton, _PureComponent);

  function AccountTypeButton() {
    _classCallCheck(this, AccountTypeButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(AccountTypeButton).apply(this, arguments));
  }

  _createClass(AccountTypeButton, [{
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          accountSlug = _this$props.accountSlug,
          channelsConnectedCount = _this$props.channelsConnectedCount,
          tooltipText = _this$props.tooltipText;
      var showInstagram = accountSlug === ACCOUNT_TYPES.facebook && !this.props.singleNetwork;
      var label = showInstagram ? I18n.text('sui.accounts.connect.facebookAndInstagram') : getAccountDisplayName(accountSlug);

      if (accountSlug === ACCOUNT_TYPES.youtube) {
        label = I18n.text('sui.accounts.connect.youtubeReports');
      }

      var iconSize = showInstagram ? 28 : 36;
      var iconName = getAccountIcon(accountSlug, true);

      var buttonEl = /*#__PURE__*/_jsxs(UISelectableBox, {
        className: "account connect-account-button network-" + accountSlug + (showInstagram ? " instagram" : ""),
        selected: false,
        padded: false,
        block: true,
        onSelectedChange: function onSelectedChange() {
          var _this$props2;

          for (var _len = arguments.length, partialArgs = new Array(_len), _key = 0; _key < _len; _key++) {
            partialArgs[_key] = arguments[_key];
          }

          return (_this$props2 = _this.props).onClick.apply(_this$props2, [accountSlug].concat(partialArgs));
        },
        children: [/*#__PURE__*/_jsxs("div", {
          className: "wrapper",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "icon-holder",
            children: [/*#__PURE__*/_jsx(UIIcon, {
              className: "icon " + accountSlug,
              style: {
                color: getAccountColor(accountSlug)
              },
              name: iconName,
              size: iconSize
            }), showInstagram && /*#__PURE__*/_jsx(UIIcon, {
              className: "icon instagram",
              style: {
                color: getAccountColor(ACCOUNT_TYPES.instagram)
              },
              name: getAccountIcon(ACCOUNT_TYPES.instagram),
              size: iconSize
            })]
          }), /*#__PURE__*/_jsx("span", {
            className: "label",
            children: label
          }), channelsConnectedCount > 0 && tooltipText && /*#__PURE__*/_jsx(UITooltip, {
            title: tooltipText,
            children: /*#__PURE__*/_jsx(Small, {
              className: "connected",
              children: I18n.text('sui.onboarding.connect.accounts', {
                count: channelsConnectedCount
              })
            })
          })]
        }), accountSlug === ACCOUNT_TYPES.youtube && /*#__PURE__*/_jsx(UIRibbon, {
          use: "new",
          children: "New"
        })]
      });

      if (this.props.accountSlug === ACCOUNT_TYPES.youtube) {
        return /*#__PURE__*/_jsx(UITooltip, {
          title: I18n.text('sui.accounts.youtube.connectTooltip'),
          children: buttonEl
        });
      }

      return buttonEl;
    }
  }]);

  return AccountTypeButton;
}(PureComponent);

AccountTypeButton.propTypes = {
  accountSlug: accountTypeProp,
  singleNetwork: PropTypes.bool,
  channelsConnectedCount: PropTypes.number,
  tooltipText: PropTypes.string,
  onClick: PropTypes.func.isRequired
};
export { AccountTypeButton as default };