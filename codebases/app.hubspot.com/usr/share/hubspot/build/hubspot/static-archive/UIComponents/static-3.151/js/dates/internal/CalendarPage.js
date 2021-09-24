'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UIIconButton from '../../button/UIIconButton';
import { isValid, toMoment } from '../../core/SimpleDate';
import SyntheticEvent from '../../core/SyntheticEvent';
import UIIcon from '../../icon/UIIcon';
import { SimpleDateType } from '../../types/SimpleDateTypes';
import { getLocaleData } from '../../utils/Locale';
import { getPageFromDate, nextCalendarPage, prevCalendarPage } from './calendarUtils';
import Month from './Month';
var Wrapper = styled.div.withConfig({
  displayName: "CalendarPage__Wrapper",
  componentId: "sc-1xllbz4-0"
})(["display:inline-block;"]);
/**
 * @param {SimpleDate} value The current selected date, or null
 * @returns {String} A string for announcing the selected date to screen readers
 */

var getAlertText = function getAlertText(value) {
  return value ? I18n.text('ui.datePicker.dateSelected', {
    date: toMoment(value).format('LL')
  }) : I18n.text('ui.datePicker.noDateSelected');
};

var getCalendarPage = function getCalendarPage(calendarPage, value, today) {
  if (calendarPage) return calendarPage;
  if (isValid(value)) return getPageFromDate(value);
  return getPageFromDate(today);
};

export default function CalendarPage(props) {
  var calendarPage = props.calendarPage,
      id = props.id,
      onCalendarPageChange = props.onCalendarPageChange,
      today = props.today,
      value = props.value,
      rest = _objectWithoutProperties(props, ["calendarPage", "id", "onCalendarPageChange", "today", "value"]);

  var localeData = getLocaleData();
  var currentCalendarPage = getCalendarPage(calendarPage, value, today);
  var month = currentCalendarPage.month,
      year = currentCalendarPage.year;
  return /*#__PURE__*/_jsxs(Wrapper, {
    id: id,
    children: [/*#__PURE__*/_jsx("span", {
      className: "sr-only",
      "aria-live": "polite",
      "aria-atomic": true,
      children: getAlertText(value)
    }), /*#__PURE__*/_jsx(Month, Object.assign({}, rest, {
      month: month,
      leftControl: /*#__PURE__*/_jsx(UIIconButton, {
        "data-action": "prev-month",
        use: "transparent",
        "aria-label": I18n.text('ui.datePicker.prevMonth'),
        onClick: function onClick() {
          onCalendarPageChange(SyntheticEvent(prevCalendarPage(currentCalendarPage)));
        },
        children: /*#__PURE__*/_jsx(UIIcon, {
          name: "left",
          size: 22
        })
      }),
      ownerId: id,
      rightControl: /*#__PURE__*/_jsx(UIIconButton, {
        "data-action": "next-month",
        use: "transparent",
        "aria-label": I18n.text('ui.datePicker.nextMonth'),
        onClick: function onClick() {
          onCalendarPageChange(SyntheticEvent(nextCalendarPage(currentCalendarPage)));
        },
        children: /*#__PURE__*/_jsx(UIIcon, {
          name: "right",
          size: 22
        })
      }),
      today: today,
      weekdayHeadings: localeData._weekdaysMin,
      weekStartDay: localeData._week.dow,
      value: value,
      year: year
    }))]
  });
}
CalendarPage.displayName = 'CalendarPage';

if (process.env.NODE_ENV !== 'production') {
  CalendarPage.propTypes = {
    calendarPage: PropTypes.shape({
      year: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired
    }),
    id: PropTypes.string.isRequired,
    onCalendarPageChange: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    today: SimpleDateType.isRequired,
    value: SimpleDateType
  };
}