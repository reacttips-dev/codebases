'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { equals, fromString, getBoundedDate, isValid, nextDay, prevDay, toFormattedString } from '../../core/SimpleDate';
import SyntheticEvent from '../../core/SyntheticEvent';
import { SimpleDateType } from '../../types/SimpleDateTypes';
import { getPageFromDate } from './calendarUtils';

var AbstractCalendar = /*#__PURE__*/function (_Component) {
  _inherits(AbstractCalendar, _Component);

  function AbstractCalendar(props) {
    var _this;

    _classCallCheck(this, AbstractCalendar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractCalendar).call(this, props));

    _this.handleInputChange = function (evt) {
      var _this$props = _this.props,
          format = _this$props.format,
          onChange = _this$props.onChange,
          value = _this$props.value;

      _this.setState({
        inputValue: evt.target.value
      }); // Update date value as the user types


      var userInput = evt.target.value.trim();

      if (userInput === '') {
        onChange(SyntheticEvent(null));
      } else {
        var userInputDate = fromString(userInput, format);

        if (userInputDate !== null && !equals(userInputDate, value)) {
          _this.updateDate(userInputDate);
        }
      }
    };

    _this.handleKeyDown = function (evt) {
      var _this$props2 = _this.props,
          onOpenChange = _this$props2.onOpenChange,
          open = _this$props2.open,
          originDate = _this$props2.originDate,
          today = _this$props2.today,
          value = _this$props2.value;
      var key = evt.key;
      clearTimeout(_this._keyUpTimeout);
      _this._pressedKey = key; // The "keyboard cursor" is implicitly on the current selection, or today's date if clear.

      var computedCurrentDate = isValid(value) ? value : originDate || today;

      if (key === 'ArrowUp') {
        evt.preventDefault();
        var newValue = nextDay(computedCurrentDate);

        _this.updateDate(newValue);
      } else if (key === 'ArrowDown') {
        evt.preventDefault();

        var _newValue = prevDay(computedCurrentDate);

        _this.updateDate(_newValue);
      } else if (key === 'Escape') {
        if (!open || !onOpenChange) return;
        evt.preventDefault();
        onOpenChange(SyntheticEvent(false));
      }
    };

    _this.handleKeyUp = function () {
      // The delay here should ensure that onKeyUp resolves after onChange, even under IE11 (#7331).
      clearTimeout(_this._keyUpTimeout);
      _this._keyUpTimeout = setTimeout(function () {
        _this._pressedKey = null;
      }, 0);
    };

    _this.handleBlur = function () {
      var _this$props3 = _this.props,
          format = _this$props3.format,
          onFocusedValueChange = _this$props3.onFocusedValueChange,
          value = _this$props3.value;

      _this.updateInput(value, format);

      _this._pressedKey = null;
      onFocusedValueChange(SyntheticEvent(null));
    };

    _this.state = {
      inputValue: toFormattedString(props.value, props.format)
    };
    _this._keyUpTimeout = 0;
    _this._pressedKey = null;
    return _this;
  }

  _createClass(AbstractCalendar, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var _this$props4 = this.props,
          calendarPage = _this$props4.calendarPage,
          onCalendarPageChange = _this$props4.onCalendarPageChange,
          onOpenChange = _this$props4.onOpenChange,
          open = _this$props4.open,
          value = _this$props4.value;

      if (!equals(value, nextProps.value)) {
        // Flip to the calendar page that includes the selected date
        var newCalendarPage = getPageFromDate(nextProps.value);

        if (!equals(newCalendarPage, calendarPage)) {
          onCalendarPageChange(SyntheticEvent(newCalendarPage));
        } // `pressedKey` tells us whether this change was caused by the mouse or the keyboard


        var shouldClosePicker = this._pressedKey === null;
        var shouldUpdateInput = this._pressedKey === null || this._pressedKey === 'ArrowUp' || this._pressedKey === 'ArrowDown';

        if (shouldClosePicker && open) {
          onOpenChange(SyntheticEvent(false));
        }

        if (shouldUpdateInput) {
          this.updateInput(nextProps.value, nextProps.format);
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this._keyUpTimeout);
    }
  }, {
    key: "updateInput",
    value: function updateInput(value, format) {
      var inputValue = this.state.inputValue;
      var formattedDate = toFormattedString(value, format);

      if (formattedDate !== inputValue) {
        this.setState({
          inputValue: formattedDate
        });
      }
    }
  }, {
    key: "updateDate",
    value: function updateDate(newValue) {
      var _this$props5 = this.props,
          calendarPage = _this$props5.calendarPage,
          disabledValues = _this$props5.disabledValues,
          max = _this$props5.max,
          maxValue = _this$props5.maxValue,
          min = _this$props5.min,
          minValue = _this$props5.minValue,
          onCalendarPageChange = _this$props5.onCalendarPageChange,
          onChange = _this$props5.onChange,
          onFocusedValueChange = _this$props5.onFocusedValueChange,
          onOpenChange = _this$props5.onOpenChange;

      if (!calendarPage || newValue.month !== calendarPage.month) {
        onCalendarPageChange(SyntheticEvent({
          year: newValue.year,
          month: newValue.month
        }));
      }

      if (!equals(newValue, getBoundedDate(newValue, min || minValue, max || maxValue)) || disabledValues && disabledValues.some(function (disabledValue) {
        return equals(newValue, disabledValue);
      })) {
        // Show tooltip on disabled date
        onFocusedValueChange(SyntheticEvent(newValue));
        onOpenChange(SyntheticEvent(true));
        return;
      }

      onFocusedValueChange(SyntheticEvent(null));
      onChange(SyntheticEvent(newValue));
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      var inputValue = this.state.inputValue;
      return children({
        onBlur: this.handleBlur,
        onInputChange: this.handleInputChange,
        onKeyDown: this.handleKeyDown,
        onKeyUp: this.handleKeyUp,
        inputValue: inputValue
      });
    }
  }]);

  return AbstractCalendar;
}(Component);

if (process.env.NODE_ENV !== 'production') {
  AbstractCalendar.propTypes = {
    calendarPage: PropTypes.shape({
      year: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired
    }),
    children: PropTypes.func.isRequired,
    disabledValues: PropTypes.arrayOf(SimpleDateType),
    format: PropTypes.oneOf(['L', 'YYYY-MM-DD']).isRequired,
    max: SimpleDateType,
    maxValue: SimpleDateType,
    min: SimpleDateType,
    minValue: SimpleDateType,
    onCalendarPageChange: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocusedValueChange: PropTypes.func.isRequired,
    onOpenChange: PropTypes.func,
    open: PropTypes.bool,
    originDate: SimpleDateType,
    today: SimpleDateType.isRequired,
    value: SimpleDateType
  };
}

AbstractCalendar.defaultProps = {
  format: 'L'
};
export default AbstractCalendar;