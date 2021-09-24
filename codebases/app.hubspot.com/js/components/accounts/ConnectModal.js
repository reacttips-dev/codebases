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
import I18n from 'I18n';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import { logBreadcrumb, passPropsFor } from '../../lib/utils';
import AccountTypeButton from './AccountTypeButton';
import { accountTypeProp, setProp } from '../../lib/propTypes';
import SocialContext from '../app/SocialContext';
import H2 from 'UIComponents/elements/headings/H2';

var ConnectModal = /*#__PURE__*/function (_Component) {
  _inherits(ConnectModal, _Component);

  function ConnectModal() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ConnectModal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ConnectModal)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onClickNetwork = function (accountSlug) {
      logBreadcrumb("click connect button - " + accountSlug);

      _this.context.trackInteraction('connect button', {
        network: accountSlug
      });

      _this.props.createAccount(accountSlug);

      _this.props.onSelectNetwork(accountSlug);
    };

    _this.handleClose = function () {
      _this.context.trackInteraction('close connect modal');

      _this.props.onClose();
    };

    _this.renderNetwork = function (accountSlug) {
      return /*#__PURE__*/_jsx(UIGridItem, {
        size: _this.props.focusedAccountType ? 12 : 6,
        children: /*#__PURE__*/_jsx(AccountTypeButton, Object.assign({}, passPropsFor(_this.props, AccountTypeButton), {
          accountSlug: accountSlug,
          singleNetwork: Boolean(_this.props.focusedAccountType),
          onClick: function onClick() {
            var _this2;

            for (var _len2 = arguments.length, partialArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              partialArgs[_key2] = arguments[_key2];
            }

            return (_this2 = _this).onClickNetwork.apply(_this2, [accountSlug].concat(partialArgs));
          }
        }))
      }, accountSlug);
    };

    return _this;
  }

  _createClass(ConnectModal, [{
    key: "renderAccountsModal",
    value: function renderAccountsModal() {
      return this.props.connectableAccountTypes.map(this.renderNetwork);
    }
  }, {
    key: "render",
    value: function render() {
      var focusedAccountType = this.props.focusedAccountType;

      if (!this.props.isOpen) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UIModal, {
        className: "connect-account-modal",
        width: 750,
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: this.handleClose
          }), /*#__PURE__*/_jsx(H2, {
            children: I18n.text('sui.accounts.connect.header')
          })]
        }), /*#__PURE__*/_jsx(UIDialogBody, {
          children: /*#__PURE__*/_jsx(UIGrid, {
            children: focusedAccountType ? this.renderNetwork(focusedAccountType) : this.renderAccountsModal()
          })
        })]
      });
    }
  }]);

  return ConnectModal;
}(Component);

ConnectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  connectableAccountTypes: setProp.isRequired,
  focusedAccountType: accountTypeProp,
  onSelectNetwork: PropTypes.func.isRequired,
  createAccount: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
ConnectModal.contextType = SocialContext;
export { ConnectModal as default };