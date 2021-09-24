'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compare, isDateInRange } from '../../core/SimpleDate';
import SyntheticEvent from '../../core/SyntheticEvent';
import UITooltip from '../../tooltip/UITooltip';
import { SimpleDateType } from '../../types/SimpleDateTypes';
import lazyEval from '../../utils/lazyEval';
import createLazyPropType from '../../utils/propTypes/createLazyPropType';
import CalendarFooterButton from './CalendarFooterButton';
var Outer = styled.div.withConfig({
  displayName: "CalendarFooterButtons__Outer",
  componentId: "sc-9znfwh-0"
})(["display:flex;justify-content:space-between;margin:16px 0 20px;"]);
var FooterButton = styled(CalendarFooterButton).withConfig({
  displayName: "CalendarFooterButtons__FooterButton",
  componentId: "sc-9znfwh-1"
})(["flex-basis:50%;"]);
export default function CalendarFooterButtons(props) {
  var clearLabel = props.clearLabel,
      max = props.max,
      maxValidationMessage = props.maxValidationMessage,
      min = props.min,
      minValidationMessage = props.minValidationMessage,
      onChange = props.onChange,
      today = props.today,
      todayLabel = props.todayLabel,
      rest = _objectWithoutProperties(props, ["clearLabel", "max", "maxValidationMessage", "min", "minValidationMessage", "onChange", "today", "todayLabel"]);

  var todayButtonDisabled = !isDateInRange(today, min, max);
  return /*#__PURE__*/_jsxs(Outer, Object.assign({}, rest, {
    children: [/*#__PURE__*/_jsx(UITooltip, {
      title: todayButtonDisabled && lazyEval(min && compare(today, min) === -1 ? minValidationMessage : maxValidationMessage),
      children: /*#__PURE__*/_jsx(FooterButton, {
        "data-action": "today",
        disabled: todayButtonDisabled,
        onClick: function onClick() {
          onChange(SyntheticEvent(today));
        },
        children: lazyEval(todayLabel)
      })
    }), /*#__PURE__*/_jsx(FooterButton, {
      "data-action": "clear",
      onClick: function onClick() {
        onChange(SyntheticEvent(null));
      },
      children: lazyEval(clearLabel)
    })]
  }));
}

if (process.env.NODE_ENV !== 'production') {
  CalendarFooterButtons.propTypes = {
    clearable: PropTypes.bool,
    clearLabel: createLazyPropType(PropTypes.string).isRequired,
    max: SimpleDateType,
    maxValidationMessage: createLazyPropType(PropTypes.string),
    min: SimpleDateType,
    minValidationMessage: createLazyPropType(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    today: SimpleDateType.isRequired,
    todayLabel: createLazyPropType(PropTypes.string).isRequired
  };
}

CalendarFooterButtons.defaultProps = {
  clearable: true,
  clearLabel: function clearLabel() {
    return I18n.text('ui.datePicker.clear');
  },
  todayLabel: function todayLabel() {
    return I18n.text('ui.datePicker.today');
  }
};
CalendarFooterButtons.displayName = 'CalendarFooterButtons';