import { fromJS } from 'immutable';

export const initialState = fromJS({
	isInstalled: false,
	conferenceMeetingIntegrations: [],
	joinTitle: null,
	integration: null,
});

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'SET_CONFERENCE_MEETING_INTEGRATION_INSTALLED':
			return state.set('isInstalled', action.value);
		case 'SET_CONFERENCE_MEETING_INTEGRATIONS':
			return state.set('conferenceMeetingIntegrations', action.value);
		case 'SET_JOIN_TITLE':
			return state.set('joinTitle', action.value);
		case 'SET_INTEGRATION':
			return state.set('integration', action.value);
		default:
			return state;
	}
};
