import { sortBy } from 'lodash';
import { isOverdue, isToday, isFuture } from './dates';

/**
 * Sorts deals by:
 * - Overdue deals
 * - Todays deals
 * - Future deals
 * - Deals without any planned activity
 */
export default function sortDealsByActivityNextDate(deals: Pipedrive.Deal[]) {
	return sortBy(deals, (deal: Pipedrive.Deal) => {
		const { next_activity_date, next_activity_time } = deal;

		if (isOverdue(next_activity_date, next_activity_time)) {
			return 1;
		}
		if (isToday(next_activity_date, next_activity_time)) {
			return 2;
		}
		if (isFuture(next_activity_date, next_activity_time)) {
			return 4;
		}

		// Has no activity
		return 3;
	});
}
