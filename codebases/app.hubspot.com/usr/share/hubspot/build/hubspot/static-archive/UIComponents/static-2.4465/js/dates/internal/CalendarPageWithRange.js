'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UIIconButton from '../../button/UIIconButton';
import { toMoment } from '../../core/SimpleDate';
import SyntheticEvent from '../../core/SyntheticEvent';
import UIIcon from '../../icon/UIIcon';
import { SimpleDateType } from '../../types/SimpleDateTypes';
import { getLocaleData } from '../../utils/Locale';
import { getPageFromDate, nextCalendarPage, prevCalendarPage } from './calendarUtils';
import MonthWithRange from './MonthWithRange';
var Wrapper = styled.div.withConfig({
  displayName: "CalendarPageWithRange__Wrapper",
  componentId: "sc-63nzgi-0"
})(["display:inline-block;"]);
/**
 * @param {SimpleDate} value
 * @returns {String} A string for announcing the given date to screen readers
 */

var getSpokenDate = function getSpokenDate(date) {
  return date != null ? toMoment(date).format('LL') : I18n.text('ui.datePicker.noDateSelected');
};
/**
 * @param {SimpleDateRange} value The current selected range
 * @returns {String} A string for announcing the selected date range to screen readers
 */


var getAlertText = function getAlertText(value) {
  return I18n.text('ui.dateRange.startDate') + ": " + getSpokenDate(value.startDate) + (", " + I18n.text('ui.dateRange.endDate') + ": " + getSpokenDate(value.endDate));
};

export default function CalendarPageWithRange(props) {
  var calendarPage = props.calendarPage,
      id = props.id,
      locale = props.locale,
      onCalendarPageChange = props.onCalendarPageChange,
      today = props.today,
      value = props.value,
      rest = _objectWithoutProperties(props, ["calendarPage", "id", "locale", "onCalendarPageChange", "today", "value"]);

  var localeData = getLocaleData(locale);
  var currentCalendarPage = calendarPage || getPageFromDate(value.startDate || today);
  var month = currentCalendarPage.month,
      year = currentCalendarPage.year;
  return /*#__PURE__*/_jsxs(Wrapper, {
    id: id,
    children: [/*#__PURE__*/_jsx("span", {
      className: "sr-only",
      "aria-live": "polite",
      "aria-atomic": true,
      children: getAlertText(value)
    }), /*#__PURE__*/_jsx(MonthWithRange, Object.assign({}, rest, {
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
CalendarPageWithRange.displayName = 'CalendarPageWithRange';

if (process.env.NODE_ENV !== 'production') {
  CalendarPageWithRange.propTypes = {
    calendarPage: PropTypes.shape({
      year: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired
    }),
    id: PropTypes.string.isRequired,
    locale: PropTypes.string,
    onCalendarPageChange: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    today: SimpleDateType.isRequired,
    value: MonthWithRange.propTypes.value
  };
}