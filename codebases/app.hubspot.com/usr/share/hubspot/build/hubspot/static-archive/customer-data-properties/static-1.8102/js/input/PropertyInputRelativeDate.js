'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import convertToInt from 'customer-data-properties/utils/convertToInt';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import styled from 'styled-components';
import filter from 'transmute/filter';
import getIn from 'transmute/getIn';
import { fromMoment, toMoment } from 'UIComponents/core/SimpleDate';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIDateInput from 'UIComponents/dates/UIDateInput';
import UIMicroDateInput from 'UIComponents/dates/UIMicroDateInput';
import UIMicroTimeInput from 'UIComponents/input/UIMicroTimeInput';
import UISelect from 'UIComponents/input/UISelect';
import UITimeInput from 'UIComponents/input/UITimeInput';
import UIBox from 'UIComponents/layout/UIBox';
import UIFlex from 'UIComponents/layout/UIFlex';
import { CUSTOM } from '../constants/RelativeDates';
var InlineFlex = styled.div.withConfig({
  displayName: "PropertyInputRelativeDate__InlineFlex",
  componentId: "wt59yv-0"
})(["display:inline-flex;align-items:baseline;"]); // To be used with ../date/RelativeDatePresets

var PropertyInputRelativeDate = /*#__PURE__*/function (_PureComponent) {
  _inherits(PropertyInputRelativeDate, _PureComponent);

  function PropertyInputRelativeDate(props) {
    var _this;

    _classCallCheck(this, PropertyInputRelativeDate);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputRelativeDate).call(this, props));

    _this.handleSelectChange = function (evt) {
      if (evt.target.value === CUSTOM) {
        _this.setState({
          forceAbsoluteInput: true
        });

        return;
      }

      var newValue = _this.getDate(evt.target.value).minutes(_this.getTimeMins()).valueOf(); // emit some metadata along with the value for tracking purposes


      var selectedOption = _this.getOptionIfMatchesValue(newValue);

      _this.props.onChange({
        target: Object.assign({}, selectedOption, {
          value: newValue
        })
      });
    };

    _this.handleDateChange = function (evt) {
      if (evt.target.value === null) {
        if (_this.props.defaultValue) {
          _this.props.onChange(SyntheticEvent(_this.props.defaultValue));
        } else if (_this.props.options[0]) {
          _this.props.onChange(SyntheticEvent(_this.getDate(getIn([0, 'value'], _this.props.options)).minutes(_this.getTimeMins()).valueOf()));
        } else {
          _this.props.onChange(SyntheticEvent(_this.getDate(I18n.moment.userTz().valueOf()).minutes(_this.getTimeMins()).valueOf()));
        }

        _this.setState({
          forceAbsoluteInput: false
        });

        return;
      }

      var timestamp = toMoment(evt.target.value).valueOf();

      var newValue = _this.getDate(timestamp).minutes(_this.getTimeMins()).valueOf();

      _this.props.onChange(SyntheticEvent(newValue));
    };

    _this.handleTimeChange = function (evt) {
      var newValue = _this.getDate().minutes(evt.target.value).valueOf(); // emit metadata about selected date again for tracking


      var selectedDateOption = _this.getOptionIfMatchesValue(newValue);

      _this.props.onChange({
        target: Object.assign({}, selectedDateOption, {
          value: newValue
        })
      });
    };

    _this.state = {
      forceAbsoluteInput: false
    };
    return _this;
  }

  _createClass(PropertyInputRelativeDate, [{
    key: "shouldShowAbsoluteDateInput",
    value: function shouldShowAbsoluteDateInput() {
      var _this2 = this;

      return (// reached by clicking "custom"
        this.state.forceAbsoluteInput || // reached because the date doesn't match any of the presets
        !this.props.options.find(function (option) {
          return _this2.getDate(option.value).isSame(_this2.getDate(), 'day');
        })
      );
    }
  }, {
    key: "getOptionsForRender",
    value: function getOptionsForRender() {
      var customOption = {
        value: CUSTOM,
        text: I18n.text('customerDataProperties.PropertyInputRelativeDate.custom')
      };
      return [].concat(_toConsumableArray(this.props.options), [customOption]);
    }
  }, {
    key: "getValue",
    value: function getValue(timestamp) {
      var _this$props = this.props,
          value = _this$props.value,
          defaultValue = _this$props.defaultValue;
      return convertToInt(timestamp) || convertToInt(value) || convertToInt(defaultValue);
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
      return momentDate.hour() * 60 + momentDate.minutes();
    }
  }, {
    key: "getOptionIfMatchesValue",
    value: function getOptionIfMatchesValue(value) {
      var _this3 = this;

      return this.props.options.find(function (option) {
        return _this3.getDate(option.value).isSame(_this3.getDate(value), 'day');
      });
    }
  }, {
    key: "renderAbsoluteDateInput",
    value: function renderAbsoluteDateInput() {
      var _this$props2 = this.props,
          autoFocus = _this$props2.autoFocus,
          dateInputProps = _this$props2.dateInputProps,
          readOnly = _this$props2.readOnly,
          disabled = _this$props2.disabled,
          error = _this$props2.error,
          defaultOpen = _this$props2.defaultOpen,
          use = _this$props2.use;
      var DateInput = use === 'link' || use === 'transparent' ? UIMicroDateInput : UIDateInput;
      return /*#__PURE__*/_jsx(DateInput, Object.assign({}, dateInputProps, {
        autoFocus: this.state.forceAbsoluteInput || autoFocus,
        readOnly: readOnly,
        disabled: disabled,
        error: error,
        value: fromMoment(this.getDate()),
        onChange: this.handleDateChange,
        defaultOpen: defaultOpen
      }));
    }
  }, {
    key: "renderRelativeDateInput",
    value: function renderRelativeDateInput() {
      var _this$props3 = this.props,
          autoFocus = _this$props3.autoFocus,
          dateSelectProps = _this$props3.dateSelectProps,
          readOnly = _this$props3.readOnly,
          disabled = _this$props3.disabled,
          error = _this$props3.error,
          defaultOpen = _this$props3.defaultOpen,
          use = _this$props3.use;
      return /*#__PURE__*/_jsx(UISelect, Object.assign({
        buttonUse: use
      }, dateSelectProps, {
        autoFocus: autoFocus,
        readOnly: readOnly,
        disabled: disabled,
        error: error,
        menuWidth: "auto",
        searchable: false,
        value: this.getDate().valueOf(),
        onChange: this.handleSelectChange,
        options: this.getOptionsForRender(),
        defaultOpen: defaultOpen
      }));
    }
  }, {
    key: "renderTimeInput",
    value: function renderTimeInput() {
      var _this$props4 = this.props,
          timeInputProps = _this$props4.timeInputProps,
          readOnly = _this$props4.readOnly,
          disabled = _this$props4.disabled,
          use = _this$props4.use,
          error = _this$props4.error;
      var TimeInput = use === 'link' || use === 'transparent' ? UIMicroTimeInput : UITimeInput;
      return /*#__PURE__*/_jsx(TimeInput, Object.assign({
        interval: 15
      }, timeInputProps, {
        readOnly: readOnly,
        disabled: disabled,
        error: error,
        value: this.getTimeMins(),
        onChange: this.handleTimeChange
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          className = _this$props5.className,
          use = _this$props5.use,
          showTimeInput = _this$props5.showTimeInput,
          rest = _objectWithoutProperties(_this$props5, ["className", "use", "showTimeInput"]);

      var dataAttributes = filter(function (val, key) {
        return key.startsWith('data-');
      }, rest);

      if (use === 'link' || use === 'transparent') {
        return /*#__PURE__*/_jsxs(InlineFlex, Object.assign({
          className: className
        }, dataAttributes, {
          children: [this.shouldShowAbsoluteDateInput() ? this.renderAbsoluteDateInput() : this.renderRelativeDateInput(), showTimeInput && /*#__PURE__*/_jsx(UIBox, {
            className: "m-left-2",
            children: this.renderTimeInput()
          })]
        }));
      }

      return /*#__PURE__*/_jsxs(UIFlex, Object.assign({
        justify: "between",
        align: "baseline",
        className: className
      }, dataAttributes, {
        children: [/*#__PURE__*/_jsx(UIBox, {
          grow: 1,
          className: "m-right-2",
          children: this.shouldShowAbsoluteDateInput() ? this.renderAbsoluteDateInput() : this.renderRelativeDateInput()
        }), showTimeInput && /*#__PURE__*/_jsx(UIBox, {
          grow: 0,
          basis: "9em",
          children: this.renderTimeInput()
        })]
      }));
    }
  }]);

  return PropertyInputRelativeDate;
}(PureComponent);

PropertyInputRelativeDate.propTypes = {
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
    text: PropTypes.string
  })).isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  timeInputProps: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number
  }),
  dateInputProps: PropTypes.object,
  dateSelectProps: PropTypes.object,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  use: PropTypes.oneOf(['default', 'link', 'transparent']),
  showTimeInput: PropTypes.bool
};
PropertyInputRelativeDate.defaultProps = {
  showTimeInput: true
};
export { PropertyInputRelativeDate as default };