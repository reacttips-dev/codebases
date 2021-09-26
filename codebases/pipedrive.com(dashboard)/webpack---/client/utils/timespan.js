import moment from 'moment-timezone';
import { DEFAULT_LOCALE } from '../../client/config/constants';
import { getLocalDateTime, getTimeFormatFromLocale } from './date';

const getDateFormat = (displayYear) => {
	return `dddd, MMMM D${displayYear ? ' YYYY' : ''}`;
};

const getDateTimeFormat = (displayYear, timeFormat) => {
	return `MMM D${displayYear ? ', YYYY' : ''}, ${timeFormat}`;
};

const getTimeSpanWithoutDuration = ({
	time,
	timeSeparator,
	displayYear,
	timeFormat,
	startTime,
}) => {
	const separator = time ? ` ${timeSeparator} ` : '';
	const dateTimeFormat = `${getDateFormat(displayYear)}${separator}${timeFormat}`;

	return startTime.format(dateTimeFormat);
};

const getTimeSpanForGridActivities = ({
	startTime,
	endTime,
	timeFormat,
	displayYear,
	timeSeparator,
}) => {
	let formattedStart,
		formattedEnd,
		spanSeparatedBySpaces = false;

	if (startTime.isSame(endTime, 'day')) {
		// on same morning/evening display AM/PM just once
		const startTimeFormat =
			-1 !== timeFormat.indexOf('A') && startTime.format('A') === endTime.format('A')
				? 'h:mm'
				: timeFormat;

		formattedStart = startTime.format(
			`${getDateFormat(displayYear)} ${timeSeparator} ${startTimeFormat}`,
		);
		formattedEnd = endTime.format(timeFormat);

		spanSeparatedBySpaces = timeFormat.indexOf('A') !== -1;
	} else {
		const shouldDisplayYear =
			displayYear || startTime.format('YYYY') !== endTime.format('YYYY');
		const dateTimeFormat = getDateTimeFormat(shouldDisplayYear, timeFormat);

		spanSeparatedBySpaces = true;
		formattedStart = startTime.format(dateTimeFormat);
		formattedEnd = endTime.format(dateTimeFormat);
	}

	return { formattedStart, formattedEnd, spanSeparatedBySpaces };
};

const getTimeSpanForAllDayActivities = ({ startTime, endTime, displayYear, duration }) => {
	const durationAsDays = duration.asDays();

	// if duration in round days (24h, 48h) then we subtract 1 day
	// e.g. 48 hours is 2 days but the endDate is 1 day from the startDate
	if (durationAsDays >= 1 && durationAsDays === Math.ceil(durationAsDays)) {
		endTime.startOf('day').subtract(1, 'day');
	}

	let formattedStart, formattedEnd;

	if (startTime.isSame(endTime, 'month')) {
		formattedStart = startTime.format('MMMM D');
		formattedEnd = endTime.format(`D${displayYear ? ', YYYY' : ''}`);
	} else if (startTime.isSame(endTime, 'year')) {
		formattedStart = startTime.format('MMMM D ');
		formattedEnd = endTime.format(` MMMM D${displayYear ? ', YYYY' : ''}`);
	} else {
		formattedStart = startTime.format('MMMM D, YYYY ');
		formattedEnd = endTime.format(' MMMM D, YYYY');
	}

	return { formattedStart, formattedEnd, spanSeparatedBySpaces: false };
};

/**
 * Returns a human-readable string for timespan. I.e "Monday, January 20, 2019 ⋅ 10:00 – 12:00"
 *
 * @param {string} date - ISO string representation of the date in format 'YYYY-MM-DD'
 * @param {string} time - string representation of the start time hours and minutes in format 'HH:mm'
 * @param {string} duration - string representation of the duration hours and minutes in format 'HH:mm'
 * @param {string} spanSeparator - value to concatenate between the start and end time
 * @param {string} timeSeparator - value to concatenate between date and time
 * @param {string} locale - the locale to use
 * @returns {string}
 */
// eslint-disable-next-line complexity
export function getTimeSpan({
	date,
	time,
	duration,
	spanSeparator = '–',
	timeSeparator = '⋅',
	locale = DEFAULT_LOCALE,
}) {
	if (!date) {
		return '';
	}

	const startTime = getLocalDateTime({ date, time, locale, duration });
	const timeFormat = time ? getTimeFormatFromLocale(locale) : '';
	const displayYear = !startTime.isSame(moment(), 'year');

	if (!duration) {
		return getTimeSpanWithoutDuration({
			time,
			timeSeparator,
			displayYear,
			timeFormat,
			startTime,
		});
	}

	duration = moment.duration(duration);
	const endTime = startTime.clone().add(duration);

	if (!time && startTime.isSame(endTime, 'day')) {
		return startTime.format(getDateFormat(displayYear));
	}

	const { formattedStart, formattedEnd, spanSeparatedBySpaces } = time
		? getTimeSpanForGridActivities({
				startTime,
				endTime,
				timeFormat,
				timeSeparator,
				displayYear,
		  })
		: getTimeSpanForAllDayActivities({ startTime, endTime, displayYear, duration });

	return [formattedStart, formattedEnd].join(
		spanSeparatedBySpaces ? ` ${spanSeparator} ` : spanSeparator,
	);
}
