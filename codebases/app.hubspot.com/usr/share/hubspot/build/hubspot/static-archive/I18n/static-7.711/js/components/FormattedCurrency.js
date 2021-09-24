'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import formatCurrencyWithCode from '../utils/formatCurrencyWithCode';
export default createReactClass({
  displayName: "FormattedCurrency",
  propTypes: {
    abbreviate: PropTypes.bool,
    abbreviateThreshold: PropTypes.number,
    currencyCode: PropTypes.string,
    precision: PropTypes.number,
    simplifyCurrency: PropTypes.bool,
    stripInsignificantZeros: PropTypes.bool,
    unit: PropTypes.string,
    useCurrencyCode: PropTypes.bool,
    value: PropTypes.number.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      stripInsignificantZeros: false,
      simplifyCurrency: false
    };
  },
  render: function render() {
    var _this$props = this.props,
        abbreviate = _this$props.abbreviate,
        abbreviateThreshold = _this$props.abbreviateThreshold,
        value = _this$props.value,
        simplifyCurrency = _this$props.simplifyCurrency,
        stripInsignificantZeros = _this$props.stripInsignificantZeros,
        useCurrencyCode = _this$props.useCurrencyCode,
        options = _objectWithoutProperties(_this$props, ["abbreviate", "abbreviateThreshold", "value", "simplifyCurrency", "stripInsignificantZeros", "useCurrencyCode"]);

    if (simplifyCurrency && value % 1 === 0) {
      options.precision = 0;
    }

    if (useCurrencyCode) {
      options.unit = '';
      options.useCurrencyCode = true;
    }

    if (stripInsignificantZeros === false) {
      options.strip_insignificant_zeros = false;
    } else {
      options.strip_insignificant_zeros = true;
    }

    var wrapperAttributes = {};

    if (abbreviate && (typeof abbreviateThreshold !== 'number' || typeof abbreviateThreshold === 'number' && value >= abbreviateThreshold)) {
      wrapperAttributes.title = I18n.formatCurrency(value, options);
      options.abbreviate = true;
      options.precision = 0;
    }

    var formattedNumber = I18n.formatCurrency(value, options);
    var numberToRender = useCurrencyCode ? formatCurrencyWithCode(formattedNumber, options.currencyCode) : formattedNumber;
    return /*#__PURE__*/_jsx("span", Object.assign({}, wrapperAttributes, {
      children: numberToRender
    }));
  }
});