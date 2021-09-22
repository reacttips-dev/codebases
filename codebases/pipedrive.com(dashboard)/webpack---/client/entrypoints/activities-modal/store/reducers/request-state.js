import { fromJS } from 'immutable';

export const initialState = fromJS({
	activityIsLoading: false,
	activityIsSaving: false,
	activitySaveResult: null,
});

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'ACTIVITY_LOAD_START':
			return state.set('activityIsLoading', true);
		case 'ACTIVITY_LOAD_END':
			return state.set('activityIsLoading', false);
		case 'ACTIVITY_SAVE_START':
		case 'ACTIVITY_REMOVE_START':
			return state.set('activityIsSaving', true);
		case 'ACTIVITY_SAVE_END':
		case 'ACTIVITY_REMOVE_END':
			return state.set('activityIsSaving', false);
		case 'ACTIVITY_SAVE_RESULT':
		case 'ACTIVITY_REMOVE_RESULT':
			return state.set('activitySaveResult', action.result);
		case 'CLEAR_ALL':
			return initialState;
		default:
			return state;
	}
};
