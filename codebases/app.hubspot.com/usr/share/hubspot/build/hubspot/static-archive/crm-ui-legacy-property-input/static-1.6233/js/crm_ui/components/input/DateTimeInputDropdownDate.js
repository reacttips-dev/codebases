'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import I18n from 'I18n';
import { MOMENT_TYPES } from 'UIComponents/constants/MomentTypes';
import { SimpleDateType } from 'UIComponents/types/SimpleDateTypes';
import UIBox from 'UIComponents/layout/UIBox';
import CRMDateInput from '../../date/CRMDateInput';
var DateTimeInputDropdownDate = createReactClass({
  displayName: 'DateTimeInputDropdownDate',
  propTypes: {
    minValue: SimpleDateType,
    focusOnMount: PropTypes.bool,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    clearable: PropTypes.bool,
    'data-selenium-test': PropTypes.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      clearable: true
    };
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    var prevDate = this.props.value;
    var nextDate = nextProps.value;
    return !I18n.moment(prevDate).isSame(nextDate, 'day');
  },
  render: function render() {
    var _this$props = this.props,
        onChange = _this$props.onChange,
        minValue = _this$props.minValue,
        focusOnMount = _this$props.focusOnMount,
        value = _this$props.value,
        clearable = _this$props.clearable;
    return /*#__PURE__*/_jsx(UIBox, {
      grow: 0,
      shrink: 0,
      className: "m-right-2",
      "data-selenium-test": "date-time-input-dropdown-date",
      "data-selenium-test-date-time-input-dropdown-value": value,
      children: /*#__PURE__*/_jsx(CRMDateInput, {
        open: true,
        momentType: MOMENT_TYPES.USER,
        onChange: onChange,
        value: value,
        minValue: minValue,
        size: "small",
        clearable: clearable,
        ref: function ref(_ref) {
          return _ref && focusOnMount && _ref.focus();
        },
        "data-selenium-test": this.props['data-selenium-test']
      })
    });
  }
});
export default DateTimeInputDropdownDate;