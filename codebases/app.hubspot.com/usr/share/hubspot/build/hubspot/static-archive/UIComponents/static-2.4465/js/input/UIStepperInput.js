'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import UINumberInput from './UINumberInput';
import UICurrencyInput from './UICurrencyInput';
import UIButtonGroup from '../button/UIButtonGroup';
import UIButton from '../button/UIButton';
import UIIcon from '../icon/UIIcon';
import UITooltip from '../tooltip/UITooltip';
import Controllable from '../decorators/Controllable';
import { CALYPSO } from 'HubStyleTokens/colors';
import SyntheticEvent from '../core/SyntheticEvent';
import { callIfPossible } from '../core/Functions';
import classNames from 'classnames';
import { repeatUntilEventOnElement } from '../utils/Dom';
import { isLeftClick } from '../utils/DomEvents';
import ShareInput from '../decorators/ShareInput';
import { hidden } from '../utils/propTypes/decorators';

var getBaseValue = function getBaseValue(value, placeholderValue) {
  return value != null ? value : placeholderValue;
};

var isIncrementDisabled = function isIncrementDisabled(stepSize, baseValue, max, disabled) {
  if (disabled) return true;
  if (max == null) return false;
  return !(baseValue + stepSize <= max);
};

var isDecrementDisabled = function isDecrementDisabled(stepSize, baseValue, min, disabled) {
  if (disabled) return true;
  if (min == null) return false;
  return !(baseValue - stepSize >= min);
};

