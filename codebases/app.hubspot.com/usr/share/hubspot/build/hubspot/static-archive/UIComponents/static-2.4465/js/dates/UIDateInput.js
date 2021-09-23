'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import useUniqueId from 'react-utils/hooks/useUniqueId';
import { FieldsetContext } from '../context/FieldsetContext';
import { isDateInRange, isValid } from '../core/SimpleDate';
import SyntheticEvent from '../core/SyntheticEvent';
import Controllable from '../decorators/Controllable';
import ShareInput from '../decorators/ShareInput';
import UIInputIconWrapper from '../input/internal/UIInputIconWrapper';
import UITextInput from '../input/UITextInput';
import { SimpleDateType } from '../types/SimpleDateTypes';
import { listAttrIncludes } from '../utils/Dom';
import { preventDefaultHandler } from '../utils/DomEvents';
import { getDatePlaceholder, getLocalizedDateFormat } from '../utils/Locale';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import { hidden } from '../utils/propTypes/decorators';
import deprecated from '../utils/propTypes/deprecated';
import refObject from '../utils/propTypes/refObject';
import AbstractCalendar from './internal/AbstractCalendar';
import CalendarPagePopover from './internal/CalendarPagePopover';
import UsesToday from './internal/UsesToday';

var isValidValue = function isValidValue(value, minValue, maxValue) {
  if (value == null) return true;
  if (!isValid(value)) return false;
  return isDateInRange(value, minValue, maxValue);
};

var UIDateInput = memoWithDisplayName('UIDateInput', function (props) {
  var ariaInvalid = props['aria-invalid'],
      ariaLabel = props['aria-label'],
      ariaLabelledBy = props['aria-labelledby'],
      ariaRequired = props['aria-required'],
      autoFocus = props.autoFocus,
      calendarPage = props.calendarPage,
      className = props.className,
      clearLabel = props.clearLabel,
      disabled = props.disabled,
      disabledValues = props.disabledValues,
      error = props.error,
      focusedValue = props.focusedValue,
      format = props.format,
      iconSize = props.iconSize,
      id = props.id,
      Input = props.Input,
      inputRef = props.inputRef,
      inputWidth = props.inputWidth,
      min = props.min,
      minValue = props.minValue,
      max = props.max,
      maxValue = props.maxValue,
      maxValidationMessage = props.maxValidationMessage,
      maxValueValidationMessage = props.maxValueValidationMessage,
      minValidationMessage = props.minValidationMessage,
      minValueValidationMessage = props.minValueValidationMessage,
      name = props.name,
      onCalendarPageChange = props.onCalendarPageChange,
      onChange = props.onChange,
      __onFocusedValueChange = props.onFocusedValueChange,
      onOpenChange = props.onOpenChange,
      open = props.open,
      readOnly = props.readOnly,
      required = props.required,
      today = props.today,
      todayLabel = props.todayLabel,
      use = props.use,
      value = props.value,
      rest = _objectWithoutProperties(props, ["aria-invalid", "aria-label", "aria-labelledby", "aria-required", "autoFocus", "calendarPage", "className", "clearLabel", "disabled", "disabledValues", "error", "focusedValue", "format", "iconSize", "id", "Input", "inputRef", "inputWidth", "min", "minValue", "max", "maxValue", "maxValidationMessage", "maxValueValidationMessage", "minValidationMessage", "minValueValidationMessage", "name", "onCalendarPageChange", "onChange", "onFocusedValueChange", "onOpenChange", "open", "readOnly", "required", "today", "todayLabel", "use", "value"]);

  var calendarId = useUniqueId('dateinput-calendar-');
  var popoverId = useUniqueId('dateinput-popover-');
  var fieldsetContext = useContext(FieldsetContext);
  var computedDisabled = disabled || fieldsetContext.disabled;

  var triggerOpen = function triggerOpen() {
    if (readOnly || computedDisabled) return;
    onOpenChange(SyntheticEvent(true));
  };

  return /*#__PURE__*/_jsx(AbstractCalendar, Object.assign({}, props, {
    children: function children(_ref) {
      var onInputChange = _ref.onInputChange,
          onKeyDown = _ref.onKeyDown,
          onKeyUp = _ref.onKeyUp,
          onBlur = _ref.onBlur,
          inputValue = _ref.inputValue;
      return /*#__PURE__*/_jsx(CalendarPagePopover, {
        calendarId: calendarId,
        calendarPage: calendarPage,
        clearLabel: clearLabel,
        disabledValues: disabledValues,
        focusedValue: focusedValue,
        id: popoverId,
        max: max || maxValue,
        min: min || minValue,
        maxValidationMessage: maxValidationMessage || maxValueValidationMessage,
        minValidationMessage: minValidationMessage || minValueValidationMessage,
        onCalendarPageChange: onCalendarPageChange,
        onChange: onChange,
        onFocusLeave: function onFocusLeave() {
          onOpenChange(SyntheticEvent(false));
        },
        onMouseDown: preventDefaultHandler
        /* keep input focused */
        ,
        onOpenChange: onOpenChange,
        open: open && !computedDisabled && !readOnly,
        today: today,
        todayLabel: todayLabel,
        value: value,
        children: /*#__PURE__*/_jsx(UIInputIconWrapper, Object.assign({}, rest, {
          className: className,
          disabled: computedDisabled,
          iconName: "date",
          size: iconSize || fieldsetContext.size,
          children: /*#__PURE__*/_jsx(Input, {
            "aria-invalid": error ? 'true' : ariaInvalid,
            "aria-label": ariaLabel,
            "aria-labelledby": ariaLabelledBy,
            "aria-required": ariaRequired,
            autoComplete: "off",
            autoFocus: autoFocus,
            className: listAttrIncludes(className, 'private-form__control--inline') ? 'private-form__control--inline' : undefined,
            "data-format": getLocalizedDateFormat(format),
            disabled: computedDisabled,
            error: error || !isValidValue(value, minValue, maxValue),
            id: id,
            inputRef: inputRef,
            name: name,
            onBlur: onBlur,
            onChange: onInputChange,
            onClick: triggerOpen,
            onFocus: function onFocus(evt) {
              if (readOnly || computedDisabled) return;
              evt.target.select(); // inputRef is not yet available (see facebook/react#7769)

              triggerOpen();
            },
            onKeyDown: onKeyDown,
            onKeyUp: onKeyUp,
            placeholder: getDatePlaceholder(format),
            readOnly: readOnly,
            required: required,
            use: use,
            value: inputValue,
            width: inputWidth
          })
        }))
      });
    }
  }));
});

