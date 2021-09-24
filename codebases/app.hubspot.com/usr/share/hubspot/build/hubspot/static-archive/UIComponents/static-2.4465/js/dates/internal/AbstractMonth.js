'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { SLINKY } from 'HubStyleTokens/colors';
import { useMemo } from 'react';
import styled from 'styled-components';
import I18n from 'I18n';
import formatMediumMonthYear from 'I18n/utils/formatMediumMonthYear';
import { SimpleDate, compare, equals } from '../../core/SimpleDate';
import SyntheticEvent from '../../core/SyntheticEvent';
import H5 from '../../elements/headings/H5';
import lazyEval from '../../utils/lazyEval';
import { FONT_FAMILIES } from '../../utils/Styles';
/**
 * Moves values from the start of the array to the end.
 * @param {Array} arr
 * @param {Number} offset
 * @returns {Array}
 */

var rotateArrayBy = function rotateArrayBy(arr, offset) {
  var arrCopy = arr.slice();

  for (var i = 0; i < offset; i++) {
    var firstValue = arrCopy.shift();
    arrCopy.push(firstValue);
  }

  return arrCopy;
};
/**
 * Wrapper for the `SimpleDate` constructor that provides fallover if `month` is outside of the
 * valid range (0 - 11), using the native `Date` API.
 */


