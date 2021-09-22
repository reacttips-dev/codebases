import { fromJS } from 'immutable';

export const initialState = fromJS({
	shouldShowCalendarSyncTeaser: false,
});

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'SHOW_CALENDAR_SYNC_TEASER':
			return state.set('shouldShowCalendarSyncTeaser', action.value);
		case 'CALENDAR_SYNC_TEASER_CLICKED':
		case 'CALENDAR_SYNC_TEASER_CLOSED':
			return state.set('shouldShowCalendarSyncTeaser', false);
		default:
			return state;
	}
};
