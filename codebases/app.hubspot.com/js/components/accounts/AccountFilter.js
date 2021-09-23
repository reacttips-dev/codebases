'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { List, Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIDropdownSelect from 'UIComponents/dropdown/UIDropdownSelect';

var getOptionsFromAccounts = function getOptionsFromAccounts(accounts) {
  return accounts.map(function (account) {
    return ImmutableMap({
      value: account.accountSlug,
      text: account.getDisplayName()
    });
  }).toSet();
};

var AccountFilter = /*#__PURE__*/function (_Component) {
  _inherits(AccountFilter, _Component);

  function AccountFilter(props) {
    var _this;

    _classCallCheck(this, AccountFilter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AccountFilter).call(this, props));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(AccountFilter, [{
    key: "handleChange",
    value: function handleChange(evt) {
      var updateFilter = this.props.updateFilter;
      updateFilter(evt.target.value);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          accounts = _this$props.accounts,
          accountFilter = _this$props.accountFilter;
      var options = getOptionsFromAccounts(accounts);

      if (options.size > 1) {
        return /*#__PURE__*/_jsx(UIDropdownSelect, {
          defaultValue: accountFilter,
          onChange: this.handleChange,
          options: [{
            text: I18n.text('sui.accounts.filter.allAccounts'),
            value: ''
          }].concat(_toConsumableArray(options.toJS()))
        });
      }

      return /*#__PURE__*/_jsx("h4", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sui.accounts.header"
        })
      });
    }
  }]);

  return AccountFilter;
}(Component);

AccountFilter.propTypes = {
  accounts: PropTypes.instanceOf(List),
  accountFilter: PropTypes.string,
  updateFilter: PropTypes.func.isRequired
};
export { AccountFilter as default };