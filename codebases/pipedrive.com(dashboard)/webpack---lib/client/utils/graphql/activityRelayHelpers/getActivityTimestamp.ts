import isSameDay from 'date-fns/isSameDay';
import addSeconds from 'date-fns/addSeconds';
import format from 'date-fns/format';

import { Activity } from './types';

const getTimeString = (date?: string, time?: string) => {
	// Always use `time` when it's present
	if (time) {
		return time;
	}

	const now = new Date();
	const isToday = date && isSameDay(new Date(date), now);

	if (isToday) {
		// When date is today (and no time is present) use 1 second in future as time
		// This way all-day activities will always be considered as upcoming -
		// after overdue datetime activities for today.

		return `${format(addSeconds(new Date(now), 1), 'HH:mm')}:00Z`;
	}

	// Fallback
	return '00:00:00';
};

export const getActivityTimestamp = (activity: Activity) => {
	const dueTime = activity.getValue('dueTime')?.toString();
	const dueDate = activity.getValue('dueDate')?.toString();

	const timeString = getTimeString(dueDate, dueTime);

	return new Date(`${dueDate} ${timeString}`);
};
