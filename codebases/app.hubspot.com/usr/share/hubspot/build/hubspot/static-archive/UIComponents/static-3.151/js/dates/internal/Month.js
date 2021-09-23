'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { equals } from '../../core/SimpleDate';
import { SimpleDateType } from '../../types/SimpleDateTypes';
import createLazyPropType from '../../utils/propTypes/createLazyPropType';
import AbstractMonth from './AbstractMonth';
import Day from './Day';
export default function Month(props) {
  var month = props.month,
      onChange = props.onChange,
      value = props.value,
      rest = _objectWithoutProperties(props, ["month", "onChange", "value"]);

  return /*#__PURE__*/_jsx(AbstractMonth, Object.assign({}, rest, {
    month: month,
    onDateClick: onChange,
    children: function children(simpleDate, dayProps) {
      var isSelected = equals(simpleDate, value);
      return /*#__PURE__*/_jsx(Day, Object.assign({}, dayProps, {
        isSelected: isSelected,
        children: simpleDate.date
      }));
    }
  }));
}

if (process.env.NODE_ENV !== 'production') {
  Month.propTypes = {
    disabledValues: PropTypes.array,
    focusedValue: SimpleDateType,
    leftControl: PropTypes.node,
    max: SimpleDateType,
    maxValidationMessage: createLazyPropType(PropTypes.string).isRequired,
    min: SimpleDateType,
    minValidationMessage: createLazyPropType(PropTypes.string).isRequired,
    month: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    ownerId: PropTypes.string.isRequired,
    rightControl: PropTypes.node,
    today: SimpleDateType.isRequired,
    value: SimpleDateType,
    weekdayHeadings: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    weekStartDay: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired
  };
}