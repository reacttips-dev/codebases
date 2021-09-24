'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import TimezoneTypes from '../constants/TimezoneTypes';
import formatShortDate from '../utils/formatShortDate';
import formatMediumDate from '../utils/formatMediumDate';
import formatShortMY from '../utils/formatShortMonthYear';
import formatMediumMY from '../utils/formatMediumMonthYear';
import formatShortQY from '../utils/formatShortQuarterYear';
import formatShortFullDate from '../utils/formatShortFullDate';
import formatMediumFullDate from '../utils/formatMediumFullDate';
var extraFormats = {
  'short-date': formatShortDate,
  'medium-date': formatMediumDate,
  'short-full-date': formatShortFullDate,
  'medium-full-date': formatMediumFullDate,
  'short-m-y': formatShortMY,
  'medium-m-y': formatMediumMY,
  'short-q-y': formatShortQY
};
export default createReactClass({
  displayName: "FormattedDateTime",
  propTypes: {
    format: PropTypes.string,
    type: PropTypes.oneOf([TimezoneTypes.PORTAL, TimezoneTypes.USER, TimezoneTypes.UTC]).isRequired,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]).isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      type: TimezoneTypes.PORTAL
    };
  },
  render: function render() {
    var _this$props = this.props,
        value = _this$props.value,
        format = _this$props.format,
        type = _this$props.type;
    var specialFormatter = extraFormats[format];
    var date = '';

    if (specialFormatter) {
      date = specialFormatter(value, type);
    } else {
      date = I18n.moment[type](value).format(format);
    }

    return /*#__PURE__*/_jsx("span", {
      children: date
    });
  }
});