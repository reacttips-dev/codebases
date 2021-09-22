import { isOverdue, isToday, isFuture } from './dates';
import { ActivityStatusTypes } from './constants';

export default function getDealActivityStatus(deal: Pipedrive.Deal): ActivityStatusTypes {
	const { next_activity_date, next_activity_time } = deal;

	if (isOverdue(next_activity_date, next_activity_time)) {
		return ActivityStatusTypes.OVERDUE;
	}

	if (isFuture(next_activity_date, next_activity_time)) {
		return ActivityStatusTypes.PLANNED;
	}

	if (isToday(next_activity_date, next_activity_time)) {
		return ActivityStatusTypes.TODAY;
	}

	return ActivityStatusTypes.NONE;
}
