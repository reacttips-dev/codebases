import { fromJS } from 'immutable';

export const initialState = fromJS({
	visible: true,
	mounted: true,
	languages: [],
	isFlowView: false,
	hasActiveCalendarSync: false,
});

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'SET_LANGUAGES':
			return state.set('languages', fromJS(action.languages));
		case 'SET_IS_FLOW_VIEW':
			return state.set('isFlowView', action.isFlowView);
		case 'SHOW_MODAL':
			return state.set('visible', true).set('mounted', true);
		case 'HIDE_MODAL':
			return state.set('visible', false);
		case 'UNMOUNT_MODAL':
			return state.set('mounted', false);
		case 'SET_HAS_ACTIVE_CALENDAR_SYNC':
			return state.set('hasActiveCalendarSync', action.hasActiveCalendarSync);
		default:
			return state;
	}
};
