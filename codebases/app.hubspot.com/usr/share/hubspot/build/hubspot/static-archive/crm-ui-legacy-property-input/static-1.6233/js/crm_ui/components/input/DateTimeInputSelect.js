'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import ComponentWithPartials from 'UIComponents/mixins/ComponentWithPartials';
import ImmutableRenderMixin from 'react-immutable-render-mixin';
import { MOMENT_TYPES } from 'UIComponents/constants/MomentTypes';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIBox from 'UIComponents/layout/UIBox';
import UITimePicker from 'UIComponents/input/UITimePicker';
import UISelect from 'UIComponents/input/UISelect';
import CRMDateInput from '../../date/CRMDateInput';
import MakeDateTimeInput from './MakeDateTimeInput';
var CUSTOM = 'custom';
var EMPTY = 'empty';
var propTypes = {
  dropDownFooter: PropTypes.node,
  value: PropTypes.number,
  onDateCategoryChange: PropTypes.func.isRequired,
  categoryOptions: PropTypes.array,
  activeCategory: PropTypes.string,
  getDateAndTime: PropTypes.func,
  onDateChange: PropTypes.func,
  onTimeChange: PropTypes.func,
  timeInterval: PropTypes.number,
  focusOnMount: PropTypes.bool,
  disabled: PropTypes.bool,
  clearLabel: PropTypes.string,
  error: PropTypes.bool,
  'data-selenium-test': PropTypes.string
};
var DateTimeInputSelect = createReactClass({
  displayName: 'DateTimeInputSelect',
  mixins: [ComponentWithPartials, ImmutableRenderMixin],
  renderCategorySelect: function renderCategorySelect() {
    var _this$props = this.props,
        dropDownFooter = _this$props.dropDownFooter,
        value = _this$props.value,
        onDateCategoryChange = _this$props.onDateCategoryChange,
        categoryOptions = _this$props.categoryOptions,
        activeCategory = _this$props.activeCategory,
        disabled = _this$props.disabled,
        error = _this$props.error;
    return /*#__PURE__*/_jsx(UISelect, {
      searchable: false,
      dropdownFooter: dropDownFooter,
      onChange: onDateCategoryChange,
      value: !value ? EMPTY : activeCategory,
      options: categoryOptions,
      disabled: disabled,
      error: error
    });
  },
  renderSeparator: function renderSeparator() {
    if (this.props.activeCategory === EMPTY) {
      return null;
    }

    return /*#__PURE__*/_jsx("span", {
      className: "p-x-3",
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "dateTimeInput.timeDelimiter"
      })
    });
  },
  renderDateInput: function renderDateInput() {
    var _this$props2 = this.props,
        getDateAndTime = _this$props2.getDateAndTime,
        onDateChange = _this$props2.onDateChange,
        focusOnMount = _this$props2.focusOnMount,
        disabled = _this$props2.disabled,
        clearLabel = _this$props2.clearLabel,
        minValue = _this$props2.minValue,
        error = _this$props2.error;

    var _getDateAndTime = getDateAndTime(),
        dateValue = _getDateAndTime.dateValue;

    return /*#__PURE__*/_jsx(CRMDateInput, {
      open: true,
      momentType: MOMENT_TYPES.USER,
      onChange: onDateChange,
      value: dateValue,
      min: minValue,
      style: {
        width: '120px'
      },
      ref: function ref(_ref) {
        return _ref && focusOnMount && _ref.focus();
      },
      disabled: disabled,
      clearLabel: clearLabel,
      error: error,
      "data-selenium-test": this.props['data-selenium-test'] ? this.props['data-selenium-test'] + "__date" : undefined
    });
  },
  renderTimeInput: function renderTimeInput() {
    var _this$props3 = this.props,
        error = _this$props3.error,
        getDateAndTime = _this$props3.getDateAndTime,
        onTimeChange = _this$props3.onTimeChange,
        timeInterval = _this$props3.timeInterval,
        disabled = _this$props3.disabled;

    var _getDateAndTime2 = getDateAndTime(),
        timeValue = _getDateAndTime2.timeValue;

    return /*#__PURE__*/_jsx(UITimePicker, {
      onChange: onTimeChange,
      value: timeValue,
      interval: timeInterval,
      clearable: false,
      style: {
        width: '130px'
      },
      disabled: disabled,
      error: error,
      "data-selenium-test": this.props['data-selenium-test'] ? this.props['data-selenium-test'] + "__time" : undefined
    });
  },
  render: function render() {
    var _this$props4 = this.props,
        value = _this$props4.value,
        activeCategory = _this$props4.activeCategory,
        categoryOptions = _this$props4.categoryOptions;
    var shouldUseCustomDateInput = activeCategory === CUSTOM || !categoryOptions;

    if (activeCategory === EMPTY || typeof value === 'undefined' || value === null) {
      return this.renderCategorySelect();
    }

    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      children: [/*#__PURE__*/_jsx(UIBox, {
        grow: shouldUseCustomDateInput ? 0 : 2,
        children: shouldUseCustomDateInput ? this.renderDateInput() : this.renderCategorySelect()
      }), /*#__PURE__*/_jsx(UIBox, {
        children: this.renderSeparator()
      }), /*#__PURE__*/_jsx(UIBox, {
        grow: 1,
        children: this.renderTimeInput()
      })]
    });
  }
});
DateTimeInputSelect.propTypes = propTypes;
export default MakeDateTimeInput(DateTimeInputSelect);