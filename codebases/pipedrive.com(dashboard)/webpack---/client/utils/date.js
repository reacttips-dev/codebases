import moment from 'moment-timezone';
import {
	FORMAT_12H,
	FORMAT_12H_FULL,
	FORMAT_24H,
	UTC_DATE_FORMAT,
	UTC_DATETIME_FORMAT,
	DEFAULT_LOCALE,
	TIME_FORMATS,
} from '../config/constants';

const timeSuggestionIntervals = [
	{ minutes: 5 },
	{ minutes: 10 },
	{ minutes: 15 },
	{ minutes: 30 },
	{ minutes: 45 },
	{ hours: 1 },
	{ hours: 1, minutes: 15 },
	{ hours: 1, minutes: 30 },
	{ hours: 1, minutes: 45 },
	{ hours: 2 },
	{ hours: 2, minutes: 30 },
	{ hours: 3 },
	{ hours: 4 },
	{ hours: 5 },
	{ hours: 6 },
	{ hours: 7 },
	{ hours: 8 },
];

export function is24HourFormat(locale) {
	const localeMoment = locale ? moment(locale) : moment();

	return !localeMoment.localeData().longDateFormat('LT').includes('A');
}

export function getTimeFormat(full = false) {
	const time12HourFormat = full ? FORMAT_12H_FULL : FORMAT_12H;

	return is24HourFormat() ? FORMAT_24H : time12HourFormat;
}

export function getCalendarDays(daysNumber, forDate, minutesPrecision) {
	const startDate = moment(forDate || moment()).startOf('day');

	let endDate = startDate
		.clone()
		.add(daysNumber - 1, 'days')
		.endOf('day');

	if (minutesPrecision) {
		endDate = endDate.add(1, 'minute');
	}

	return { startDate, endDate };
}

export function getWeekInformation(startDate, endDate) {
	const start = moment(startDate);
	const end = moment(endDate);
	const weekStartPart = start.format('MMM D');
	const weekEndPartFormat = end.isSame(start, 'month') ? 'D' : 'MMM D';
	const weekEndPart = end.format(weekEndPartFormat);
	const fullWeekInfoPart = [weekStartPart, weekEndPart].join(' – ');
	const yearPart = end.format('YYYY');

	return `${fullWeekInfoPart}, ${yearPart}`;
}

export function roundTimeToPreviousHalfHour(date) {
	const dateTime = moment(date);

	return dateTime.subtract(dateTime.minute() % 30, 'minutes').format(FORMAT_24H);
}

export function formatDuration(duration) {
	const isNegative = duration < 0;
	const momentDuration = moment.duration(isNegative ? -duration : duration);

	let hours = Math.floor(momentDuration.asHours());
	let minutes = momentDuration.minutes();

	hours = hours < 10 ? `0${hours}` : hours;
	minutes = minutes < 10 ? `0${minutes}` : minutes;

	return `${isNegative ? '-' : ''}${hours}:${minutes}`;
}

export function formatDateTime(dateTime) {
	return moment(dateTime).locale('en').utc().format(UTC_DATETIME_FORMAT);
}

export function formatDateToUTC(date) {
	return moment(date).locale('en').utc().format(UTC_DATE_FORMAT);
}

export function formatUTCDate(date) {
	return moment(date).locale('en').format(UTC_DATE_FORMAT);
}

export function formatUTCDateTime(date) {
	return moment(date).locale('en').format(UTC_DATETIME_FORMAT);
}

export function formatTime24H(time) {
	return moment(time, FORMAT_24H).locale('en').format(FORMAT_24H);
}

export const getTimeFormatFromLocale = (locale = DEFAULT_LOCALE) => {
	return moment().locale(locale).localeData().longDateFormat('LT') || FORMAT_24H;
};

export const getTimeFormatExampleForLocale = (locale = DEFAULT_LOCALE) => {
	const exampleSplit = moment().locale(locale).format('LT').split(' ');
	const format = moment().locale(locale).localeData().longDateFormat('LT') || FORMAT_24H;
	const formatSplit = format.split(' ');

	// some time formats consist of 2+ parts and h:mm part is not always the first
	if (formatSplit.length > 0 && exampleSplit.length > 0) {
		const timeFormatRegex = /[hH]{1,2}[.:]mm/g;

		return formatSplit
			.map((format, index) => {
				if (timeFormatRegex.test(format)) {
					return format;
				}

				return exampleSplit[index];
			})
			.join(' ');
	}

	return format;
};

