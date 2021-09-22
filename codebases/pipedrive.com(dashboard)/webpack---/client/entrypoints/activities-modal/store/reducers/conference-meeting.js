import { fromJS } from 'immutable';

export const initialState = fromJS({
	isInstallingConferenceMeetingIntegration: false,
	conferenceMeetingUrlInProgress: false,
	isConferenceMeetingIntegrationInstalled: null,
	conferenceMeetingIntegrations: [],
	joinTitle: null,
	activeConferenceMeetingIntegration: null,
});

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'CONFERENCE_MEETING_URL_REQUEST_START':
			return state.set('conferenceMeetingUrlInProgress', true);
		case 'CONFERENCE_MEETING_URL_REQUEST_END':
			return state.set('conferenceMeetingUrlInProgress', false);
		case 'SET_CONFERENCE_MEETING_INTEGRATION_INSTALLED':
			return state.set('isConferenceMeetingIntegrationInstalled', action.value);
		case 'SET_INTEGRATIONS':
			return state
				.set('conferenceMeetingIntegrations', fromJS(action.integrations))
				.set('isInstallingConferenceMeetingIntegration', false);
		case 'SET_CONFERENCE_MEETING_JOIN_TITLE':
			return state.set('joinTitle', action.joinTitle);
		case 'SET_ACTIVE_CONFERENCE_MEETING_INTEGRATION': {
			return state.set('activeConferenceMeetingIntegration', action.integration);
		}
		case 'INSTALL_INTEGRATION_CLICKED':
			return state.set('isInstallingConferenceMeetingIntegration', true);
		case 'CANCEL_CHECKING_INTEGRATIONS':
		case 'CLEAR_ALL':
			return state.set('isInstallingConferenceMeetingIntegration', false);
		default:
			return state;
	}
};
