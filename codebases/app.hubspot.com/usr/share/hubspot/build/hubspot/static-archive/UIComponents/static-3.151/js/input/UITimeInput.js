'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import invariant from 'react-utils/invariant';
import memoize from 'react-utils/memoize';
import { callIfPossible } from '../core/Functions';
import SyntheticEvent from '../core/SyntheticEvent';
import Controllable from '../decorators/Controllable';
import ShareInput from '../decorators/ShareInput';
import { FieldsetContextConsumer } from '../context/FieldsetContext';
import UIControlledPopover from '../tooltip/UIControlledPopover';
import refObject from '../utils/propTypes/refObject';
import { hidden } from '../utils/propTypes/decorators';
import { uniqueId } from '../utils/underscore';
import { formatValue, parseValue, PrivateTimePickerOptions } from './internal/UITimeInputInternals';
import UIInputIconWrapper from './internal/UIInputIconWrapper';
import UINumberInput from './UINumberInput';
import { listAttrIncludes } from '../utils/Dom';
var MAX_TIME_OF_DAY = 1439; // 24 * 60 - 1

var roundToNearest = function roundToNearest(value, step) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Math.round;
  return round(value / step) * step;
};

var getLocalizedTimeFormat = memoize(function () {
  return 'HH:MM'.replace(/HH/, I18n.text('ui.timePicker.placeholder.hour')).replace(/MM/, I18n.text('ui.timePicker.placeholder.minute'));
});

