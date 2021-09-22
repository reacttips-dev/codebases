import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getTimeFormat } from '../../../utils/date';
import { FORMAT_24H, HEIGHT_OF_HOUR } from '../../../config/constants';
import classes from '../scss/_calendar.scss';

const hourLabel = (props) => {
	const { hour, timeFormat } = props;
	const hourValue = moment(`${hour}:00`, FORMAT_24H).format(timeFormat);
	const top = hour * HEIGHT_OF_HOUR + HEIGHT_OF_HOUR / 4;
	const divStyle = {
		top: `${top}px`,
	};

	return (
		<div className={classes.hourLabel} style={divStyle}>
			{hourValue}
		</div>
	);
};

hourLabel.propTypes = {
	hour: PropTypes.number.isRequired,
	timeFormat: PropTypes.string,
};

hourLabel.defaultProps = {
	timeFormat: getTimeFormat(),
};

export default hourLabel;
