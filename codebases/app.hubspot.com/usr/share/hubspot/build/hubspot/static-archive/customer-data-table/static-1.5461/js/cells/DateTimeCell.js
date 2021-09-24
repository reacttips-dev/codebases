'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { getDateLabel } from 'customer-data-table/utils/dateTimeFunctions';
import EmptyState from '../Components/EmptyState';
import FormattedDateTime from 'I18n/components/FormattedDateTime';
import PropTypes from 'prop-types';
import { memo } from 'react';
import TimezoneTypes from 'I18n/constants/TimezoneTypes';

var DateTimeCell = function DateTimeCell(props) {
  var _props$format = props.format,
      format = _props$format === void 0 ? 'll' : _props$format,
      i18nTimezoneType = props.i18nTimezoneType,
      value = props.value,
      showTime = props.showTime;

  if (!value) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  var label = getDateLabel(Number(value), showTime, i18nTimezoneType);

  if (label) {
    return /*#__PURE__*/_jsx("span", {
      className: "text-left",
      children: label
    });
  }

  return /*#__PURE__*/_jsx(FormattedDateTime, {
    format: format,
    type: i18nTimezoneType,
    value: Number(value)
  });
};

DateTimeCell.propTypes = {
  format: PropTypes.string,
  i18nTimezoneType: PropTypes.oneOf([TimezoneTypes.PORTAL, TimezoneTypes.USER, TimezoneTypes.UTC]).isRequired,
  showTime: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
export default /*#__PURE__*/memo(DateTimeCell);