import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/phoenix';
import { formatDateTimeDisplay, LONG_DATETIME_DISPLAY } from 'js/utils/DateTimeUtils';

class Time extends React.Component {
  static propTypes = {
    time: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
    format: PropTypes.string,
  };

  static defaultProps = {
    format: LONG_DATETIME_DISPLAY,
  };

  render() {
    const { time, format } = this.props;
    return <span>{formatDateTimeDisplay(time, format)}</span>;
  }
}

export default Time;
