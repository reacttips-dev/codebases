export function setConferenceMeetingIntegrationInstalled(value) {
	return {
		type: 'SET_CONFERENCE_MEETING_INTEGRATION_INSTALLED',
		value,
	};
}

export function setConferenceMeetingIntegration(integration) {
	return {
		type: 'SET_CONFERENCE_MEETING_INTEGRATION',
		integration,
	};
}

export function copyConferenceMeetingUrl(integration) {
	return {
		type: 'COPY_CONFERENCE_MEETING_URL',
		integration,
	};
}

export function joinConferenceMeetingUrl(integration) {
	return {
		type: 'JOIN_CONFERENCE_MEETING_URL',
		integration,
	};
}
