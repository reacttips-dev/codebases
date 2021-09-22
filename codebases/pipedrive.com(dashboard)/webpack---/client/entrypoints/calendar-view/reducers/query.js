export const initialState = null;

export default (state = initialState, action = { type: 'INIT' }) => {
	if (action.type === 'CALENDAR_QUERY') {
		return state && action.query ? { ...state, ...action.query } : action.query;
	}

	return state;
};
