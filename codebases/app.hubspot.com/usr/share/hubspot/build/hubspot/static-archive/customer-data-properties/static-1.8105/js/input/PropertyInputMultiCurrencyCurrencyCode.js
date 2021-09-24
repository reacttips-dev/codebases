'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import MultiCurrencyInformationResolver from 'reference-resolvers/resolvers/MultiCurrencyInformationResolver';
import { MULTI_CURRENCY_INFORMATION } from 'reference-resolvers/constants/ReferenceObjectTypes';
import CurrencySelect from 'ui-addon-i18n/components/CurrencySelect';
import { List, Seq } from 'immutable';
import { isResolved } from 'reference-resolvers/utils';
import getIn from 'transmute/getIn';

var getCurrencyCode = function getCurrencyCode(record) {
  return record.id;
};

var getIsCurrencyVisible = function getIsCurrencyVisible(record) {
  return getIn(['referencedObject', 'visible'], record) === true;
};

export var PropertyInputMultiCurrencyCurrencyCode = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputMultiCurrencyCurrencyCode, _Component);

  function PropertyInputMultiCurrencyCurrencyCode() {
    _classCallCheck(this, PropertyInputMultiCurrencyCurrencyCode);

    return _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputMultiCurrencyCurrencyCode).apply(this, arguments));
  }

  _createClass(PropertyInputMultiCurrencyCurrencyCode, [{
    key: "focus",
    value: function focus() {
      return this.refs.input.focus();
    }
  }, {
    key: "getCurrencies",
    value: function getCurrencies() {
      var currencyCodes = this.props.currencyCodes;

      if (isResolved(currencyCodes)) {
        return List(currencyCodes);
      }

      return List();
    }
  }, {
    key: "getPossibleCurrencies",
    value: function getPossibleCurrencies() {
      var _this = this;

      var currencies = this.getCurrencies();
      return currencies.filter(function (currency) {
        return getIsCurrencyVisible(currency) || getCurrencyCode(currency) === _this.props.value;
      }).map(getCurrencyCode);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          autoFocus = _this$props.autoFocus,
          className = _this$props.className,
          readOnly = _this$props.readOnly,
          disabled = _this$props.disabled,
          currencyCodes = _this$props.currencyCodes,
          onChange = _this$props.onChange,
          value = _this$props.value;
      var possibleCurrencies = this.getPossibleCurrencies(currencyCodes);
      var displayValue = value ? value.toString() : undefined;
      return /*#__PURE__*/_jsx(CurrencySelect, {
        autoFocus: autoFocus,
        className: className,
        readOnly: readOnly,
        disabled: disabled,
        currenciesFilter: function currenciesFilter(currencyOption) {
          return possibleCurrencies.includes(currencyOption.value);
        },
        currencyStyle: "long",
        onChange: onChange,
        ref: "input",
        value: displayValue,
        "data-selenium-test": this.props['data-selenium-test']
      });
    }
  }]);

  return PropertyInputMultiCurrencyCurrencyCode;
}(Component);
PropertyInputMultiCurrencyCurrencyCode.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  currencyCodes: PropTypes.instanceOf(Seq),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  'data-selenium-test': PropTypes.string
};
var getCurrencyCodes = ResolveReferences(function (resolvers) {
  return {
    currencyCodes: resolvers[MULTI_CURRENCY_INFORMATION].all()
  };
});
export default ProvideReferenceResolvers(_defineProperty({}, MULTI_CURRENCY_INFORMATION, MultiCurrencyInformationResolver), getCurrencyCodes(PropertyInputMultiCurrencyCurrencyCode, {
  forwardRef: true
}), {
  forwardRef: true,
  mergeResolvers: true
});