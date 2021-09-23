'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import I18n from 'I18n';
import { isNaN } from '../../utils/underscore';
import PropTypes from 'prop-types';
import { Component } from 'react';
import devLogger from 'react-utils/devLogger';
import SyntheticEvent from '../../core/SyntheticEvent';
import { callIfPossible } from '../../core/Functions';
var BLANK_REGEX = /^\s*$/;
var MINUS_SIGN = "\u2212";
var INVALID_CHARS_REGEX = new RegExp("[^0-9.," + MINUS_SIGN + "-]", 'g');
var NUMBER_TYPES = {
  DECIMAL: 'decimal',
  PERCENTAGE: 'percentage'
};

var formatPercentage = function formatPercentage(value, _ref) {
  var precision = _ref.precision;
  return I18n.formatPercentage(value, {
    precision: value % 1 === 0 ? 0 : precision || 2
  });
};

var getParsedValue = function getParsedValue(rawValue, parser) {
  if (parser) {
    var parserResult = parser(rawValue);

    if (parserResult != null && typeof parserResult !== 'number') {
      if (process.env.NODE_ENV !== 'production') {
        devLogger.warn({
          message: "UIAbstractNumberInput: Expected `parser(value)` to return a number or null, but " + ("it returned `" + parserResult + "`."),
          key: 'UIAbstractNumberInput: bad parser result'
        });
      }
    } else {
      return parserResult;
    }
  }

  var valueToParse = String(rawValue); // Ignore extraneous characters

  valueToParse = valueToParse.replace(INVALID_CHARS_REGEX, '');
  var parsedValue = BLANK_REGEX.test(valueToParse) ? null : I18n.parseNumber(valueToParse);
  return parsedValue;
};

var getValueIsValid = function getValueIsValid(value) {
  return value == null || value === '' || !isNaN(I18n.parseNumber(value));
};

var getFormattedNumber = function getFormattedNumber(value, formatStyle, formatter, formatterOptions) {
  if (formatter) {
    var formatterResult = formatter(value, formatterOptions);

    if (typeof formatterResult !== 'string') {
      if (process.env.NODE_ENV !== 'production') {
        devLogger.warn({
          message: "UIAbstractNumberInput: Expected `formatter(value)` to return a string, but " + ("it returned `" + formatterResult + "`."),
          key: 'UIAbstractNumberInput: bad formatter result'
        });
      }
    } else {
      return formatterResult;
    }
  }

  if (value == null || value === '') {
    return '';
  }

  if (!getValueIsValid(value)) {
    return value;
  }

  if (formatStyle === NUMBER_TYPES.PERCENTAGE) {
    return formatPercentage(value, formatterOptions);
  }

  return I18n.formatNumber(value, formatterOptions);
};

var getStateOnValueReset = function getStateOnValueReset(value, formatStyle, formatter, formatterOptions) {
  var isValid = getValueIsValid(value);
  return {
    isValid: isValid,
    lastValidValue: isValid ? value : null,
    displayedValue: getFormattedNumber(value, formatStyle, formatter, formatterOptions)
  };
};

