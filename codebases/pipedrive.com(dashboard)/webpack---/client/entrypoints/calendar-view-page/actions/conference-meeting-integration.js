import {
	getIntegrations,
	getInstalledIntegration,
} from '../../../utils/conference-meeting-integration';

export function loadConferenceMeetingIntegrationsState() {
	return async (dispatch, _, { webappApi }) => {
		const conferenceMeetingIntegrations = await getIntegrations(webappApi);
		const integrationInstalled = !!getInstalledIntegration(conferenceMeetingIntegrations);

		dispatch({
			type: 'SET_CONFERENCE_MEETING_INTEGRATIONS',
			value: conferenceMeetingIntegrations,
		});

		dispatch({
			type: 'SET_CONFERENCE_MEETING_INTEGRATION_INSTALLED',
			value: integrationInstalled,
		});
	};
}

export function setConferenceMeetingIntegrationAndJoinTitle(
	conferenceMeetingIntegrationClientId,
	conferenceMeetingIntegrations,
) {
	return async (dispatch) => {
		if (!conferenceMeetingIntegrations || !conferenceMeetingIntegrationClientId) {
			return;
		}

		const conferenceMeetingIntegration = conferenceMeetingIntegrations.find(
			(conferenceMeetingIntegration) =>
				conferenceMeetingIntegration.client_id === conferenceMeetingIntegrationClientId,
		);

		if (conferenceMeetingIntegration && conferenceMeetingIntegration.join_title) {
			const joinTitle = conferenceMeetingIntegration.join_title;

			dispatch({ type: 'SET_INTEGRATION', value: conferenceMeetingIntegration });
			dispatch({ type: 'SET_JOIN_TITLE', value: joinTitle });
		}
	};
}
