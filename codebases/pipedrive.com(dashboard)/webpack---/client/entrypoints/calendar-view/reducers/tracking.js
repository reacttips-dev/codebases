import { fromJS } from 'immutable';

export const initialState = fromJS({
	context: '',
});

export default (state = initialState, action = { type: 'INIT' }) => {
	if (action.type === 'CHANGE_TRACKING') {
		const { context, preventTracking } = action;

		return state.merge(fromJS({ context, preventTracking }));
	}

	return state;
};