var UIAbstractNumberInput = /*#__PURE__*/function (_Component) {
  _inherits(UIAbstractNumberInput, _Component);

  function UIAbstractNumberInput(props) {
    var _this;

    _classCallCheck(this, UIAbstractNumberInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIAbstractNumberInput).call(this, props));

    _this.handleChange = function (evt) {
      _this.triggerOnChange(evt.target.value);
    };

    _this.triggerOnChange = function (rawValue) {
      // Trigger onChange with the numeric value, not the raw string
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          value = _this$props.value,
          min = _this$props.min,
          max = _this$props.max,
          parser = _this$props.parser;

      _this.setState({
        displayedValue: rawValue
      }); // Prevent formatting while the user is typing


      _this.isTyping = true;
      var parsedValue = getParsedValue(rawValue, parser);

      if (value != null && parsedValue == null) {
        callIfPossible(onChange, SyntheticEvent(null));
        return;
      }

      if (parsedValue !== value && !isNaN(parsedValue)) {
        var fencedMin = min == null ? parsedValue : Math.max(parsedValue, min);
        var fencedValue = max == null ? fencedMin : Math.min(fencedMin, max);
        callIfPossible(onChange, SyntheticEvent(fencedValue));
      }
    };

    _this.handleBlur = function (evt) {
      var onBlur = _this.props.onBlur;

      _this.handleConfirmedInput();

      _this.isTyping = false;
      callIfPossible(onBlur, evt);
    };

    _this.handleFocus = function (evt) {
      var onFocus = _this.props.onFocus; // If displayedValue is invalid, clear it on focus

      var isValid = _this.state.isValid;

      if (!isValid) {
        _this.setState({
          isValid: true,
          displayedValue: ''
        });
      }

      callIfPossible(onFocus, evt);
    };

    _this.handleConfirmedInput = function () {
      // Format whatever the user typed for display (e.g. "1234" -> "1,234")
      var _this$props2 = _this.props,
          formatStyle = _this$props2.formatStyle,
          formatter = _this$props2.formatter,
          precision = _this$props2.precision,
          value = _this$props2.value;
      var isValid = getValueIsValid(value);
      var formattedNumber = getFormattedNumber(value, formatStyle, formatter, {
        precision: precision
      }); // call onChange if the formatter has changed the value

      if (_this.state.displayedValue !== formattedNumber) {
        _this.triggerOnChange(formattedNumber);
      }

      _this.setState({
        isValid: isValid,
        displayedValue: formattedNumber
      });
    };

    _this.handleKeyUp = function (evt) {
      var _this$props3 = _this.props,
          onChange = _this$props3.onChange,
          onKeyUp = _this$props3.onKeyUp,
          value = _this$props3.value;
      var lastValidValue = _this.state.lastValidValue;
      var key = evt.key; // If ESC is pressed, reset to lastValidValue

      if (key === 'Escape' && lastValidValue !== value) {
        callIfPossible(onChange, SyntheticEvent(lastValidValue));
        _this.escKeyUpTriggered = true;
      } // If Enter or Up/Down is pressed, update the displayed value


      if (key === 'Enter' || key === 'ArrowUp' || key === 'ArrowDown') {
        _this.handleConfirmedInput();
      }

      callIfPossible(onKeyUp, evt);
    };

    var _value = props.value,
        _formatStyle = props.formatStyle,
        _formatter = props.formatter,
        _precision = props.precision;
    _this.state = getStateOnValueReset(_value, _formatStyle, _formatter, {
      precision: _precision
    });
    return _this;
  }

  _createClass(UIAbstractNumberInput, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var _this$props4 = this.props,
          value = _this$props4.value,
          formatStyle = _this$props4.formatStyle,
          formatter = _this$props4.formatter; // Uses this flag to determine if the last change was triggered by the `ESC` key.
      // This logic is separate from the following logic since value and nextProps.value
      // could be equal, and you would still want this reset to trigger. (1000 vs 1,000)

      if (this.escKeyUpTriggered) {
        this.setState(getStateOnValueReset(nextProps.value, nextProps.formatStyle, nextProps.formatter, {
          precision: nextProps.precision
        }));
        this.escKeyUpTriggered = false;
        return;
      } // Ignore changes from one invalid value (NaN) to another


      var valueChanged = value !== nextProps.value && !(isNaN(value) && isNaN(nextProps.value));
      var formatStyleChanged = formatStyle !== nextProps.formatStyle;
      var formatterChanged = formatter !== nextProps.formatter;

      if (valueChanged || formatStyleChanged || formatterChanged) {
        if (!this.isTyping) {
          this.setState(getStateOnValueReset(nextProps.value, nextProps.formatStyle, nextProps.formatter, {
            precision: nextProps.precision
          }));
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          children = _this$props5.children,
          error = _this$props5.error,
          __formatter = _this$props5.formatter,
          __parser = _this$props5.parser,
          __onChange = _this$props5.onChange,
          __value = _this$props5.value,
          __formatStyle = _this$props5.formatStyle,
          rest = _objectWithoutProperties(_this$props5, ["children", "error", "formatter", "parser", "onChange", "value", "formatStyle"]);

      return children(Object.assign({}, rest, {
        'aria-invalid': typeof error === 'boolean' ? error : !this.state.isValid,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        onFocus: this.handleFocus,
        onKeyUp: this.handleKeyUp,
        value: this.state.displayedValue
      }));
    }
  }]);

  return UIAbstractNumberInput;
}(Component);

export { UIAbstractNumberInput as default };
UIAbstractNumberInput.propTypes = {
  children: PropTypes.func.isRequired,
  error: PropTypes.bool,
  formatStyle: PropTypes.oneOf(Object.keys(NUMBER_TYPES).map(function (k) {
    return NUMBER_TYPES[k];
  })),
  formatter: PropTypes.func,
  parser: PropTypes.func,
  precision: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number
};
UIAbstractNumberInput.defaultProps = {
  error: undefined,
  // needed to override UITextInput's default
  formatStyle: undefined
};
UIAbstractNumberInput.displayName = 'UIAbstractNumberInput';