var UITimeInput = /*#__PURE__*/function (_Component) {
  _inherits(UITimeInput, _Component);

  function UITimeInput(props) {
    var _this;

    _classCallCheck(this, UITimeInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UITimeInput).call(this, props));

    _this.numberInputFormatter = function (value) {
      return formatValue(_this.props.format, value);
    };

    _this.numberInputParser = function (rawValue) {
      return parseValue(_this.props.format, rawValue);
    };

    _this.makeListboxOptionId = function (value) {
      return _this._listboxOptionIdPrefix + "-" + value;
    };

    _this.handleOptionClick = function (evt) {
      callIfPossible(_this.props.onChange, SyntheticEvent(evt.target.value));
    };

    _this.handleOptionHover = function (value) {
      _this.setActiveDescendant(value);
    };

    _this.handleInputFocus = function (evt) {
      var _this$props = _this.props,
          inputRef = _this$props.inputRef,
          onFocus = _this$props.onFocus,
          onOpenChange = _this$props.onOpenChange;
      onOpenChange(SyntheticEvent(true));
      inputRef.current.select();
      if (onFocus) onFocus(evt);
    };

    _this.handleInputBlur = function (evt) {
      callIfPossible(_this.props.onOpenChange, SyntheticEvent(false));
      callIfPossible(_this.props.onBlur, evt);
    };

    _this.handleInputChange = function (evt) {
      _this.setActiveDescendant(evt.target.value);

      callIfPossible(_this.props.onChange, evt);
    };

    _this.handleInputKeyDown = function (evt) {
      var _this$props2 = _this.props,
          value = _this$props2.value,
          interval = _this$props2.interval,
          min = _this$props2.min,
          max = _this$props2.max,
          onChange = _this$props2.onChange,
          open = _this$props2.open,
          onOpenChange = _this$props2.onOpenChange,
          onKeyDown = _this$props2.onKeyDown,
          disabled = _this$props2.disabled,
          readOnly = _this$props2.readOnly;

      if (disabled || readOnly) {
        return;
      }

      var activeDescendant = _this.state.activeDescendant;
      var firstAvailableOption = min;
      var lastAvailableOption = max;
      var newValue = value;
      var newOpen = open;
      var newActiveDescendant = activeDescendant;

      switch (evt.key) {
        case 'ArrowDown':
          evt.preventDefault(); // Don't move the cursor

          newOpen = true; // Increment or default to first option in list

          newActiveDescendant = activeDescendant == null ? firstAvailableOption : Math.min(lastAvailableOption, activeDescendant + interval);
          newActiveDescendant = roundToNearest(newActiveDescendant, interval, Math.floor);
          break;

        case 'ArrowUp':
          evt.preventDefault(); // Don't move the cursor

          newOpen = true; // Decrement or default to last option in list

          newActiveDescendant = activeDescendant == null ? lastAvailableOption : Math.max(firstAvailableOption, activeDescendant - interval);
          newActiveDescendant = roundToNearest(newActiveDescendant, interval, Math.ceil);
          break;

        case 'Enter':
          // Set activeDescendant as new value on selection
          if (open) {
            newValue = activeDescendant;
          }

          newOpen = !open;
          break;

        default:
          callIfPossible(onKeyDown, evt);
          return;
      }

      if (activeDescendant !== newActiveDescendant) {
        _this.setActiveDescendant(newActiveDescendant);
      }

      if (value !== newValue) {
        callIfPossible(onChange, SyntheticEvent(newValue));
      }

      if (open !== newOpen) {
        callIfPossible(onOpenChange, SyntheticEvent(newOpen));
      }
    };

    _this.state = {
      activeDescendant: props.value,
      popoverWidth: 'auto'
    };
    _this._listboxOptionIdPrefix = "UITimeInput-" + uniqueId() + "-result-item";
    return _this;
  }

  _createClass(UITimeInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updatePopoverContentWidth();
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var isOpening = !this.props.open && nextProps.open;

      if (isOpening) {
        this.setState({
          activeDescendant: nextProps.value
        });
      }
    }
  }, {
    key: "UNSAFE_componentWillUpdate",
    value: function UNSAFE_componentWillUpdate(nextProps) {
      var isOpening = !this.props.open && nextProps.open;

      if (isOpening) {
        this.updatePopoverContentWidth();
      }
    }
    /** @private */

  }, {
    key: "setActiveDescendant",
    value: function setActiveDescendant(value) {
      this.setState({
        activeDescendant: value
      });
    }
  }, {
    key: "updatePopoverContentWidth",
    value: function updatePopoverContentWidth() {
      var inputEl = this.props.inputRef.current;

      if (inputEl) {
        var _inputEl$getBoundingC = inputEl.getBoundingClientRect(),
            exactWidth = _inputEl$getBoundingC.width;

        var roundedWidth = window.chrome ? Math.floor(exactWidth) : exactWidth;
        this.setState({
          popoverWidth: roundedWidth // account for 1px border added by UIPopover

        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          autoFocus = _this$props3.autoFocus,
          className = _this$props3.className,
          disabled = _this$props3.disabled,
          error = _this$props3.error,
          __format = _this$props3.format,
          iconSize = _this$props3.iconSize,
          id = _this$props3.id,
          Input = _this$props3.Input,
          inputRef = _this$props3.inputRef,
          inputWidth = _this$props3.inputWidth,
          interval = _this$props3.interval,
          max = _this$props3.max,
          min = _this$props3.min,
          name = _this$props3.name,
          __onBlur = _this$props3.onBlur,
          __onChange = _this$props3.onChange,
          __onFocus = _this$props3.onFocus,
          __onKeyDown = _this$props3.onKeyDown,
          onPopoverOpenChange = _this$props3.onOpenChange,
          popoverOpen = _this$props3.open,
          readOnly = _this$props3.readOnly,
          use = _this$props3.use,
          normalizedValue = _this$props3.value,
          rest = _objectWithoutProperties(_this$props3, ["autoFocus", "className", "disabled", "error", "format", "iconSize", "id", "Input", "inputRef", "inputWidth", "interval", "max", "min", "name", "onBlur", "onChange", "onFocus", "onKeyDown", "onOpenChange", "open", "readOnly", "use", "value"]);

      var activeDescendant = this.state.activeDescendant;

      if (process.env.NODE_ENV !== 'production') {
        invariant(min >= 0, 'UITimeInput: `min` should be a positive integer (received %s)', min);
        invariant(max >= 0, 'UITimeInput: `max` should be a positive integer (received %s)', max);
        invariant(max <= MAX_TIME_OF_DAY, 'UITimeInput: `max` should not be greater than 11:59 PM (received %s > %s)', max, MAX_TIME_OF_DAY);
        invariant(min < max, 'UITimeInput: `min` should not be greater than `max` (received %s > %s)', min, max);
      }

      var computedPopoverOpen = popoverOpen && !disabled && !readOnly;
      return /*#__PURE__*/_jsx(FieldsetContextConsumer, {
        children: function children(fieldsetContext) {
          var computedDisabled = disabled || fieldsetContext.disabled;
          return /*#__PURE__*/_jsx(UIControlledPopover, {
            arrowSize: "none",
            placement: "bottom",
            width: _this2.state.popoverWidth,
            open: computedPopoverOpen,
            onOpenChange: onPopoverOpenChange,
            content: /*#__PURE__*/_jsx(PrivateTimePickerOptions, {
              focusedValue: activeDescendant,
              interval: interval,
              makeOptionId: _this2.makeListboxOptionId,
              max: max,
              min: min,
              onOptionClick: _this2.handleOptionClick,
              onOptionHover: _this2.handleOptionHover,
              valueFormatter: _this2.numberInputFormatter
            }),
            children: /*#__PURE__*/_jsx(UIInputIconWrapper, Object.assign({}, rest, {
              className: className,
              disabled: computedDisabled,
              iconName: "time",
              size: iconSize || fieldsetContext.size,
              children: /*#__PURE__*/_jsx(Input, {
                "aria-activedescendant": activeDescendant ? _this2.makeListboxOptionId(activeDescendant) : undefined,
                className: listAttrIncludes(className, 'private-form__control--inline') ? 'private-form__control--inline' : undefined,
                autoComplete: "off",
                autoFocus: autoFocus,
                disabled: computedDisabled,
                error: error,
                formatter: _this2.numberInputFormatter,
                id: id,
                inputRef: inputRef,
                max: max,
                min: min,
                name: name,
                onBlur: _this2.handleInputBlur,
                onChange: _this2.handleInputChange,
                onFocus: _this2.handleInputFocus,
                onKeyDown: _this2.handleInputKeyDown,
                parser: _this2.numberInputParser,
                placeholder: getLocalizedTimeFormat(),
                readOnly: readOnly,
                use: use,
                value: normalizedValue,
                width: inputWidth
              })
            }))
          });
        }
      });
    }
  }]);

  return UITimeInput;
}(Component);

UITimeInput.propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  format: PropTypes.string.isRequired,
  iconSize: hidden(PropTypes.number),
  Input: hidden(PropTypes.elementType),
  inputRef: refObject,
  inputWidth: hidden(PropTypes.number),
  interval: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onOpenChange: PropTypes.func,
  open: PropTypes.bool,
  readOnly: PropTypes.bool,
  use: PropTypes.oneOf(['default', 'on-dark']).isRequired,
  value: PropTypes.number
};
UITimeInput.defaultProps = {
  min: 0,
  max: MAX_TIME_OF_DAY,
  format: 'LT',
  Input: UINumberInput,
  use: 'default',
  interval: 30,
  open: false
};
UITimeInput.displayName = 'UITimeInput';
export default ShareInput(Controllable(UITimeInput, ['open', 'value']));