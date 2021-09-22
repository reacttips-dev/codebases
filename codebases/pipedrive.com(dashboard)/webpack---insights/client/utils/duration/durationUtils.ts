import { get, isNil } from 'lodash';
import { Translator } from '@pipedrive/react-utils';

import { DurationChartSummaryDataObject } from '../../types/data-layer';
import { numberFormatter } from '../numberFormatter';

export enum DurationFormat {
	LONG,
	SHORT,
}

export enum DurationUnit {
	DAYS,
	HOURS,
	MINUTES,
}

const formatDurationInDays = (
	duration?: number,
	formattedDurationValue?: string,
	format?: DurationFormat,
	translator?: Translator,
) => {
	if (isNil(duration)) {
		return '';
	}

	if (format === DurationFormat.LONG) {
		return translator.ngettext(
			'%s day',
			'%s days',
			duration,
			formattedDurationValue,
		);
	}

	return translator.pgettext(
		'Number [Short for day or days]',
		'%s d',
		formattedDurationValue,
	);
};

const formatDurationInHours = (
	duration?: number,
	formattedDurationValue?: string,
	format?: DurationFormat,
	translator?: Translator,
) => {
	if (isNil(duration)) {
		return '';
	}

	if (format === DurationFormat.LONG) {
		return translator.ngettext(
			'%s hour',
			'%s hours',
			duration,
			formattedDurationValue,
		);
	}

	return translator.pgettext(
		'Number [Short for hour or hours]',
		'%s h',
		formattedDurationValue,
	);
};

const formatDurationInMinutes = (
	duration?: number,
	formattedDurationValue?: string,
	format?: DurationFormat,
	translator?: Translator,
) => {
	if (isNil(duration)) {
		return '';
	}

	const description =
		format === DurationFormat.LONG
			? translator.ngettext('minute', 'minutes', duration)
			: translator.pgettext('Short for minute or minutes', 'min');

	return `${formattedDurationValue} ${description}`;
};

export const getDurationInDays = (durationInSeconds: number) => {
	const secondsInHour = 3600;
	const hoursInDay = 24;
	const durationInDays = durationInSeconds / (secondsInHour * hoursInDay);

	return Math.round(durationInDays);
};

export const getDurationInHours = (durationInMinutes: number) => {
	const minutesInHour = 60;
	const durationInHours = durationInMinutes / minutesInHour;

	return Math.round(durationInHours);
};

export const getFormattedDuration = ({
	duration,
	translator,
	format = DurationFormat.LONG,
	unit = DurationUnit.DAYS,
}: {
	duration?: number;
	translator: Translator;
	format?: DurationFormat;
	unit?: DurationUnit;
}) => {
	const formattedDurationValue =
		duration &&
		numberFormatter.format({
			value: duration,
			isMonetary: false,
		});

	switch (unit) {
		case DurationUnit.DAYS:
			return formatDurationInDays(
				duration,
				formattedDurationValue,
				format,
				translator,
			);
		case DurationUnit.HOURS:
			return formatDurationInHours(
				duration,
				formattedDurationValue,
				format,
				translator,
			);
		case DurationUnit.MINUTES:
			return formatDurationInMinutes(
				duration,
				formattedDurationValue,
				format,
				translator,
			);
		default:
			return numberFormatter.format({
				value: duration,
				isMonetary: false,
			});
	}
};

export const extractSummaryData = (
	chartSummaryData: DurationChartSummaryDataObject,
) => {
	const count = get(chartSummaryData, 'total.count');
	const duration = get(chartSummaryData, 'total.duration');

	return { count, duration };
};
