import { isNull } from 'lodash';
import moment from 'moment';

export const isOverdue = (dueDate: string, dueTime: string | null): boolean => {
	const dateMoment = convertToMoment(dueDate, dueTime);
	const now = getNow();

	return !isNull(dueDate) && dateMoment.isBefore(now);
};

export const isYesterday = (dueDate: string, dueTime: string | null): boolean => {
	const dateMoment = convertToMoment(dueDate, dueTime);
	const now = getNow();

	return !isNull(dueDate) && dateMoment.startOf('day').isSame(now.startOf('day').add(-1, 'day'));
};

export const isToday = (dueDate: string, dueTime: string | null): boolean => {
	const dateMoment = convertToMoment(dueDate, dueTime);
	const now = getNow();

	return !isNull(dueDate) && dateMoment.startOf('day').isSame(now.startOf('day'));
};

export const isTomorrow = (dueDate: string, dueTime: string | null): boolean => {
	const dateMoment = convertToMoment(dueDate, dueTime);
	const now = getNow();

	return !isNull(dueDate) && dateMoment.startOf('day').isSame(now.startOf('day').add(1, 'day'));
};

export const isFuture = (dueDate: string, dueTime: string | null): boolean => {
	const dateMoment = convertToMoment(dueDate, dueTime);
	const now = getNow();

	return !isNull(dueDate) && dateMoment.startOf('day').isAfter(now.startOf('day'));
};

export const isEmpty = (dateField: null | string) => isNull(dateField) || dateField === '';

export const getNow = (): moment.Moment => moment();

export const convertToMoment = (dueDate: string, dueTime: string | null): moment.Moment => {
	if (!isEmpty(dueTime)) {
		return moment.utc(`${dueDate} ${dueTime}`, 'YYYY-MM-DD HH:mm:ss').local();
	}

	return moment(`${dueDate} 23:59:59`, 'YYYY-MM-DD HH:mm:ss');
};
