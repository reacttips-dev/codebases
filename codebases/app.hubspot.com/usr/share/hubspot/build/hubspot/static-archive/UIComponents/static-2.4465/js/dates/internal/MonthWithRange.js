'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useState } from 'react';
import I18n from 'I18n';
import { equals, isDateInRange, isValidRange } from '../../core/SimpleDate';
import SyntheticEvent from '../../core/SyntheticEvent';
import { SimpleDateType } from '../../types/SimpleDateTypes';
import { preventDefaultHandler } from '../../utils/DomEvents';
import createLazyPropType from '../../utils/propTypes/createLazyPropType';
import AbstractMonth from './AbstractMonth';
import Day from './Day';
export default function MonthWithRange(props) {
  var activeBound = props.activeBound,
      month = props.month,
      onActiveBoundChange = props.onActiveBoundChange,
      onChange = props.onChange,
      value = props.value,
      rest = _objectWithoutProperties(props, ["activeBound", "month", "onActiveBoundChange", "onChange", "value"]);

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      hoveredDate = _useState2[0],
      setHoveredDate = _useState2[1];

  var minMaxProps = {};

  if (activeBound === 'start' && value.endDate) {
    minMaxProps = {
      max: value.endDate,
      maxValidationMessage: I18n.text('ui.dateRange.startDateAfterEndDate')
    };
  } else if (activeBound === 'end' && value.startDate) {
    minMaxProps = {
      min: value.startDate,
      minValidationMessage: I18n.text('ui.dateRange.endDateBeforeStartDate')
    };
  }

  return /*#__PURE__*/_jsx(AbstractMonth, Object.assign({}, rest, {}, minMaxProps, {
    month: month,
    onDateClick: function onDateClick(evt) {
      var clickedDate = evt.target.value;
      var newValue;

      if (activeBound === 'start') {
        newValue = {
          startDate: clickedDate,
          endDate: value.endDate
        };
      } else {
        newValue = {
          startDate: value.startDate,
          endDate: clickedDate
        };
      }

      onChange(SyntheticEvent(newValue)); // Focus the end date input after the selection is made, unless there's no start date

      onActiveBoundChange(SyntheticEvent(newValue.startDate ? 'end' : 'start'));
    },
    onDateMouseEnter: function onDateMouseEnter(evt) {
      setHoveredDate(evt.target.value);
    },
    onDateMouseLeave: function onDateMouseLeave(evt) {
      if (equals(hoveredDate, evt.target.value)) setHoveredDate(null);
    },
    onMouseDown: preventDefaultHandler
    /* Keep the focus in the input */
    ,
    children: function children(simpleDate, dayProps) {
      var isRangeStart = equals(simpleDate, value.startDate);
      var isRangeEnd = equals(simpleDate, value.endDate);
      var isInRange = isValidRange(value) && isDateInRange(simpleDate, value.startDate, value.endDate) && !isRangeStart && !isRangeEnd;
      var isInHoveredRange = simpleDate !== value.startDate && simpleDate !== value.endDate && (isValidRange(Object.assign({}, value, {
        startDate: hoveredDate
      })) && isDateInRange(simpleDate, hoveredDate, value.endDate) || isValidRange(Object.assign({}, value, {
        endDate: hoveredDate
      })) && isDateInRange(simpleDate, value.startDate, hoveredDate));
      return /*#__PURE__*/_jsx(Day, Object.assign({}, dayProps, {
        isRangeStart: isRangeStart,
        isRangeEnd: isRangeEnd,
        isSelected: isRangeStart || isRangeEnd,
        isInRange: isInRange || isInHoveredRange,
        children: simpleDate.date
      }));
    }
  }));
}

if (process.env.NODE_ENV !== 'production') {
  MonthWithRange.propTypes = {
    activeBound: PropTypes.oneOf(['start', 'end']),
    disabledValues: PropTypes.array,
    focusedValue: SimpleDateType,
    leftControl: PropTypes.node,
    max: SimpleDateType,
    maxValidationMessage: createLazyPropType(PropTypes.string).isRequired,
    min: SimpleDateType,
    minValidationMessage: createLazyPropType(PropTypes.string).isRequired,
    month: PropTypes.number.isRequired,
    onActiveBoundChange: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    ownerId: PropTypes.string.isRequired,
    rightControl: PropTypes.node,
    today: SimpleDateType.isRequired,
    value: PropTypes.shape({
      startDate: SimpleDateType,
      endDate: SimpleDateType
    }).isRequired,
    weekdayHeadings: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    weekStartDay: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired
  };
}

MonthWithRange.defaultProps = {
  value: {
    startDate: null,
    endDate: null
  }
};