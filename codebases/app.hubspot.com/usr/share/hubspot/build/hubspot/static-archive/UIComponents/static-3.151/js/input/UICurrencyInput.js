'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import memoizeOne from 'react-utils/memoizeOne';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import omit from '../utils/underscore/omit';
import Controllable from '../decorators/Controllable';
import ShareInput from '../decorators/ShareInput';
import UIAbstractNumberInput from './abstract/UIAbstractNumberInput';
import UITextInput from './UITextInput';
var BLANK_REGEX = /^\s*$/;

var getCurrencySymbol = function getCurrencySymbol(currency, isNativeCurrency) {
  var symbolData = I18n.currencySymbols[currency];
  if (!symbolData) return '';
  return (isNativeCurrency ? symbolData.symbol_native : symbolData.symbol) || '';
};

var getCurrencyPrecision = function getCurrencyPrecision(currency, value) {
  var symbolData = I18n.currencySymbols[currency];

  if (!symbolData) {
    return 2;
  }

  return symbolData.alternative_decimal_digits && value % 1 !== 0 ? symbolData.alternative_decimal_digits : symbolData.decimal_digits;
};

var getCurrencyFormatter = function getCurrencyFormatter(currency, isNativeCurrency) {
  return function (value) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        precision = _ref.precision;

    if (value == null) return '';
    var currencyOptions = {
      unit: getCurrencySymbol(currency, isNativeCurrency),
      precision: precision || getCurrencyPrecision(currency, value)
    };
    return I18n.formatCurrency(value, currencyOptions);
  };
};

var getCurrencyParser = function getCurrencyParser(currency, isNativeCurrency) {
  return function (rawString) {
    var currencySymbol = getCurrencySymbol(currency, isNativeCurrency);
    var currencySymbolRegex = new RegExp("" + currencySymbol.replace(/\W/g, '\\$&'), 'g');
    var valueToParse = rawString.replace(currencySymbolRegex, '');
    return BLANK_REGEX.test(valueToParse) ? null : I18n.parseNumber(valueToParse);
  };
};

var UICurrencyInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(UICurrencyInput, _PureComponent);

  function UICurrencyInput(props) {
    var _this;

    _classCallCheck(this, UICurrencyInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UICurrencyInput).call(this, props));
    _this._getCurrencyFormatter = memoizeOne(getCurrencyFormatter);
    _this._getCurrencyParser = memoizeOne(getCurrencyParser);
    return _this;
  }

  _createClass(UICurrencyInput, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          currency = _this$props.currency,
          formatter = _this$props.formatter,
          isNativeCurrency = _this$props.isNativeCurrency,
          parser = _this$props.parser,
          precision = _this$props.precision,
          rest = _objectWithoutProperties(_this$props, ["currency", "formatter", "isNativeCurrency", "parser", "precision"]);

      return /*#__PURE__*/_jsx(UIAbstractNumberInput, Object.assign({}, rest, {
        formatter: formatter || currency && this._getCurrencyFormatter(currency, isNativeCurrency),
        parser: parser || currency && this._getCurrencyParser(currency, isNativeCurrency),
        precision: precision,
        children: function children(numberProps) {
          return /*#__PURE__*/_jsx(UITextInput, Object.assign({}, numberProps, {
            type: "text"
            /* Other `type` prop values are ignored; see #4178 */

          }));
        }
      }));
    }
  }]);

  return UICurrencyInput;
}(PureComponent);

UICurrencyInput.propTypes = Object.assign({}, omit(UITextInput.propTypes, ['type']), {}, omit(UIAbstractNumberInput.propTypes, ['children', 'currency', 'formatStyle']), {
  currency: PropTypes.string.isRequired,
  isNativeCurrency: PropTypes.bool.isRequired
});
UICurrencyInput.defaultProps = Object.assign({}, UITextInput.defaultProps, {}, UIAbstractNumberInput.defaultProps, {
  isNativeCurrency: true
});
UICurrencyInput.displayName = 'UICurrencyInput';
export default ShareInput(Controllable(UICurrencyInput));