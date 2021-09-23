'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedCurrency from 'I18n/components/FormattedCurrency';
import { isLoading, isError } from 'reference-resolvers/utils';
import { MULTI_CURRENCY_INFORMATION } from 'reference-resolvers/constants/ReferenceObjectTypes';
import MultiCurrencyInformationResolver from 'reference-resolvers/resolvers/MultiCurrencyInformationResolver';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import PropTypes from 'prop-types';
import { Component } from 'react';
import * as ReferenceTypes from 'reference-resolvers/schema/ReferenceTypes';

var Currency = /*#__PURE__*/function (_Component) {
  _inherits(Currency, _Component);

  function Currency() {
    _classCallCheck(this, Currency);

    return _possibleConstructorReturn(this, _getPrototypeOf(Currency).apply(this, arguments));
  }

  _createClass(Currency, [{
    key: "getShouldShowPlaceholder",
    value: function getShouldShowPlaceholder() {
      var _this$props = this.props,
          currencyCode = _this$props.currencyCode,
          defaultCurrencyCode = _this$props.defaultCurrencyCode,
          value = _this$props.value;
      return !value && value !== 0 || !currencyCode && isLoading(defaultCurrencyCode);
    }
  }, {
    key: "getCurrencyCode",
    value: function getCurrencyCode() {
      var _this$props2 = this.props,
          currencyCode = _this$props2.currencyCode,
          defaultCurrencyCode = _this$props2.defaultCurrencyCode;

      if (currencyCode) {
        return currencyCode;
      }

      return isError(defaultCurrencyCode) ? defaultCurrencyCode : defaultCurrencyCode.label;
    }
  }, {
    key: "getCurrencyValue",
    value: function getCurrencyValue() {
      var value = this.props.value; // we assume that whatever value we're getting from the back-end is in the
      // format of numbers that can be parsed by js, i.e. they have no commas and
      // only one decimal (in regex terms /[\d+](\.[\d+])?/)
      // api change made to enforce this here: https://developers.hubspot.com/changelog/upcoming-api-number-value-changes

      return isNaN(value) ? null : +value;
    }
  }, {
    key: "renderCurrencyValue",
    value: function renderCurrencyValue() {
      var simplifyCurrency = this.props.simplifyCurrency;
      var currencyCode = this.getCurrencyCode();
      var currencyValue = this.getCurrencyValue();

      if (isError(currencyCode)) {
        return /*#__PURE__*/_jsx(FormattedCurrency, {
          value: currencyValue // Intentionally hide the currency symbol when
          // we have an error loading the currency
          ,
          unit: ""
        });
      }

      return /*#__PURE__*/_jsx(FormattedCurrency, {
        currencyCode: currencyCode,
        "data-selenium-test": "currency-component-loaded",
        simplifyCurrency: simplifyCurrency,
        value: currencyValue
      });
    }
  }, {
    key: "render",
    value: function render() {
      var showPlaceholder = this.getShouldShowPlaceholder();
      return /*#__PURE__*/_jsx("span", {
        className: this.props.className,
        "data-selenium-test": showPlaceholder ? undefined : 'currency-component-loaded',
        children: showPlaceholder ? this.props.placeholder : this.renderCurrencyValue()
      });
    }
  }]);

  return Currency;
}(Component);

Currency.propTypes = {
  className: PropTypes.string,
  currencyCode: PropTypes.string,
  defaultCurrencyCode: ReferenceTypes.byId,
  placeholder: PropTypes.string,
  simplifyCurrency: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
Currency.defaultProps = {
  placeholder: '-',
  simplifyCurrency: true
};

var mapResolversToProps = function mapResolversToProps(resolvers) {
  return {
    defaultCurrencyCode: resolvers[MULTI_CURRENCY_INFORMATION].byId('default')
  };
};

var WrappedCurrency = ResolveReferences(mapResolversToProps)(Currency); // need to provide here in case the resolvers aren't provided outside of this
// more info in post-revert PR after problem was caused by not providing the respolvers here: https://git.hubteam.com/HubSpot/customer-data-objects-ui-components/pull/133

export default ProvideReferenceResolvers(_defineProperty({}, MULTI_CURRENCY_INFORMATION, MultiCurrencyInformationResolver), ResolveReferences(mapResolversToProps)(WrappedCurrency), {
  mergeResolvers: true
});
export { Currency as WrappedComponent };