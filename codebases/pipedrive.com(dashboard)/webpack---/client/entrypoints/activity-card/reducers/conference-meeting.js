import { fromJS } from 'immutable';

export const initialState = fromJS({
	integration: fromJS({}),
});

export default (state = initialState, action) => {
	switch (action.type) {
		case 'SET_CONFERENCE_MEETING_INTEGRATION':
			return state.set('integration', fromJS(action.integration || {}));
		default:
			return state;
	}
};
