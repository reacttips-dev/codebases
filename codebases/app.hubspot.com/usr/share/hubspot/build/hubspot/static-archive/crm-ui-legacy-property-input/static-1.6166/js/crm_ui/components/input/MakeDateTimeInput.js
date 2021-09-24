'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { toTimestamp, hoursToMinutes } from '../../utils/dateHelpers';
import { Map as ImmutableMap } from 'immutable';
import { fromMoment } from 'UIComponents/core/SimpleDate';
import { SimpleDateType } from 'UIComponents/types/SimpleDateTypes';
import emptyFunction from 'react-utils/emptyFunction';
import I18n from 'I18n';
var CUSTOM = 'custom';
var EMPTY = 'empty';
var propTypes = {
  activeCategory: PropTypes.string,
  allowEmptyCategory: PropTypes.bool,
  customCategories: PropTypes.instanceOf(ImmutableMap),
  disablePastDates: PropTypes.bool,
  handleCategoryChange: PropTypes.func,
  handleInputChange: PropTypes.func.isRequired,
  initialCategory: PropTypes.string,
  minValue: SimpleDateType,
  onClearDefaultValue: PropTypes.func,
  timeInterval: PropTypes.number,
  value: PropTypes.number
};
var defaultProps = {
  allowEmptyCategory: true,
  disablePastDates: true,
  handleCategoryChange: emptyFunction,
  timeInterval: 15
};

function _addDateAndTime(dateValue, minutes) {
  return I18n.moment.userTz(dateValue).startOf('day').add(minutes, 'minutes').valueOf();
}

export default function (Component) {
  var MakeDateTimeInput = createReactClass({
    displayName: "MakeDateTimeInput",
    propTypes: propTypes,
    getDefaultProps: function getDefaultProps() {
      return defaultProps;
    },
    getInitialState: function getInitialState() {
      return {
        activeCategory: this.getInitialCategory()
      };
    },
    getDatePickerMinValue: function getDatePickerMinValue() {
      var minValue = this.props.minValue;

      if (minValue !== undefined) {
        return minValue;
      }

      if (!this.props.disablePastDates) {
        return undefined;
      }

      return fromMoment(I18n.moment.userTz());
    },
    getInitialCategory: function getInitialCategory() {
      return this.props.initialCategory || CUSTOM;
    },
    getDateAndTime: function getDateAndTime() {
      var _this$props = this.props,
          activeCategory = _this$props.activeCategory,
          customCategories = _this$props.customCategories,
          value = _this$props.value;
      var momentTime;

      if (activeCategory && typeof activeCategory !== 'undefined' && activeCategory !== null) {
        var transformedValue = customCategories.getIn([activeCategory, 'categoryToTimestamp'])(value);
        momentTime = I18n.moment.userTz(transformedValue);
      } else {
        momentTime = I18n.moment.userTz(value);
      }

      return {
        dateValue: toTimestamp(momentTime),
        timeValue: hoursToMinutes(momentTime.hour()) + momentTime.minute()
      };
    },
    categoryOptions: function categoryOptions(categories) {
      if (!this.props.customCategories) {
        return null;
      }

      return categories.map(function (category) {
        return {
          text: category.get('text'),
          value: category.get('value')
        };
      }).toArray();
    },
    onDateCategoryChange: function onDateCategoryChange(_ref) {
      var value = _ref.target.value;
      this.setState({
        activeCategory: value
      });

      if (value === CUSTOM) {
        this.props.handleInputChange('reset');
        this.props.handleCategoryChange(CUSTOM);
      } else {
        this.props.handleInputChange(value);
        this.props.handleCategoryChange(value);
      }
    },
    onDateChange: function onDateChange(_ref2) {
      var value = _ref2.target.value;
      var _this$props2 = this.props,
          handleInputChange = _this$props2.handleInputChange,
          allowEmptyCategory = _this$props2.allowEmptyCategory,
          initialCategory = _this$props2.initialCategory,
          onClearDefaultValue = _this$props2.onClearDefaultValue;

      if (!value && onClearDefaultValue && typeof onClearDefaultValue === 'function') {
        return handleInputChange(onClearDefaultValue());
      } else if (!value && allowEmptyCategory) {
        this.setState({
          activeCategory: EMPTY
        });
        return handleInputChange(EMPTY);
      } else if (!value) {
        this.setState({
          activeCategory: initialCategory
        });
        return handleInputChange(initialCategory);
      }

      var currentReminder = I18n.moment.userTz(this.props.value);
      var minutes = hoursToMinutes(currentReminder.hours()) + currentReminder.minutes();

      var timestamp = _addDateAndTime(value, minutes);

      return handleInputChange(timestamp);
    },
    onTimeChange: function onTimeChange(_ref3) {
      var value = _ref3.target.value;

      var timestamp = _addDateAndTime(this.props.value, value);

      this.props.handleInputChange(timestamp);
    },
    render: function render() {
      var newProps = {
        getDateAndTime: this.getDateAndTime,
        getInitialCategory: this.getInitialCategory,
        categoryOptions: this.categoryOptions(this.props.customCategories),
        onDateChange: this.onDateChange,
        onDateCategoryChange: this.onDateCategoryChange,
        onTimeChange: this.onTimeChange,
        activeCategory: this.state.activeCategory,
        minValue: this.getDatePickerMinValue()
      };
      return /*#__PURE__*/_jsx(Component, Object.assign({}, this.props, {}, newProps));
    }
  });
  return MakeDateTimeInput;
}