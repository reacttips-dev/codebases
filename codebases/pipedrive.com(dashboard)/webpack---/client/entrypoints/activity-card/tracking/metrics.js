import { extractActivityTrackingBaseData } from '../../../utils/activity';

const extractTrackingData = (webappApi, tracking) => {
	const activityBaseData = extractActivityTrackingBaseData(webappApi, tracking.toJS());

	return {
		...activityBaseData,
		is_location_geocoded: !!tracking.get('locationLat'),
		source: 'activity_card',
	};
};

const trackActivityMarkedAsDoneUndone = (webappApi, tracking) => {
	const trackingData = extractTrackingData(webappApi, tracking);
	const action = tracking.get('done') ? 'marked_done' : 'marked_undone';

	webappApi.pdMetrics.trackUsage(null, 'activity', action, trackingData);
};

const trackActivityDeleted = (webappApi, tracking) => {
	const trackingData = extractTrackingData(webappApi, tracking);

	webappApi.pdMetrics.trackUsage(null, 'activity', 'deleted', trackingData);
};

const trackActivityCardOpened = (webappApi, tracking) => {
	const trackingData = extractTrackingData(webappApi, tracking);

	webappApi.pdMetrics.trackUsage(null, 'activity_card', 'opened', trackingData);
};

const trackActivityCardInteracted = (webappApi, tracking, interaction) => {
	const activityTrackingData = extractTrackingData(webappApi, tracking);
	const trackingData = {
		...activityTrackingData,
		interaction,
	};

	webappApi.pdMetrics.trackUsage(null, 'activity_card', 'interacted', trackingData);
};

const trackVideoMeetingLinkInteracted = (webappApi, interaction, integration) => {
	webappApi.pdMetrics.trackUsage(null, 'video_meeting_link', 'interacted', {
		source: 'activity_card',
		integration: integration ? integration.get('name') : null,
		integration_client_id: integration ? integration.get('client_id') : null,
		interaction,
	});
};

export {
	trackActivityMarkedAsDoneUndone,
	trackActivityDeleted,
	trackActivityCardOpened,
	trackActivityCardInteracted,
	trackVideoMeetingLinkInteracted,
};