var safeSimpleDate = function safeSimpleDate(year, month, date) {
  var dateObject = new Date(year, month, date);
  return new SimpleDate(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
};
/**
 * @param {Number} year What year is it!?
 * @param {Number} month 0 for Jan, 1 for Feb, etc., à la Date
 * @param {Number} weekStartDay 0 for Sunday, 1 for Monday
 * @returns {Array} An array of arrays, where each array is a row of the calendar
 */


var computeWeeksOfMonth = function computeWeeksOfMonth(year, month, weekStartDay) {
  // Per the Date API convention, "date" = day of month, "day" = day of week.
  var monthStartDay = new Date(year, month).getDay();
  var monthEndDate = new Date(year, month + 1, 0).getDate();
  var weekEndDay = (weekStartDay + 6) % 7;
  var weeks = [[]]; // Get trailing dates from the previous month

  var startOffset = (monthStartDay - weekStartDay + 7) % 7 - 1;
  var prevMonthEndDate = new Date(year, month, 0).getDate();

  for (var date = prevMonthEndDate - startOffset; date <= prevMonthEndDate; date++) {
    weeks[0].push(safeSimpleDate(year, month - 1, date));
  }

  var week = 0;
  var day = monthStartDay;

  for (var _date = 1; _date <= monthEndDate; _date++) {
    weeks[week].push(safeSimpleDate(year, month, _date));

    if (day === weekEndDay) {
      week++;
      weeks.push([]);
    }

    day = (day + 1) % 7;
  } // Add leading dates for the next month until we have a full 6 weeks


  var endOffset = 7 * (6 - weeks.length) + 7 - weeks[week].length;

  for (var _date2 = 1; _date2 <= endOffset; _date2++) {
    weeks[week].push(safeSimpleDate(year, month + 1, _date2));

    if (day === weekEndDay && _date2 !== monthEndDate) {
      week++;
      weeks.push([]);
    }

    day = (day + 1) % 7;
  }

  return weeks;
};
/**
 * Returns the date corresponding to a Day from the DOM, based on its `data-` attrs.
 *
 * @param {HTMLElement} element
 * @returns {SimpleDate}
 */


var getDateForElement = function getDateForElement(element) {
  return new SimpleDate(+element.getAttribute('data-year'), +element.getAttribute('data-month'), +element.getAttribute('data-date'));
};
/**
 * Returns the locale-specific, formatted month-year string.
 *
 * @param {Number} year
 * @param {Number} month
 * @returns {String}
 */


var createFormattedMonthYear = function createFormattedMonthYear(month, year) {
  var dateValue = I18n.moment({
    year: year,
    month: month
  });
  return formatMediumMonthYear(dateValue);
};

var Wrapper = styled.div.withConfig({
  displayName: "AbstractMonth__Wrapper",
  componentId: "sc-1hcvtzr-0"
})(["cursor:default;width:260px;height:260px;"]);
var Header = styled.div.withConfig({
  displayName: "AbstractMonth__Header",
  componentId: "sc-1hcvtzr-1"
})(["display:flex;height:42px;align-items:center;"]);
var Heading = styled(H5).withConfig({
  displayName: "AbstractMonth__Heading",
  componentId: "sc-1hcvtzr-2"
})(["display:inline-block;margin:0 auto;"]);
var Table = styled.table.withConfig({
  displayName: "AbstractMonth__Table",
  componentId: "sc-1hcvtzr-3"
})(["width:100%;table-layout:fixed;border-collapse:collapse;text-align:center;font-size:15px;"]);
var WeekdayHeading = styled.th.withConfig({
  displayName: "AbstractMonth__WeekdayHeading",
  componentId: "sc-1hcvtzr-4"
})(["padding:7px 0;color:", ";", ";"], SLINKY, FONT_FAMILIES.medium);
export default function AbstractMonth(props) {
  var focusedValue = props.focusedValue,
      maxValidationMessage = props.maxValidationMessage,
      minValidationMessage = props.minValidationMessage,
      children = props.children,
      disabledValues = props.disabledValues,
      leftControl = props.leftControl,
      max = props.max,
      min = props.min,
      month = props.month,
      onDateClick = props.onDateClick,
      onDateMouseEnter = props.onDateMouseEnter,
      onDateMouseLeave = props.onDateMouseLeave,
      ownerId = props.ownerId,
      rightControl = props.rightControl,
      today = props.today,
      weekdayHeadings = props.weekdayHeadings,
      weekStartDay = props.weekStartDay,
      year = props.year,
      rest = _objectWithoutProperties(props, ["focusedValue", "maxValidationMessage", "minValidationMessage", "children", "disabledValues", "leftControl", "max", "min", "month", "onDateClick", "onDateMouseEnter", "onDateMouseLeave", "ownerId", "rightControl", "today", "weekdayHeadings", "weekStartDay", "year"]); // Convert year and month values to I18N timestamp to make use of format utils #8640


  var formattedMonthYear = useMemo(function () {
    return createFormattedMonthYear(month, year);
  }, [month, year]);
  return /*#__PURE__*/_jsxs(Wrapper, Object.assign({}, rest, {
    children: [/*#__PURE__*/_jsxs(Header, {
      children: [leftControl, /*#__PURE__*/_jsx(Heading, {
        "aria-hidden": true,
        children: formattedMonthYear
      }), rightControl]
    }), /*#__PURE__*/_jsxs(Table, {
      role: "presentation",
      children: [/*#__PURE__*/_jsx("thead", {
        "aria-hidden": true,
        children: /*#__PURE__*/_jsx("tr", {
          children: rotateArrayBy(weekdayHeadings, weekStartDay).map(function (weekdayHeading, i) {
            return /*#__PURE__*/_jsx(WeekdayHeading, {
              children: weekdayHeading
            }, i);
          })
        })
      }), /*#__PURE__*/_jsx("tbody", {
        children: computeWeeksOfMonth(year, month, weekStartDay).map(function (week, i) {
          return /*#__PURE__*/_jsx("tr", {
            children: week.map(function (simpleDate, index) {
              var lessThanMin = min && compare(simpleDate, min) === -1;
              var moreThanMax = max && compare(simpleDate, max) === 1;
              var inDisabledValues = disabledValues && disabledValues.some(function (disabledValue) {
                return equals(simpleDate, disabledValue);
              });
              var isDisabled = lessThanMin || moreThanMax || inDisabledValues;
              var isFocused = equals(simpleDate, focusedValue);
              return children(simpleDate, {
                id: ownerId + "-" + simpleDate.month + "-" + simpleDate.date,
                'data-date': simpleDate.date,
                'data-month': simpleDate.month,
                'data-year': simpleDate.year,
                key: index,
                role: 'menuitem',
                onClick: isDisabled ? undefined : function (evt) {
                  onDateClick(SyntheticEvent(getDateForElement(evt.currentTarget)));
                },
                onMouseEnter: isDisabled || !onDateMouseEnter ? undefined : function (evt) {
                  onDateMouseEnter(SyntheticEvent(getDateForElement(evt.currentTarget)));
                },
                onMouseLeave: isDisabled || !onDateMouseLeave ? undefined : function (evt) {
                  onDateMouseLeave(SyntheticEvent(getDateForElement(evt.currentTarget)));
                },
                isCurrentMonth: simpleDate.month === month,
                isDisabled: isDisabled,
                isToday: equals(simpleDate, today),
                tooltip: lazyEval(lessThanMin && minValidationMessage || moreThanMax && maxValidationMessage),
                tooltipOpen: isFocused || undefined
              });
            })
          }, i);
        })
      })]
    })]
  }));
}