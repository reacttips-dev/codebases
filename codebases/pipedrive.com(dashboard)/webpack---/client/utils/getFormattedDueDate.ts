import moment from 'moment';
import { getNow, isEmpty, convertToMoment, isToday, isTomorrow, isYesterday } from './dates';
import { Translator } from '@pipedrive/react-utils';

// eslint-disable-next-line complexity
export function getFormattedDueDate(
	dueDate: string,
	dueTime: string | null,
	translate: Translator,
): string | undefined {
	const activityDate = convertToMoment(dueDate, dueTime);
	const now = getNow();

	const startOfToday = now.clone().startOf('day');
	const lastActivityDateSnapshot = activityDate.isBefore(now)
		? activityDate.clone().startOf('day')
		: activityDate.clone().endOf('day');

	const minutesSinceToday = now.clone().diff(moment(activityDate), 'minutes');
	const hoursSinceToday = now.clone().diff(moment(activityDate), 'hours');
	const daysSinceToday = startOfToday.diff(lastActivityDateSnapshot, 'days');
	const weeksSinceToday = startOfToday.diff(lastActivityDateSnapshot, 'week');
	const monthsSinceToday = startOfToday.diff(lastActivityDateSnapshot, 'month');
	const yearsSinceToday = startOfToday.diff(lastActivityDateSnapshot, 'year');
	const isInPast = startOfToday.isAfter(activityDate.clone().startOf('day'));
	const isInFuture = startOfToday.isBefore(activityDate.clone().startOf('day'));

	if (isNow(minutesSinceToday)) {
		return translate.gettext('Now');
	}

	if (isFullDayYesterday(dueTime, daysSinceToday, isInPast)) {
		return translate.gettext('Yesterday');
	}

	if (isFullDayToday(dueTime, hoursSinceToday, daysSinceToday)) {
		return translate.gettext('Today');
	}

	if (isFullDayTomorrow(dueTime, daysSinceToday, isInFuture)) {
		return translate.gettext('Tomorrow');
	}

	if (isYesterday(dueDate, dueTime)) {
		return translate.pgettext('Yesterday at 14:00', 'Yesterday at %s', activityDate.format('LT'));
	}

	if (isToday(dueDate, dueTime)) {
		return translate.pgettext('Today at 14:00', 'Today at %s', activityDate.format('LT'));
	}

	if (isTomorrow(dueDate, dueTime)) {
		return translate.pgettext('Tomorrow at 14:00', 'Tomorrow at %s', activityDate.format('LT'));
	}

	if (isWithinTwoWeeks(daysSinceToday)) {
		return getFormattedDueDateInDays(daysSinceToday, translate);
	}

	if (isWithinEightWeeks(weeksSinceToday)) {
		return getFormattedDueDateInWeeks(weeksSinceToday, translate);
	}

	if (isWithinTwelveMonths(monthsSinceToday)) {
		return getFormattedDueDateInMonths(monthsSinceToday, translate);
	}

	return getFormattedDueDateInYears(yearsSinceToday, translate);
}

const isFullDayYesterday = (dueTime: string | null, daysSinceToday: number, isInPast: boolean): boolean =>
	isEmpty(dueTime) && isInPast && Math.abs(daysSinceToday) === 1;

const isFullDayToday = (dueTime: string | null, hoursSinceToday: number, daysSinceToday: number): boolean =>
	isEmpty(dueTime) && daysSinceToday === 0 && Math.abs(hoursSinceToday) < 24;

const isFullDayTomorrow = (dueTime: string | null, daysSinceToday: number, isInFuture: boolean): boolean =>
	isEmpty(dueTime) && isInFuture && Math.abs(daysSinceToday) === 1;

const isWithinTwoWeeks = (daysSinceToday: number): boolean => daysSinceToday < 14 && daysSinceToday > -14;

const isWithinEightWeeks = (weeksSinceToday: number): boolean => weeksSinceToday < 8 && weeksSinceToday > -8;

const isWithinTwelveMonths = (monthsSinceToday: number): boolean => monthsSinceToday < 12 && monthsSinceToday > -12;

const isNow = (minutesSinceToday: number): boolean => minutesSinceToday === 0;

const getFormattedDueDateInDays = (daysSinceToday: number, translate: Translator) => {
	if (daysSinceToday > 0) {
		return translate.gettext(
			translate.ngettext('%d day overdue', '%d days overdue', daysSinceToday),
			daysSinceToday,
		);
	}

	return translate.gettext(
		translate.ngettext('Due in %d day', 'Due in %d days', Math.abs(daysSinceToday)),
		Math.abs(daysSinceToday),
	);
};

const getFormattedDueDateInWeeks = (weeksSinceToday: number, translate: Translator) => {
	if (weeksSinceToday > 0) {
		return translate.gettext(
			translate.ngettext('%d week overdue', '%d weeks overdue', weeksSinceToday),
			weeksSinceToday,
		);
	}

	return translate.gettext(
		translate.ngettext('Due in %d week', 'Due in %d weeks', Math.abs(weeksSinceToday)),
		Math.abs(weeksSinceToday),
	);
};

const getFormattedDueDateInMonths = (monthsSinceToday: number, translate: Translator) => {
	if (monthsSinceToday > 0) {
		return translate.gettext(
			translate.ngettext('%d month overdue', '%d months overdue', monthsSinceToday),
			monthsSinceToday,
		);
	}

	return translate.gettext(
		translate.ngettext('Due in %d month', 'Due in %d months', Math.abs(monthsSinceToday)),
		Math.abs(monthsSinceToday),
	);
};

const getFormattedDueDateInYears = (yearsSinceToday: number, translate: Translator) => {
	if (yearsSinceToday > 0) {
		return translate.gettext(
			translate.ngettext('%d year overdue', '%d years overdue', yearsSinceToday),
			yearsSinceToday,
		);
	}

	return translate.gettext(
		translate.ngettext('Due in %d year', 'Due in %d years', Math.abs(yearsSinceToday)),
		Math.abs(yearsSinceToday),
	);
};
