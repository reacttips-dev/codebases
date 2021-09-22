const moment = require('moment');
const _ = require('lodash');
const l10n = require('l10n');
const specialYearFormats = {
	'be': 'YYYY г.',
	'en': ', YYYY',
	'en-ca': ', YYYY',
	'es': '[de] YYYY',
	'eu': 'YYYY[ko]',
	'hu': 'YYYY.',
	'lt': 'YYYY [m.]',
	'lv': 'YYYY. [gada]',
	'pt': '[de] YYYY',
	'pt-br': '[de] YYYY',
	'ru': 'YYYY г.',
	'uk': 'YYYY р.',
	'ko': 'YYYY년',
	'ja': 'YYYY年',
	'zh-cn': 'YYYY年',
	'zh-tw': 'YYYY年',
	'hy-am': 'YYYY թ.',
	'cv': 'YYYY [ҫулхи]'
};

/**
 * Returns string with year of date param appended
 * if date param year is different from the current one.
 *
 * @param	{String}	string	String to append the year to
 * @param	{Moment}	date	Moment date object
 * @return	{String}
 */
function addDiffYear(string, date) {
	if (!date.isSame(moment(), 'year')) {
		return string + date.format(' YYYY');
	}

	return string;
}

/**
 * Readable compact date format.
 *
 * @param  {Moment} date Moment date object
 * @return {String}      Formatted compact date
 */
function compactDateSingle(date) {
	return addDiffYear(date.format('D MMM'), date);
}

/**
 * Readable compact date period format.
 *
 * @param  {Moment} start Start date of the range
 * @param  {Moment} end   End date of the range
 * @return {String}       Formatted date range
 */
function compactDatePeriod(start, end) {
	// If the two moments in time are not in the same year,
	// we write out the full format.
	if (start.year() !== end.year()) {
		return `${start.format('D MMM YYYY')} – ${end.format('D MMM YYYY')}`;
	}

	// If start and end are both in a month of the same name (eg. January and January),
	// we exclude the first instance of that month name.
	let formatted;

	if (start.month() === end.month()) {
		formatted = `${start.format('D')} – ${end.format('D MMM')}`;
	} else {
		formatted = `${start.format('D MMM')} – ${end.format('D MMM')}`;
	}

	// Append year if it's different from the current one
	return addDiffYear(formatted, end);
}

function daysDiff(date, eod, sod) {
	return date.endOf('day').diff(eod, 'days', true) <= 1 &&
		date.startOf('day').diff(sod, 'days', true) >= -1
		? Math.floor(date.endOf('day').diff(eod, 'days', true))
		: Math.ceil(date.startOf('day').diff(sod, 'days', true));
}

function isYesterday(date) {
	return date.startOf('day').isSame(
		moment()
			.startOf('day')
			.add(-1, 'days')
	);
}

function isTomorrow(date) {
	return date.startOf('day').isSame(
		moment()
			.startOf('day')
			.add(1, 'days')
	);
}

function removeYearFromFormat(f) {
	const locale = moment().locale();

	const yearFormat = specialYearFormats[locale] || 'YYYY';

	f = f.replace(yearFormat, '');

	return f;
}

function getNoTimeRelativeFormat(date, f) {
	const currentMoment = moment();
	const diff = daysDiff(date, currentMoment.endOf('day'), currentMoment.startOf('day'));

	if (currentMoment.isSame(date, 'day')) {
		f = `[${l10n.gettext('Today')}]`;
	} else if (isYesterday(date)) {
		f = `[${l10n.gettext('Yesterday')}]`;
	} else if (isTomorrow(date)) {
		f = `[${l10n.gettext('Tomorrow')}]`;
	} else {
		if (diff > 1 && diff < 7) {
			f = 'dddd';
		} else {
			f = currentMoment.localeData().longDateFormat('LL');
		}
	}

	return f;
}

function getNoTimeFormat(date, f, relativeDate) {
	if (relativeDate) {
		return getNoTimeRelativeFormat(date, f);
	} else {
		return moment()
			.localeData()
			.longDateFormat('LL');
	}
}

function defaultDate(date, relative) {
	let f = moment()
		.localeData()
		.longDateFormat('LLL');

	if (_.isBoolean(date.noTime) && date.noTime) {
		f = getNoTimeFormat(date, f, relative);
	}

	if (date.year() === moment().year()) {
		f = removeYearFromFormat(f);
	}

	return date.format(f).trim();
}

const TimeParsers = {
	// From activities
	default: function(date) {
		const currentMoment = moment();
		const currentDate = new Date();

		if (!date || !date.isValid()) {
			return currentMoment.calendar(currentDate);
		}

		const dateDiff = Math.abs(date.diff(currentDate, 'days', true));
		const dateHasNoTime = _.isBoolean(date.noTime) && date.noTime;

		// When selected date with time is more than 6 days or selected date without time
		if (dateDiff > 6 || dateHasNoTime) {
			return defaultDate(date, true);
		}

		return date.calendar(currentDate);
	},

	compositeDateTime: function(date) {
		const currentMoment = moment();

		if (!date || !date.isValid()) {
			return defaultDate(currentMoment, false);
		}

		return defaultDate(date, false);
	},

	files: function(date) {
		return date.format('MMM DD, YYYY');
	},

	// Partial relative: Today/Yesterday is relative, rest is absolute
	notes: function(date) {
		const nowMoment = moment();
		const dateMoment = date.local();

		const startOfToday = nowMoment.clone().startOf('day');
		const startOfDate = dateMoment.clone().startOf('day');
		const numberOfDaysAgo = startOfToday.diff(startOfDate, 'days');

		if (Math.abs(numberOfDaysAgo) <= 1) {
			return dateMoment.calendar(nowMoment);
		}

		return defaultDate(date);
	},

	// Mailbox threads
	mail: function(date) {
		const x = moment(date);
		const dateDiff = x.startOf('day').diff(new Date(), 'days', true);

		if (dateDiff <= 0 && dateDiff > -1) {
			// Today
			return date.format('LT');
		} else if (dateDiff <= -1 && dateDiff > -2) {
			// Yesterday
			return _.gettext('Yesterday');
		} else if (dateDiff > 0) {
			// Yesterday
			return _.gettext('Tomorrow');
		} else {
			// Any other time
			return date.format('L');
		}
	},

	// full relative time
	fullRelative: function(date) {
		return date.local().fromNow();
	},

	// relative time without extras (such as ' ago' or 'in ')
	relative: function(date) {
		return date.local().fromNow(true);
	},

	// long date string
	longDate: function(date) {
		return date.format('LLLL');
	},

	// date and time string
	dateTime: function(date) {
		return date.format('LLL');
	},

	// long date string without time
	longDateNoTime: function(date) {
		return date.format('dddd, Do MMMM YYYY');
	},

	/**
	 * Readable compact date range format.
	 *
	 * @param  {Moment} start Start date of the range
	 * @param  {Moment} end   End date of the range
	 * @return {String}       Formatted date range
	 */
	compactDateRange: function(start, end) {
		if (start.isSame(end)) {
			return compactDateSingle(start);
		}

		return compactDatePeriod(start, end);
	}
};

module.exports = TimeParsers;
