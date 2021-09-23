'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { getTaskReminderPresets, getUISelectFormattedOptions } from 'customer-data-properties/date/RelativeDatePresets';
import convertToInt from 'customer-data-properties/utils/convertToInt';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIAlert from 'UIComponents/alert/UIAlert';
import { fromMoment, toMoment } from 'UIComponents/core/SimpleDate';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIDateInput from 'UIComponents/dates/UIDateInput';
import UIMicroDateInput from 'UIComponents/dates/UIMicroDateInput';
import UIMicroTimeInput from 'UIComponents/input/UIMicroTimeInput';
import UISelect from 'UIComponents/input/UISelect';
import UITimeInput from 'UIComponents/input/UITimeInput';
import UIFlex from 'UIComponents/layout/UIFlex';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { CUSTOM } from '../constants/RelativeDates';
var NO_REMINDER = null;
var MINUTES_IN_HOUR = 60; // returns the first non-undefined value

function fallback() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  for (var _i = 0, _args = args; _i < _args.length; _i++) {
    var arg = _args[_i];

    if (arg !== undefined) {
      return arg;
    }
  }

  return undefined;
}

function DropdownItemWithDisabledTooltip(_ref) {
  var children = _ref.children,
      option = _ref.option,
      rest = _objectWithoutProperties(_ref, ["children", "option"]);

  return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
    children: /*#__PURE__*/_jsx(UITooltip, {
      placement: "right",
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataProperties.PropertyInputTaskReminder.onlyFuture"
      }),
      disabled: !option.disabled,
      children: children
    })
  }));
}

