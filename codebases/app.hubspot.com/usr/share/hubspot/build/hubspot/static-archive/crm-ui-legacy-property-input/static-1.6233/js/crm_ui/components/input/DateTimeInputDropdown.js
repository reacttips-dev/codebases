'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import getIn from 'transmute/getIn';
import I18n from 'I18n';
import text from 'I18n/utils/unescapedText';
import * as SimpleDateTypes from 'UIComponents/types/SimpleDateTypes';
import classNames from 'classnames';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIBox from 'UIComponents/layout/UIBox';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIList from 'UIComponents/list/UIList';
import UITimePicker from 'UIComponents/input/UITimePicker';
import DateTimeInputDropdownDate from './DateTimeInputDropdownDate';
import MakeDateTimeInput from './MakeDateTimeInput';
import UIFloatingFormControl from 'UIComponents/form/UIFloatingFormControl';
import FormattedMessage from 'I18n/components/FormattedMessage';
var CUSTOM = 'custom';
var EMPTY = 'empty';
var propTypes = {
  activeCategory: PropTypes.string,
  categoryOptions: PropTypes.array,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  emptyCategoryLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  focusOnMount: PropTypes.bool,
  getDateAndTime: PropTypes.func.isRequired,
  minValue: SimpleDateTypes.SimpleDateType,
  onDateCategoryChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func,
  onTimeChange: PropTypes.func,
  readOnly: PropTypes.bool,
  timeInterval: PropTypes.number,
  value: PropTypes.number,
  clearable: PropTypes.bool,
  showLabel: PropTypes.bool,
  'data-selenium-test': PropTypes.string
};
var defaultProps = {
  clearable: true
};
export var DateTimeInputDropdown = /*#__PURE__*/function (_PureComponent) {
  _inherits(DateTimeInputDropdown, _PureComponent);

  function DateTimeInputDropdown() {
    var _this;

    _classCallCheck(this, DateTimeInputDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateTimeInputDropdown).call(this)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(DateTimeInputDropdown, [{
    key: "renderCategoryInputs",
    value: function renderCategoryInputs() {
      var _this$props = this.props,
          categoryOptions = _this$props.categoryOptions,
          activeCategory = _this$props.activeCategory,
          onDateCategoryChange = _this$props.onDateCategoryChange,
          emptyCategoryLabel = _this$props.emptyCategoryLabel;

      if (!categoryOptions) {
        return null;
      }

      var isActive = function isActive(categoryOption) {
        return categoryOption.value === activeCategory;
      };

      var buttonText = activeCategory === EMPTY ? emptyCategoryLabel || text('dateTimeInput.defaultEmptyCategory') : getIn(['text'], categoryOptions.find(isActive));
      return /*#__PURE__*/_jsx(UIBox, {
        grow: 0,
        className: "m-right-2",
        children: /*#__PURE__*/_jsx(UIDropdown, {
          buttonText: buttonText,
          buttonUse: "link",
          "data-selenium-test": this.props['data-selenium-test'] ? this.props['data-selenium-test'] + "__category" : undefined,
          children: /*#__PURE__*/_jsx(UIList, {
            children: categoryOptions.map(function (option) {
              return /*#__PURE__*/_jsx(UIButton, {
                use: "link",
                value: option.value,
                onClick: function onClick() {
                  return onDateCategoryChange(SyntheticEvent(option.value));
                },
                children: option.text
              }, option.value);
            })
          })
        })
      });
    }
  }, {
    key: "renderReadOnly",
    value: function renderReadOnly() {
      var _this$props2 = this.props,
          activeCategory = _this$props2.activeCategory,
          emptyCategoryLabel = _this$props2.emptyCategoryLabel,
          getDateAndTime = _this$props2.getDateAndTime;
      var date = emptyCategoryLabel || text('dateTimeInput.defaultEmptyCategory');

      if (activeCategory !== EMPTY) {
        var _getDateAndTime = getDateAndTime(),
            dateValue = _getDateAndTime.dateValue,
            timeValue = _getDateAndTime.timeValue;

        var delimiter = I18n.text('dateTimeInput.timeDelimiter');
        var format = timeValue ? "L [" + delimiter + "] LT" : "L";
        date = I18n.moment(dateValue).format(format);
      }

      return /*#__PURE__*/_jsxs("div", {
        children: [" ", date, " "]
      });
    }
  }, {
    key: "renderDateInputWithLabel",
    value: function renderDateInputWithLabel() {
      return /*#__PURE__*/_jsx(UIFloatingFormControl, {
        isStatic: true,
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "contactInteraction.dateLabel"
        }),
        hideEditIcon: true,
        children: this.renderDateInput()
      });
    }
  }, {
    key: "renderDateInput",
    value: function renderDateInput() {
      var _this$props$getDateAn = this.props.getDateAndTime(),
          dateValue = _this$props$getDateAn.dateValue;

      return /*#__PURE__*/_jsx(DateTimeInputDropdownDate, {
        focusOnMount: this.props.focusOnMount,
        min: this.props.minValue,
        onChange: this.props.onDateChange,
        value: dateValue,
        clearable: this.props.clearable,
        "data-selenium-test": this.props['data-selenium-test'] ? this.props['data-selenium-test'] + "__date" : undefined
      });
    }
  }, {
    key: "renderDateInputWrapper",
    value: function renderDateInputWrapper() {
      return this.props.showLabel ? this.renderDateInputWithLabel() : this.renderDateInput();
    }
  }, {
    key: "renderTimePickerWithLabel",
    value: function renderTimePickerWithLabel() {
      return /*#__PURE__*/_jsx(UIFloatingFormControl, {
        isStatic: true,
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "contactInteraction.timeLabel"
        }),
        hideEditIcon: true,
        children: this.renderTimePicker()
      });
    }
  }, {
    key: "renderTimePicker",
    value: function renderTimePicker() {
      var _this$props3 = this.props,
          getDateAndTime = _this$props3.getDateAndTime,
          onTimeChange = _this$props3.onTimeChange,
          timeInterval = _this$props3.timeInterval;

      var _getDateAndTime2 = getDateAndTime(),
          timeValue = _getDateAndTime2.timeValue;

      return /*#__PURE__*/_jsx(UIBox, {
        grow: 2,
        shrink: 1,
        children: /*#__PURE__*/_jsx(UITimePicker, {
          clearable: false,
          icon: true,
          interval: timeInterval,
          onChange: onTimeChange,
          size: "small",
          style: {
            width: '95px'
          },
          styled: false,
          value: timeValue,
          "data-selenium-test": this.props['data-selenium-test'] ? this.props['data-selenium-test'] + "__time" : undefined
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          activeCategory = _this$props4.activeCategory,
          categoryOptions = _this$props4.categoryOptions,
          disabled = _this$props4.disabled,
          readOnly = _this$props4.readOnly,
          value = _this$props4.value,
          className = _this$props4.className,
          showLabel = _this$props4.showLabel;

      if (readOnly || disabled) {
        return this.renderReadOnly();
      } else if (activeCategory === EMPTY || !value) {
        return this.renderCategoryInputs();
      }

      return /*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        className: classNames('crm-date-time-input-dropdown', className),
        children: [activeCategory === CUSTOM || !categoryOptions ? this.renderDateInputWrapper() : this.renderCategoryInputs(), showLabel ? this.renderTimePickerWithLabel() : this.renderTimePicker()]
      });
    }
  }]);

  return DateTimeInputDropdown;
}(PureComponent);
DateTimeInputDropdown.propTypes = propTypes;
DateTimeInputDropdown.defaultProps = defaultProps;
export default MakeDateTimeInput(DateTimeInputDropdown);