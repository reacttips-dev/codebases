import moment from 'moment';
import { getTimeFormat } from '../../../utils/date';

export const durationLabel = ({ startDateTime, endDateTime }) => {
	const timeFormat = getTimeFormat(true);
	const duration = [];

	if (startDateTime) {
		const start = `${moment(startDateTime).format(timeFormat)}`;
		const startTime = endDateTime ? `${start} →` : start;

		duration.push(startTime);
	}

	if (endDateTime) {
		duration.push(`${moment(endDateTime).format(timeFormat)}`);
	}

	return duration;
};

export const monthLabel = (utcDate) => moment.utc(utcDate).local().format('MMM').toUpperCase();

export const dateLabel = (date, dayDiff = 0) => {
	const day = moment(date).add(dayDiff, 'days');

	return {
		weekDay: moment(day).format('ddd'),
		dateOfDay: moment(day).format('D'),
		isToday: moment(day).startOf('day').diff(moment().startOf('day'), 'days') === 0,
	};
};

export const monthDayLabel = (utcDate) => moment.utc(utcDate).local().format('MMMM D');
