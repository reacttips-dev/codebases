import { hasActiveCalendarSync } from '../../../api';

export function getHasActiveCalendarSync() {
	return async (dispatch) => {
		const userHasActiveCalendarSync = await hasActiveCalendarSync();

		dispatch({
			type: 'SET_HAS_ACTIVE_CALENDAR_SYNC',
			hasActiveCalendarSync: userHasActiveCalendarSync,
		});
	};
}
