import { fromJS } from 'immutable';

export const initialState = fromJS({
	selectedEvent: null,
});

export default (state = initialState, action = { type: 'INIT' }) => {
	if (action.type === 'SELECT_SCHEDULER_EVENT') {
		return state.set('selectedEvent', action.eventId);
	}

	return state;
};
