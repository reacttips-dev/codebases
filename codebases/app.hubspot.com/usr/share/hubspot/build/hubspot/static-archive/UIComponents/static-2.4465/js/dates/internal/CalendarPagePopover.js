'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import UIControlledPopover from '../../tooltip/UIControlledPopover';
import { SimpleDateType } from '../../types/SimpleDateTypes';
import createLazyPropType from '../../utils/propTypes/createLazyPropType';
import CalendarFooterButtons from './CalendarFooterButtons';
import CalendarPage from './CalendarPage';

var CalendarPagePopover = function CalendarPagePopover(props) {
  var calendarId = props.calendarId,
      clearLabel = props.clearLabel,
      max = props.max,
      maxValidationMessage = props.maxValidationMessage,
      min = props.min,
      minValidationMessage = props.minValidationMessage,
      onChange = props.onChange,
      today = props.today,
      todayLabel = props.todayLabel,
      children = props.children,
      id = props.id,
      onFocusLeave = props.onFocusLeave,
      onOpenChange = props.onOpenChange,
      open = props.open,
      rest = _objectWithoutProperties(props, ["calendarId", "clearLabel", "max", "maxValidationMessage", "min", "minValidationMessage", "onChange", "today", "todayLabel", "children", "id", "onFocusLeave", "onOpenChange", "open"]);

  return /*#__PURE__*/_jsx(UIControlledPopover, {
    arrowSize: "none",
    autoPlacement: "vert",
    content: {
      body: /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(CalendarPage, Object.assign({}, rest, {
          id: calendarId,
          max: max,
          maxValidationMessage: maxValidationMessage,
          min: min,
          minValidationMessage: minValidationMessage,
          onChange: onChange,
          tabIndex: -1,
          today: today
        })), /*#__PURE__*/_jsx(CalendarFooterButtons, {
          clearLabel: clearLabel,
          max: max,
          maxValidationMessage: maxValidationMessage,
          min: min,
          minValidationMessage: minValidationMessage,
          onChange: onChange,
          today: today,
          todayLabel: todayLabel
        })]
      })
    },
    onOpenChange: onOpenChange,
    pinToConstraint: ['left', 'right'],
    placement: "bottom right",
    id: id,
    onFocusLeave: onFocusLeave,
    open: open,
    children: children
  });
};

if (process.env.NODE_ENV !== 'production') {
  CalendarPagePopover.propTypes = {
    calendarId: PropTypes.string.isRequired,
    calendarPage: PropTypes.shape({
      year: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired
    }),
    children: PropTypes.node.isRequired,
    clearLabel: createLazyPropType(PropTypes.string),
    max: SimpleDateType,
    maxValidationMessage: createLazyPropType(PropTypes.string),
    min: SimpleDateType,
    minValidationMessage: createLazyPropType(PropTypes.string),
    onCalendarPageChange: PropTypes.func.isRequired,
    onChange: CalendarPage.propTypes.onChange,
    onFocusLeave: UIControlledPopover.propTypes.onFocusLeave,
    onOpenChange: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    today: SimpleDateType.isRequired,
    todayLabel: createLazyPropType(PropTypes.string),
    value: CalendarPage.propTypes.value
  };
}

export default CalendarPagePopover;