var UIStepperInput = /*#__PURE__*/function (_Component) {
  _inherits(UIStepperInput, _Component);

  function UIStepperInput() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIStepperInput);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIStepperInput)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleStep = function (step) {
      var _this$props = _this.props,
          disabled = _this$props.disabled,
          inputRef = _this$props.inputRef,
          max = _this$props.max,
          min = _this$props.min,
          onChange = _this$props.onChange,
          onStep = _this$props.onStep,
          placeholderValue = _this$props.placeholderValue,
          readOnly = _this$props.readOnly,
          value = _this$props.value;
      if (readOnly || disabled) return;
      if (inputRef.current) inputRef.current.focus();
      var newValue = getBaseValue(value, placeholderValue) + step;
      var fencedMin = min == null ? newValue : Math.max(newValue, min);
      var fencedValue = max == null ? fencedMin : Math.min(fencedMin, max); // "15 digits of precision ought to be enough for anyone" --Bill Gates

      var roundedValue = +parseFloat(fencedValue).toPrecision(15);
      onChange(SyntheticEvent(roundedValue));
      callIfPossible(onStep, SyntheticEvent(roundedValue));
    };

    _this.increment = function () {
      if (_this._freeze) return;
      var stepSize = _this.props.stepSize;

      _this.handleStep(stepSize);
    };

    _this.decrement = function () {
      if (_this._freeze) return;
      var stepSize = _this.props.stepSize;

      _this.handleStep(-stepSize);
    };

    _this.handleUpArrowMouseDown = function (evt) {
      if (isLeftClick(evt)) {
        _this.startMouseHold('increment');
      }
    };

    _this.handleDownArrowMouseDown = function (evt) {
      if (isLeftClick(evt)) {
        _this.startMouseHold('decrement');
      }
    };

    _this.handleArrowMouseUp = function () {
      // Prevent click event from triggering an extra increment/decrement after click-and-hold
      if (_this._repeatHandle && _this._repeatHandle.count >= 1) {
        _this._freeze = true;
        setTimeout(function () {
          _this._freeze = 0;
        }, 0);
      }

      _this._repeatHandle = null;
    };

    _this.handleKeyDown = function (evt) {
      var onKeyDown = _this.props.onKeyDown;
      var key = evt.key;

      if (key === 'ArrowUp') {
        evt.preventDefault();

        _this.increment();
      } else if (key === 'ArrowDown') {
        evt.preventDefault();

        _this.decrement();
      }

      callIfPossible(onKeyDown, evt);
    };

    return _this;
  }

  _createClass(UIStepperInput, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this._repeatHandle != null) {
        this._repeatHandle.stop();
      }
    }
  }, {
    key: "startMouseHold",
    value: function startMouseHold(action) {
      this._repeatHandle = repeatUntilEventOnElement(this[action], 100, document.documentElement, ['mouseup']);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          className = _this$props2.className,
          currency = _this$props2.currency,
          disabled = _this$props2.disabled,
          disabledMaxButtonTooltip = _this$props2.disabledMaxButtonTooltip,
          disabledMaxButtonTooltipProps = _this$props2.disabledMaxButtonTooltipProps,
          disabledMinButtonTooltip = _this$props2.disabledMinButtonTooltip,
          disabledMinButtonTooltipProps = _this$props2.disabledMinButtonTooltipProps,
          inputClassName = _this$props2.inputClassName,
          max = _this$props2.max,
          min = _this$props2.min,
          placeholderValue = _this$props2.placeholderValue,
          readOnly = _this$props2.readOnly,
          stepSize = _this$props2.stepSize,
          value = _this$props2.value,
          rest = _objectWithoutProperties(_this$props2, ["className", "currency", "disabled", "disabledMaxButtonTooltip", "disabledMaxButtonTooltipProps", "disabledMinButtonTooltip", "disabledMinButtonTooltipProps", "inputClassName", "max", "min", "placeholderValue", "readOnly", "stepSize", "value"]);

      var classes = classNames('private-stepper-input', className);
      var inputClasses = classNames('private-stepper-input--input', inputClassName);
      var baseValue = getBaseValue(value, placeholderValue);
      var incrementDisabled = isIncrementDisabled(stepSize, baseValue, max, disabled);
      var decrementDisabled = isDecrementDisabled(stepSize, baseValue, min, disabled);
      var Input = currency ? UICurrencyInput : UINumberInput;
      return /*#__PURE__*/_jsxs("div", {
        className: classes,
        children: [/*#__PURE__*/_jsx(Input, Object.assign({}, rest, {
          "aria-valuemax": max,
          "aria-valuemin": min,
          "aria-valuenow": value,
          currency: currency,
          disabled: disabled,
          className: inputClasses,
          max: max,
          min: min,
          onKeyDown: this.handleKeyDown,
          readOnly: readOnly,
          role: "spinbutton",
          value: value
        })), readOnly ? null : /*#__PURE__*/_jsxs(UIButtonGroup, {
          className: "private-stepper-input--buttons",
          orientation: "vertical",
          children: [/*#__PURE__*/_jsx(UITooltip, Object.assign({
            autoPlacement: "vert",
            placement: "top left"
          }, disabledMaxButtonTooltipProps, {
            title: disabledMaxButtonTooltip,
            disabled: !incrementDisabled,
            children: /*#__PURE__*/_jsx(UIButton, {
              "aria-hidden": true,
              disabled: incrementDisabled,
              onClick: this.increment,
              onMouseDown: this.handleUpArrowMouseDown,
              onMouseUp: this.handleArrowMouseUp,
              "data-action": "increment",
              use: "tertiary-light",
              size: "sm",
              tabIndex: -1,
              children: /*#__PURE__*/_jsx(UIIcon, {
                name: "up",
                color: !incrementDisabled ? CALYPSO : null
              })
            })
          })), /*#__PURE__*/_jsx(UITooltip, Object.assign({
            autoPlacement: "vert",
            placement: "top left"
          }, disabledMinButtonTooltipProps, {
            title: disabledMinButtonTooltip,
            disabled: !decrementDisabled,
            children: /*#__PURE__*/_jsx(UIButton, {
              "aria-hidden": true,
              disabled: decrementDisabled,
              onClick: this.decrement,
              onMouseDown: this.handleDownArrowMouseDown,
              onMouseUp: this.handleArrowMouseUp,
              "data-action": "decrement",
              use: "tertiary-light",
              tabIndex: -1,
              size: "sm",
              children: /*#__PURE__*/_jsx(UIIcon, {
                name: "down",
                color: !decrementDisabled ? CALYPSO : null
              })
            })
          }))]
        })]
      });
    }
  }]);

  return UIStepperInput;
}(Component);

UIStepperInput.propTypes = Object.assign({}, UINumberInput.propTypes, {
  disabledMaxButtonTooltip: PropTypes.node,
  disabledMinButtonTooltip: PropTypes.node,
  disabledMaxButtonTooltipProps: PropTypes.object,
  disabledMinButtonTooltipProps: PropTypes.object,
  placeholderValue: hidden(PropTypes.number.isRequired),
  value: PropTypes.number,
  stepSize: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onStep: PropTypes.func,
  inputClassName: PropTypes.string
});
UIStepperInput.defaultProps = Object.assign({}, UINumberInput.defaultProps, {
  disabledMaxButtonTooltipProps: {},
  disabledMinButtonTooltipProps: {},
  placeholderValue: 0,
  stepSize: 1
});
UIStepperInput.displayName = 'UIStepperInput';
export default ShareInput(Controllable(UIStepperInput));