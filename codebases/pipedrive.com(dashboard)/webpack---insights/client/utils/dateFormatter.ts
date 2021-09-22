import moment, { Moment } from 'moment';
import { types as insightsTypes, periods } from '@pipedrive/insights-core';

export type isoDateType = Moment | string;

const localeDateFormat = moment().localeData().longDateFormat('L');

export const isValidDate = (isoDate: isoDateType) => {
	return moment(isoDate, periods.dateFormat, true).isValid();
};

export const dateToLocaleString = (isoDate: isoDateType) => {
	const date = moment(isoDate);

	return date.isValid() && date.format('L');
};

export const dateTimeToLocaleString = (isoDate: isoDateType) => {
	const date = moment(isoDate);

	return date.isValid() && date.format('L LT');
};

export const stringToLocaleString = (dateString: string) => {
	const date = moment(dateString, periods.dateFormat, true);

	return date.isValid() && date.format(localeDateFormat);
};

export const weekOfYear = (date: isoDateType) => {
	let dateMoment = date;

	if (typeof dateMoment === 'string') {
		dateMoment = moment(date);
	}

	const currentWeekNumber = dateMoment.isoWeek();
	const dateYear = dateMoment.weekYear();

	return dateMoment.isValid() && `W${currentWeekNumber} ${dateYear}`;
};

export const monthOfYear = (isoDate: isoDateType) => {
	const date = moment(isoDate);

	return date.isValid() && date.format('MMM YYYY');
};

export const quarterOfYear = (isoDate: isoDateType) => {
	const date = moment(isoDate);

	return date.isValid() && `Q${date.quarter()} ${date.format('YYYY')}`;
};

export const year = (isoDate: isoDateType) => {
	const date = moment(isoDate);

	return date.isValid() && date.format('YYYY');
};

const dateIntervals = {
	day: (isoDate: isoDateType) => {
		return dateToLocaleString(isoDate);
	},
	week: (isoDate: isoDateType) => {
		return weekOfYear(isoDate);
	},
	month: (isoDate: isoDateType) => {
		return monthOfYear(isoDate);
	},
	quarter: (isoDate: isoDateType) => {
		return quarterOfYear(isoDate);
	},
	year: (isoDate: isoDateType) => {
		return year(isoDate);
	},
};

export const formatIntervals = (
	interval: insightsTypes.Interval | boolean,
	isoDate: isoDateType,
): isoDateType => {
	if (typeof interval === 'boolean') {
		return isoDate;
	}

	const isValid = moment(isoDate, periods.dateFormat, true).isValid();

	return isValid
		? dateIntervals[interval] && dateIntervals[interval](isoDate)
		: isoDate;
};

export const isDateBefore = (
	firstDate: moment.MomentInput,
	secondDate: moment.MomentInput,
) => moment(firstDate).isBefore(secondDate);
