import { fromJS } from 'immutable';

export const initialState = fromJS({
	hasActiveCalendarSync: false,
});

export default (state = initialState, action = { type: 'INIT' }) => {
	if (action.type === 'SET_HAS_ACTIVE_CALENDAR_SYNC') {
		return state.set('hasActiveCalendarSync', action.hasActiveCalendarSync);
	}

	return state;
};