var PropertyInputTaskReminder = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputTaskReminder, _Component);

  function PropertyInputTaskReminder(props) {
    var _this;

    _classCallCheck(this, PropertyInputTaskReminder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputTaskReminder).call(this, props));

    _this.handleSelectChange = function (evt) {
      if (evt.target.value === CUSTOM) {
        _this.setState({
          forceAbsoluteInput: true
        });

        if (!_this.getValue()) {
          var event = SyntheticEvent(_this.props.relatesTo);
          event.category = CUSTOM;

          _this.props.onChange(event);
        }

        return;
      } //get category


      var optionIfMatchesValue = _this.getOptionIfMatchesValue(_this.props.relatesTo, evt.target.value);

      var category = optionIfMatchesValue && optionIfMatchesValue.key;
      evt.category = category;

      _this.props.onChange(evt);
    };

    _this.handleDateChange = function (evt) {
      if (evt.target.value === null) {
        // clicked the "Clear" button"
        _this.props.onChange(SyntheticEvent(NO_REMINDER));

        _this.setState({
          forceAbsoluteInput: false
        });

        return;
      }

      var timestamp = toMoment(evt.target.value).valueOf();

      var newValue = _this.getDate(timestamp).minutes(_this.getTimeMins()).valueOf();

      var optionThatMatchesValue = _this.getOptionIfMatchesValue(_this.props.relatesTo, newValue);

      var event = SyntheticEvent(newValue); // if the reminder changes to one of the relative presets, switch to it

      if (optionThatMatchesValue) {
        event.category = optionThatMatchesValue.key;

        _this.setState({
          forceAbsoluteInput: false
        });
      } else {
        event.category = CUSTOM;
      }

      _this.props.onChange(event);
    };

    _this.handleTimeChange = function (evt) {
      var newValue = _this.getDate().minutes(evt.target.value).valueOf();

      var optionThatMatchesValue = _this.getOptionIfMatchesValue(_this.props.relatesTo, newValue);

      var event = SyntheticEvent(newValue); // if the reminder changes to one of the relative presets, switch to it

      if (optionThatMatchesValue) {
        event.category = optionThatMatchesValue.key;

        _this.setState({
          forceAbsoluteInput: false
        });
      }

      _this.props.onChange(event);
    };

    _this.state = {
      forceAbsoluteInput: false
    };
    return _this;
  }

  _createClass(PropertyInputTaskReminder, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.relatesTo !== prevProps.relatesTo) {
        var optionIfMatchesValue = this.getOptionIfMatchesValue(this.props.relatesTo, this.props.value); // if the relatesTo updates and the current reminder matches one of the
        // relative reminder options, show the relative input instead of the date input

        if (this.state.forceAbsoluteInput && optionIfMatchesValue) {
          this.setState({
            forceAbsoluteInput: false
          });
        } else {
          // else the relative presets are selected and we want to update the offset
          // or none of the options match a value and we want to keep showing the custom
          this.emitNewValue(prevProps.relatesTo);
        }
      }
    }
  }, {
    key: "getOptionIfMatchesValue",
    value: function getOptionIfMatchesValue(relatesTo, value) {
      return this.getOptions(relatesTo).find(function (opt) {
        return String(opt.value) === String(value);
      });
    }
  }, {
    key: "shouldShowAbsoluteDate",
    value: function shouldShowAbsoluteDate(relatesTo) {
      return this.state.forceAbsoluteInput || !this.getOptionIfMatchesValue(relatesTo, this.props.value);
    }
  }, {
    key: "getNewRelativeValueForNewRelatesTo",
    value: function getNewRelativeValueForNewRelatesTo(oldValue, oldRelatesTo) {
      if (!oldValue) {
        return oldValue;
      }

      var newOptions = this.getOptions();
      var oldOptions = this.getOptions(oldRelatesTo);
      var oldOption = oldOptions.find(function (opt) {
        return opt.value === oldValue;
      });

      if (!oldOption) {
        return oldValue;
      }

      var newOption = newOptions.find(function (opt) {
        return opt.key === oldOption.key;
      });

      if (!newOption) {
        return oldValue;
      }

      return newOption.value;
    }
  }, {
    key: "emitNewValue",
    value: function emitNewValue(oldRelatesTo) {
      var _this$props = this.props,
          oldValue = _this$props.value,
          onChange = _this$props.onChange;

      if (this.shouldShowAbsoluteDate(oldRelatesTo)) {
        return;
      }

      var newValue = this.getNewRelativeValueForNewRelatesTo(oldValue, oldRelatesTo);

      if (oldValue !== newValue) {
        var event = SyntheticEvent(newValue); //get category

        var optionIfMatchesValue = this.getOptionIfMatchesValue(this.props.relatesTo, newValue);
        event.category = optionIfMatchesValue && optionIfMatchesValue.key;
        onChange(event);
      }
    }
  }, {
    key: "getValue",
    value: function getValue(timestamp) {
      var _this$props2 = this.props,
          value = _this$props2.value,
          defaultValue = _this$props2.defaultValue;
      return fallback(convertToInt(timestamp), convertToInt(value), convertToInt(defaultValue));
    }
  }, {
    key: "getDate",
    value: function getDate(timestamp) {
      var value = this.getValue(timestamp);
      return I18n.moment.userTz(value).clone().startOf('day');
    }
  }, {
    key: "getTimeMins",
    value: function getTimeMins(timestamp) {
      var value = this.getValue(timestamp);
      var momentDate = I18n.moment.userTz(value);
      return momentDate.hour() * MINUTES_IN_HOUR + momentDate.minutes();
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      var relatesTo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.relatesTo;
      var noReminderOption = {
        value: NO_REMINDER,
        text: I18n.text('customerDataProperties.PropertyInputTaskReminder.noReminder')
      };
      var reminderOptions = getUISelectFormattedOptions(getTaskReminderPresets(), I18n.moment.userTz(relatesTo));
      var reminderOptionsWithPastDatesDisabled = reminderOptions.map(function (option) {
        return Object.assign({}, option, {
          disabled: option.value < Date.now()
        });
      });
      return [noReminderOption].concat(_toConsumableArray(reminderOptionsWithPastDatesDisabled));
    }
  }, {
    key: "getOptionsForRender",
    value: function getOptionsForRender() {
      var customOption = {
        value: CUSTOM,
        text: I18n.text('customerDataProperties.PropertyInputRelativeDate.custom')
      };
      return [].concat(_toConsumableArray(this.getOptions()), [customOption]);
    }
  }, {
    key: "renderAbsoluteInput",
    value: function renderAbsoluteInput() {
      var _this$props3 = this.props,
          dateInputProps = _this$props3.dateInputProps,
          timeInputProps = _this$props3.timeInputProps,
          isRepeating = _this$props3.isRepeating,
          showError = _this$props3.showError,
          readOnly = _this$props3.readOnly,
          disabled = _this$props3.disabled,
          use = _this$props3.use;
      var shouldUseMicroVersion = use === 'link' || use === 'transparent';
      var DateComponent = shouldUseMicroVersion ? UIMicroDateInput : UIDateInput;
      var TimeComponent = shouldUseMicroVersion ? UIMicroTimeInput : UITimeInput;
      var isToday = this.getDate().isSame(I18n.moment.userTz(), 'day');
      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsxs(UIFlex, {
          justify: shouldUseMicroVersion ? 'start' : ' between',
          align: 'baseline',
          children: [/*#__PURE__*/_jsx(DateComponent, Object.assign({}, dateInputProps, {
            min: fromMoment(this.getDate(Date.now())),
            minValidationMessage: function minValidationMessage() {
              return I18n.text('customerDataProperties.PropertyInputTaskReminder.onlyFuture');
            },
            readOnly: readOnly,
            disabled: disabled,
            value: fromMoment(this.getDate()),
            onChange: this.handleDateChange,
            error: showError,
            className: "m-right-1",
            autoFocus: this.state.forceAbsoluteInput
          })), /*#__PURE__*/_jsx(TimeComponent, Object.assign({
            interval: 15
          }, timeInputProps, {
            min: isToday ? this.getTimeMins(Date.now()) : undefined,
            readOnly: readOnly,
            disabled: disabled,
            value: this.getTimeMins(),
            onChange: this.handleTimeChange,
            error: showError,
            className: "m-left-1"
          }))]
        }), isRepeating && /*#__PURE__*/_jsx(UIAlert, {
          use: "inline",
          type: "warning",
          className: "m-top-5",
          closeable: false,
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "customerDataProperties.PropertyInputTaskReminder.customReminderOnRepeatingTaskWarning"
          })
        })]
      });
    }
  }, {
    key: "renderRelativeInput",
    value: function renderRelativeInput() {
      var _this$props4 = this.props,
          showError = _this$props4.showError,
          dateSelectProps = _this$props4.dateSelectProps,
          readOnly = _this$props4.readOnly,
          disabled = _this$props4.disabled,
          use = _this$props4.use;
      return /*#__PURE__*/_jsx(UISelect, Object.assign({
        buttonUse: use
      }, dateSelectProps, {
        readOnly: readOnly,
        disabled: disabled,
        value: this.getValue(),
        placeholder: I18n.text('customerDataProperties.PropertyInputTaskReminder.noReminder'),
        onChange: this.handleSelectChange,
        options: this.getOptionsForRender(),
        error: showError,
        itemComponent: DropdownItemWithDisabledTooltip
      }));
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx("div", {
        className: this.props.className,
        children: this.shouldShowAbsoluteDate() ? this.renderAbsoluteInput() : this.renderRelativeInput()
      });
    }
  }]);

  return PropertyInputTaskReminder;
}(Component);

PropertyInputTaskReminder.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isRepeating: PropTypes.bool,
  relatesTo: PropTypes.number.isRequired,
  timeInputProps: PropTypes.object,
  dateInputProps: PropTypes.object,
  dateSelectProps: PropTypes.object,
  showError: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  use: PropTypes.oneOf(['default', 'link', 'transparent'])
};
export { PropertyInputTaskReminder as default };