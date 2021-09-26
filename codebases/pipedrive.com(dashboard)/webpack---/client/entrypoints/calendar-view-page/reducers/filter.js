import { fromJS } from 'immutable';

export const initialState = fromJS({
	activeFilter: {
		type: 'user',
		value: null,
	},
});

export default (state = initialState, action = { type: 'INIT' }) => {
	if (action.type === 'ACTIVE_FILTER') {
		return state.set('activeFilter', fromJS(action.activeFilter));
	}

	return state;
};
