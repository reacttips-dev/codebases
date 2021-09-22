import { fromJS } from 'immutable';

export const initialState = fromJS({
	formWidth: 0,
	modalWidth: 0,
});

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'UPDATE_FORM_WIDTH':
			return state.set('formWidth', action.formWidth);
		case 'UPDATE_MODAL_WIDTH':
			return state.set('modalWidth', action.modalWidth);
		default:
			return state;
	}
};
