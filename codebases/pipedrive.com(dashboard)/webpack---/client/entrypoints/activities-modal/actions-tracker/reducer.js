import { TRACKING_ACTION_NAME } from './middleware';

export const initialState = {
	history: [],
};

export default (state = initialState, action = {}) => {
	if (action.type === TRACKING_ACTION_NAME) {
		return {
			history: [...state.history.slice(-10e3), action.name],
		};
	}

	if (action.type === 'CLEAR_ALL') {
		return {
			history: [],
		};
	}

	return state;
};
