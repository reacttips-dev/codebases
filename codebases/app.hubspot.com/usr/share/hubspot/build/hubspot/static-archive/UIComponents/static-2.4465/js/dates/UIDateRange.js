'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useContext, useMemo, useRef, useState, useEffect } from 'react';
import usePrevious from 'react-utils/hooks/usePrevious';
import useUniqueId from 'react-utils/hooks/useUniqueId';
import invariant from 'react-utils/invariant';
import styled from 'styled-components';
import cx from 'classnames';
import { FieldsetContext } from '../context/FieldsetContext';
import { compare } from '../core/SimpleDate';
import { SimpleDateRangeRecord } from '../core/SimpleDateRange';
import SyntheticEvent from '../core/SyntheticEvent';
import Controllable from '../decorators/Controllable';
import ShareInput from '../decorators/ShareInput';
import { SimpleDateType } from '../types/SimpleDateTypes';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import { hidden } from '../utils/propTypes/decorators';
import { LAST_MONTH, LAST_QUARTER, LAST_THIRTY_DAYS, LAST_THREE_MONTHS, LAST_WEEK, LAST_YEAR, THIS_MONTH, THIS_QUARTER, THIS_WEEK, THIS_YEAR, TODAY, YESTERDAY } from './dateRangePresets';
import { getPageFromDate } from './internal/calendarUtils';
import DateRangePopover from './internal/DateRangePopover';
import UsesToday from './internal/UsesToday';
import UIDateInput from './UIDateInput';
var Wrapper = styled.div.withConfig({
  displayName: "UIDateRange__Wrapper",
  componentId: "egragw-0"
})(["display:flex;& > *{flex:1 1 0%;}"]);
var Separator = styled.div.withConfig({
  displayName: "UIDateRange__Separator",
  componentId: "egragw-1"
})(["flex-grow:0;align-self:center;flex-basis:auto;padding:0 10px;"]);
var UIDateRange = memoWithDisplayName('UIDateRange', function (props) {
  var ariaDescribedBy = props['aria-describedby'],
      ariaInvalid = props['aria-invalid'],
      ariaLabelledBy = props['aria-labelledby'],
      ariaRequired = props['aria-required'],
      calendarPage = props.calendarPage,
      clearLabel = props.clearLabel,
      DateInput = props.DateInput,
      disabled = props.disabled,
      endInputRefProp = props.endInputRef,
      error = props.error,
      format = props.format,
      id = props.id,
      inputRef = props.inputRef,
      min = props.min,
      minValidationMessage = props.minValidationMessage,
      max = props.max,
      maxValidationMessage = props.maxValidationMessage,
      onCalendarPageChange = props.onCalendarPageChange,
      _onChange = props.onChange,
      onOpenChange = props.onOpenChange,
      open = props.open,
      presets = props.presets,
      readOnly = props.readOnly,
      required = props.required,
      showPresets = props.showPresets,
      use = props.use,
      today = props.today,
      tz = props.tz,
      value = props.value,
      rest = _objectWithoutProperties(props, ["aria-describedby", "aria-invalid", "aria-labelledby", "aria-required", "calendarPage", "clearLabel", "DateInput", "disabled", "endInputRef", "error", "format", "id", "inputRef", "min", "minValidationMessage", "max", "maxValidationMessage", "onCalendarPageChange", "onChange", "onOpenChange", "open", "presets", "readOnly", "required", "showPresets", "use", "today", "tz", "value"]);

  if (process.env.NODE_ENV !== 'production') {
    invariant(!(value instanceof SimpleDateRangeRecord), "UIDateRange's value uses plain objects instead of SimpleDateRange. Make sure you're not relying on SimpleDateRange methods when using values from the onChange handlers.");
  }

  var computedValue = useMemo(function () {
    var obj = {
      startDate: null,
      endDate: null
    };

    if (value) {
      var presetId = value.presetId,
          _startDate = value.startDate,
          _endDate = value.endDate,
          getValue = value.getValue;
      if (presetId) obj.presetId = presetId;
      if (_startDate) obj.startDate = _startDate;
      if (_endDate) obj.endDate = _endDate;
      if (getValue) Object.assign(obj, getValue(tz));
    }

    return obj;
  }, [value, tz]);
  var startDate = computedValue.startDate,
      endDate = computedValue.endDate; // Values used for internal state

  var _useState = useState(startDate),
      _useState2 = _slicedToArray(_useState, 2),
      startDateInputValue = _useState2[0],
      setStartDateInputValue = _useState2[1];

  var _useState3 = useState(endDate),
      _useState4 = _slicedToArray(_useState3, 2),
      endDateInputValue = _useState4[0],
      setEndDateInputValue = _useState4[1];

  var computedInternalValue = useMemo(function () {
    return Object.assign({}, computedValue, {
      startDate: startDateInputValue,
      endDate: endDateInputValue
    });
  }, [computedValue, startDateInputValue, endDateInputValue]); // Values used in event handlers

  var startDateInputValueRef = useRef();
  startDateInputValueRef.current = startDateInputValue;
  var endDateInputValueRef = useRef();
  endDateInputValueRef.current = endDateInputValue; // Handle external value changes

  useEffect(function () {
    if (startDateInputValue !== startDate) {
      setStartDateInputValue(startDate);
    }

    if (endDateInputValue !== endDate) {
      setEndDateInputValue(endDate);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [startDate, endDate]);
  var fieldsetContext = useContext(FieldsetContext);
  var computedDisabled = disabled || fieldsetContext.disabled;
  var inputProps = {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    disabled: computedDisabled,
    format: format,
    max: max,
    min: min,
    readOnly: readOnly,
    required: required,
    use: use
  };

  var _useState5 = useState(null),
      _useState6 = _slicedToArray(_useState5, 2),
      activeBound = _useState6[0],
      setActiveBound = _useState6[1];

  var prevActiveBound = usePrevious(activeBound);
  var calendarId = useUniqueId("uidaterange-");
  var startLabelId = useUniqueId("uidaterange-start-label-");
  var endLabelId = useUniqueId("uidaterange-end-label-");
  var endInputRef = endInputRefProp || useRef(null);

  var handleKeyDown = function handleKeyDown(evt) {
    var key = evt.key;

    if (key === 'Escape') {
      if (!open || !onOpenChange) return;
      evt.preventDefault();
      onOpenChange(SyntheticEvent(false));
    }
  };

  return /*#__PURE__*/_jsx(DateRangePopover // Edge case: If `open` and `activeBound` becomes null (e.g. when window loses focus), reset the activeBound
  , {
    activeBound: open && activeBound === null ? prevActiveBound : activeBound,
    calendarId: calendarId,
    calendarPage: calendarPage,
    clearLabel: clearLabel,
    max: max,
    maxValidationMessage: maxValidationMessage,
    min: min,
    minValidationMessage: minValidationMessage,
    onActiveBoundChange: function onActiveBoundChange(evt) {
      (evt.target.value === 'end' ? endInputRef : inputRef).current.focus();
    },
    onCalendarPageChange: onCalendarPageChange,
    onChange: function onChange(evt) {
      _onChange(evt); // If the user just picked an end date, close the popover.


      var newValue = evt.target.value;
      if (newValue.endDate !== endDate) onOpenChange(SyntheticEvent(false));
    },
    onOpenChange: onOpenChange,
    open: open && !computedDisabled && !readOnly,
    presets: presets,
    showPresets: showPresets,
    today: today,
    tz: tz,
    value: computedInternalValue,
    onFocusLeave: function onFocusLeave() {
      return (// If focus leaves the popover and either input isn't active, close it
        activeBound === null && onOpenChange(SyntheticEvent(false))
      );
    },
    children: /*#__PURE__*/_jsxs(Wrapper, Object.assign({}, rest, {
      children: [/*#__PURE__*/_jsx("span", {
        className: "sr-only",
        id: startLabelId,
        children: I18n.text('ui.dateRange.startDate')
      }), /*#__PURE__*/_jsx("span", {
        className: "sr-only",
        id: endLabelId,
        children: I18n.text('ui.dateRange.endDate')
      }), /*#__PURE__*/_jsx(DateInput, Object.assign({}, inputProps, {
        "aria-labelledby": cx(ariaLabelledBy, startLabelId),
        error: error || !!(startDateInputValue && endDate && compare(startDateInputValue, endDate) === 1),
        id: id
        /* support the htmlFor from UIFormControl */
        ,
        inputRef: inputRef,
        onChange: function onChange(_ref) {
          var newStartDate = _ref.target.value;
          setStartDateInputValue(newStartDate);

          if (!endDateInputValue || newStartDate === null || compare(newStartDate, endDateInputValue) !== 1) {
            // Make sure the calendar view shows the new selection.
            onCalendarPageChange(SyntheticEvent(getPageFromDate(newStartDate)));

            _onChange(SyntheticEvent(Object.assign({}, computedValue, {
              startDate: newStartDate,
              endDate: endDateInputValueRef.current
            })));
          }
        },
        onFocus: function onFocus() {
          if (readOnly || computedDisabled) return;
          setActiveBound('start');
          onCalendarPageChange(SyntheticEvent(getPageFromDate(startDateInputValue)));
        },
        onBlur: function onBlur() {
          if (readOnly || computedDisabled) return;
          setActiveBound(null);
        },
        onOpenChange: onOpenChange,
        onKeyDown: handleKeyDown,
        open: false,
        originDate: endDate,
        tz: tz,
        value: startDateInputValue
      })), /*#__PURE__*/_jsx(Separator, {
        children: I18n.text('ui.dateRange.to')
      }), /*#__PURE__*/_jsx(DateInput, Object.assign({}, inputProps, {
        "aria-labelledby": cx(ariaLabelledBy, endLabelId),
        error: error || !!(startDate && endDateInputValue && compare(startDate, endDateInputValue) === 1),
        inputRef: endInputRef,
        onChange: function onChange(_ref2) {
          var newEndDate = _ref2.target.value;
          setEndDateInputValue(newEndDate);

          if (!startDateInputValue || newEndDate === null || compare(startDateInputValue, newEndDate) !== 1) {
            // Make sure the calendar view shows the new selection.
            onCalendarPageChange(SyntheticEvent(getPageFromDate(newEndDate)));

            _onChange(SyntheticEvent(Object.assign({}, computedValue, {
              startDate: startDateInputValueRef.current,
              endDate: newEndDate
            })));
          }
        },
        onFocus: function onFocus() {
          if (readOnly || computedDisabled) return;
          setActiveBound('end');
          onCalendarPageChange(SyntheticEvent(getPageFromDate(endDateInputValue)));
        },
        onBlur: function onBlur() {
          if (readOnly || computedDisabled) return;
          setActiveBound(null);
        },
        onOpenChange: onOpenChange,
        onKeyDown: handleKeyDown,
        open: false,
        originDate: startDate,
        tz: tz,
        value: endDateInputValue
      }))]
    }))
  });
});
var dateRangeValueType = PropTypes.shape({
  startDate: SimpleDateType,
  endDate: SimpleDateType
});
var dateRangePresetType = PropTypes.shape({
  presetId: PropTypes.string.isRequired,
  getValue: PropTypes.func.isRequired,
  getText: PropTypes.func.isRequired
});
var valueOrPresetType = PropTypes.oneOfType([dateRangeValueType, dateRangePresetType]);
UIDateRange.propTypes = {
  calendarPage: UIDateInput.propTypes.calendarPage,
  clearLabel: UIDateInput.propTypes.clearLabel,
  disabled: PropTypes.bool,
  DateInput: hidden(PropTypes.elementType),
  endInputRef: hidden(UIDateInput.propTypes.inputRef),
  error: PropTypes.bool,
  format: UIDateInput.propTypes.format,
  inputRef: UIDateInput.propTypes.inputRef,
  max: UIDateInput.propTypes.max,
  maxValidationMessage: UIDateInput.propTypes.maxValidationMessage,
  min: UIDateInput.propTypes.min,
  minValidationMessage: UIDateInput.propTypes.minValidationMessage,
  onCalendarPageChange: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  presets: PropTypes.arrayOf(dateRangePresetType.isRequired).isRequired,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  showPresets: PropTypes.bool,
  tz: UIDateInput.propTypes.tz,
  use: UIDateInput.propTypes.use,
  today: SimpleDateType.isRequired,
  value: valueOrPresetType
};
UIDateRange.defaultProps = {
  clearLabel: UIDateInput.defaultProps.clearLabel,
  DateInput: UIDateInput,
  format: 'L',
  open: false,
  maxValidationMessage: UIDateInput.defaultProps.maxValidationMessage,
  minValidationMessage: UIDateInput.defaultProps.minValidationMessage,
  presets: [TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, LAST_THIRTY_DAYS, LAST_THREE_MONTHS, THIS_QUARTER, LAST_QUARTER, LAST_YEAR, THIS_YEAR],
  showPresets: true,
  value: {
    startDate: null,
    endDate: null
  }
};
export default ShareInput(Controllable(UsesToday(UIDateRange), ['calendarPage', 'open', 'value']));