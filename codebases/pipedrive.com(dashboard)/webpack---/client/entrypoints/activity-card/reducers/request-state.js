import { fromJS } from 'immutable';

export const initialState = fromJS({
	activityIsSaving: false,
	activitySaveResult: null,
});

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'ACTIVITY_SAVE_START':
			return state.set('activityIsSaving', true).set('activitySaveResult', null);
		case 'ACTIVITY_SAVE_RESULT':
			return state.set('activityIsSaving', false).set('activitySaveResult', action.result);
		default:
			return state;
	}
};
