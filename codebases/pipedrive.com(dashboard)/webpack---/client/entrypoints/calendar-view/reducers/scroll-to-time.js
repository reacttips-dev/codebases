export const initialState = null;

export default (state = initialState, action = { type: 'INIT' }) => {
	if (action.type === 'CALENDAR_SCROLL_TO_TIME') {
		return action.scrollToTime;
	}

	return state;
};
