'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import formatCurrencyWithCode from '../utils/formatCurrencyWithCode';
import NumberTypes from '../constants/NumberTypes';
export default createReactClass({
  displayName: "FormattedNumber",
  propTypes: {
    abbreviate: PropTypes.bool,
    abbreviateThreshold: PropTypes.number,
    currencyCode: PropTypes.string,
    precision: PropTypes.number,
    simplifyCurrency: PropTypes.bool,
    stripInsignificantZeros: PropTypes.bool,
    style: PropTypes.oneOf(Object.keys(NumberTypes).map(function (key) {
      return NumberTypes[key];
    })),
    unit: PropTypes.string,
    useCurrencyCode: PropTypes.bool,
    value: PropTypes.number.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      simplifyCurrency: false,
      stripInsignificantZeros: true,
      style: NumberTypes.DECIMAL
    };
  },
  render: function render() {
    var _NUMBER_FORMATTERS;

    var NUMBER_FORMATTERS = (_NUMBER_FORMATTERS = {}, _defineProperty(_NUMBER_FORMATTERS, NumberTypes.DECIMAL, I18n.formatNumber), _defineProperty(_NUMBER_FORMATTERS, NumberTypes.CURRENCY, I18n.formatCurrency), _defineProperty(_NUMBER_FORMATTERS, NumberTypes.PERCENTAGE, I18n.formatPercentage), _NUMBER_FORMATTERS);

    var _this$props = this.props,
        abbreviate = _this$props.abbreviate,
        abbreviateThreshold = _this$props.abbreviateThreshold,
        value = _this$props.value,
        style = _this$props.style,
        simplifyCurrency = _this$props.simplifyCurrency,
        stripInsignificantZeros = _this$props.stripInsignificantZeros,
        useCurrencyCode = _this$props.useCurrencyCode,
        options = _objectWithoutProperties(_this$props, ["abbreviate", "abbreviateThreshold", "value", "style", "simplifyCurrency", "stripInsignificantZeros", "useCurrencyCode"]);

    var numberFormatter = NUMBER_FORMATTERS[style];

    if (style === NumberTypes.CURRENCY) {
      console.warn('Using FormattedNumber with the currency style is deprecated. Please use FormattedCurrency instead.');
    }

    if (simplifyCurrency && value % 1 === 0) {
      options.precision = 0;
    }

    if (useCurrencyCode) {
      options.unit = '';
    }

    if (stripInsignificantZeros === false) {
      options.strip_insignificant_zeros = false;
    } else {
      options.strip_insignificant_zeros = true;
    }

    var wrapperAttributes = {};

    if (abbreviate && (typeof abbreviateThreshold !== 'number' || typeof abbreviateThreshold === 'number' && value >= abbreviateThreshold)) {
      wrapperAttributes.title = numberFormatter(value, options);
      options.abbreviate = true;
      options.precision = 0;
    }

    var formattedNumber = numberFormatter(value, options);
    var numberToRender = useCurrencyCode ? formatCurrencyWithCode(formattedNumber, options.currencyCode) : formattedNumber;
    return /*#__PURE__*/_jsx("span", Object.assign({}, wrapperAttributes, {
      children: numberToRender
    }));
  }
});