export function getTimeOptions(interval = 15, locale = DEFAULT_LOCALE) {
	const options = [];
	const timeFormat = getTimeFormatFromLocale(locale);

	const startTime = moment.utc(0).locale(locale);
	const endTime = startTime.clone().add(1, 'day');

	for (let i = startTime.clone(); i.isBefore(endTime); i.add(interval, 'minutes')) {
		options.push({ value: i.format(timeFormat) });
	}

	return options;
}

export function getTimeSuggestions(startTime = moment(), locale = DEFAULT_LOCALE) {
	const timeFormat = getTimeFormatFromLocale(locale);
	const formatDuration = (interval) => {
		const hours = interval.hours ? `${interval.hours} h` : '';
		const minutes = interval.minutes ? `${interval.minutes} min` : '';
		const separator = hours && minutes ? ' ' : '';

		return `(${hours}${separator}${minutes})`;
	};

	return timeSuggestionIntervals.map((interval) => {
		const value = moment(startTime, TIME_FORMATS)
			.locale(locale)
			.add(moment.duration(interval))
			.format(timeFormat);
		const duration = formatDuration(interval);

		return { value, duration };
	});
}

export function getClosestTimeInFuture(options, locale = DEFAULT_LOCALE, compareWith = moment()) {
	const timeFormat = getTimeFormatFromLocale(locale);
	const option = options.find((o) =>
		moment(o.value, timeFormat, locale).isAfter(compareWith.locale(locale)),
	);

	return (option || options[0]).value;
}

export const getLocalDateFromUtc = (dateTimeUtc, locale = DEFAULT_LOCALE) => {
	const parsedUtcDateTime = moment.utc(dateTimeUtc);
	const utcDateTime = parsedUtcDateTime.isValid() ? parsedUtcDateTime : moment.utc();

	return utcDateTime.local().locale(locale);
};

export const calculateLocalStartOfTheDay = (dueDate, dueTime) => {
	if (dueDate && dueTime) {
		return moment.utc(`${dueDate} ${dueTime}`).local().startOf('day');
	}

	if (dueDate) {
		return moment(dueDate, UTC_DATE_FORMAT);
	}

	return moment().startOf('day');
};

export const calculateUtcMoment = (date, time) => {
	return time ? moment(`${date} ${time}`).utc() : moment.utc(date);
};

export const calculateTimeDiff = (startTime, endTime) => {
	const startMoment = moment(startTime, FORMAT_24H);
	const endMoment = moment(endTime, FORMAT_24H);

	if (!startMoment.isValid() || !endMoment.isValid()) {
		return -1;
	}

	return endMoment.diff(startMoment);
};

export const calculateDuration = ({
	endDateMoment,
	startDateMoment,
	hasTime,
	isSameDay = endDateMoment.clone().local().isSame(startDateMoment.clone().local(), 'day'),
}) => {
	if (hasTime) {
		return endDateMoment.diff(startDateMoment);
	}

	if (!isSameDay) {
		// make the end day included if the time is not set
		const endOfEndDate = endDateMoment.clone().local().startOf('day').add(1, 'day');
		const startOfStartDate = startDateMoment.clone().local().startOf('day');

		return endOfEndDate.diff(startOfStartDate);
	}

	return null;
};

export const getLocalDateTime = ({ date, time, locale, duration }) => {
	// On NY timezone for example, if time is missing and no duration,
	// it will show a day before, so we need to add proper time difference
	if (!time && !duration) {
		const timeDifference = moment().utcOffset();

		time = formatFromMinute(timeDifference);
	}

	return moment
		.utc(`${date}${time ? ` ${time}` : ''}`)
		.locale(locale)
		.local();
};

// Formats to time (-240 or 240 to 04:00)
function formatFromMinute(mins) {
	if (mins < 0) {
		mins = mins * -1;
	}

	const h = (mins / 60) | 0;
	const m = mins % 60 | 0;

	return moment.utc().hours(h).minutes(m).format('hh:mm');
}
