import { fromJS } from 'immutable';

export const initialState = fromJS({
	activityCardVisible: false,
	deleteConfirmationVisible: false,
});

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'SHOW_ACTIVITY_CARD':
			return state.set('activityCardVisible', true);
		case 'HIDE_ACTIVITY_CARD':
			return state.set('activityCardVisible', false);
		case 'SHOW_DELETE_CONFIRMATION':
			return state.set('deleteConfirmationVisible', true);
		case 'HIDE_DELETE_CONFIRMATION':
			return state.set('deleteConfirmationVisible', false);
		default:
			return state;
	}
};