var deprecatedMinMaxMessage = function deprecatedMinMaxMessage(propName) {
  var newPropName = propName.replace('Value', '');
  return {
    message: "UIDateInput: The `" + propName + "` prop is deprecated. Use `" + newPropName + "` instead.",
    key: 'UIDateInput-old-minmax'
  };
};

UIDateInput.propTypes = {
  'aria-invalid': PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string,
  'aria-required': PropTypes.bool,
  autoFocus: PropTypes.bool,
  calendarPage: hidden(PropTypes.shape({
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired
  })),
  clearLabel: createLazyPropType(PropTypes.string),
  disabled: PropTypes.bool,
  disabledValues: PropTypes.arrayOf(SimpleDateType),
  error: PropTypes.bool,
  focusedValue: hidden(SimpleDateType),
  format: PropTypes.oneOf(['L', 'YYYY-MM-DD']).isRequired,
  iconSize: hidden(PropTypes.number),
  id: PropTypes.string,
  Input: hidden(PropTypes.elementType.isRequired),
  inputRef: refObject.isRequired,
  inputWidth: hidden(PropTypes.number),
  max: SimpleDateType,
  maxValidationMessage: createLazyPropType(PropTypes.string),
  maxValue: deprecated(SimpleDateType, deprecatedMinMaxMessage),
  maxValueValidationMessage: deprecated(createLazyPropType(PropTypes.string), deprecatedMinMaxMessage),
  min: SimpleDateType,
  minValue: deprecated(SimpleDateType, deprecatedMinMaxMessage),
  minValidationMessage: createLazyPropType(PropTypes.string),
  minValueValidationMessage: deprecated(createLazyPropType(PropTypes.string), deprecatedMinMaxMessage),
  name: PropTypes.string,
  onCalendarPageChange: hidden(PropTypes.func.isRequired),
  onChange: PropTypes.func.isRequired,
  onFocusedValueChange: hidden(PropTypes.func.isRequired),
  onOpenChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  today: SimpleDateType.isRequired,
  todayLabel: createLazyPropType(PropTypes.string),
  use: UITextInput.propTypes.use,
  value: SimpleDateType
};
UIDateInput.defaultProps = {
  clearLabel: function clearLabel() {
    return I18n.text('ui.datePicker.clear');
  },
  format: 'L',
  Input: UITextInput,
  maxValidationMessage: function maxValidationMessage() {
    return I18n.text('ui.datePicker.dateAboveMax');
  },
  minValidationMessage: function minValidationMessage() {
    return I18n.text('ui.datePicker.dateBelowMin');
  },
  open: false,
  todayLabel: function todayLabel() {
    return I18n.text('ui.datePicker.today');
  }
};
export default ShareInput(Controllable(UsesToday(UIDateInput), ['calendarPage', 'focusedValue', 'open', 'value']));