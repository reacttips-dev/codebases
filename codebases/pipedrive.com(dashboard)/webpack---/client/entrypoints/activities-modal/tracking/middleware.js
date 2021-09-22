import {
	trackActivityOpened,
	trackActivitySaved,
	trackActivityRemoved,
	trackModalDismissed,
	trackCalendarSyncTeaserClicked,
	trackCalendarSyncTeaserClosed,
	trackVideoMeetingIntegrationInstallClicked,
	trackVideoMeetingLinkCreated,
	trackVideoMeetingLinkInteracted,
	trackModalExpanded,
} from './metrics';
import {
	SAVE_RESULT_SUCCESS,
	DELETE_RESULT_SUCCESS,
	JOIN_MEETING,
	COPY_LINK,
	DELETE_LINK,
} from '../../../config/constants';

const trackActivitySaveSuccess = (action, webappApi, tracking, activity) => {
	if (action.result === SAVE_RESULT_SUCCESS) {
		return trackActivitySaved(webappApi, tracking, activity);
	}

	return null;
};

const trackActivityRemoveSuccess = (action, webappApi, tracking) => {
	if (action.result === DELETE_RESULT_SUCCESS) {
		return trackActivityRemoved(webappApi, tracking);
	}

	return null;
};

const trackModalDismissedIfNecessary = (webappApi, tracking, activity) => {
	if (tracking.trackDismissed) {
		return trackModalDismissed(webappApi, tracking, activity);
	}

	return null;
};

const withTracking = (webappApi, source = null, isContextualView = false) => (store) => (
	middleware,
	// eslint-disable-next-line complexity
) => (action) => {
	const result = middleware(action);
	const tracking = store.getState().get('tracking');
	const activity = store.getState().get('form').toJS();

	switch (action.type) {
		case 'ACTIVITY_SAVE_RESULT':
			tracking.source = source;
			tracking.isContextualView = isContextualView;

			return trackActivitySaveSuccess(action, webappApi, tracking, activity);
		case 'ACTIVITY_REMOVE_RESULT':
			return trackActivityRemoveSuccess(action, webappApi, tracking);
		case 'ACTIVITY_FORM_EDIT_LOADED':
			tracking.isContextualView = isContextualView;

			return trackActivityOpened(webappApi, tracking);
		case 'MODAL_CLOSED':
			return trackModalDismissedIfNecessary(webappApi, tracking, activity);
		case 'CALENDAR_SYNC_TEASER_CLICKED':
			return trackCalendarSyncTeaserClicked(webappApi);
		case 'CALENDAR_SYNC_TEASER_CLOSED':
			return trackCalendarSyncTeaserClosed(webappApi);
		case 'INSTALL_INTEGRATION_CLICKED':
			return trackVideoMeetingIntegrationInstallClicked(webappApi, action.integration);
		case 'CONFERENCE_MEETING_URL_REQUEST_END':
			return trackVideoMeetingLinkCreated(webappApi, action.integration);
		case 'COPY_CONFERENCE_MEETING_URL':
			return trackVideoMeetingLinkInteracted(webappApi, COPY_LINK, action.integration);
		case 'JOIN_CONFERENCE_MEETING_URL':
			return trackVideoMeetingLinkInteracted(webappApi, JOIN_MEETING, action.integration);
		case 'DELETE_CONFERENCE_MEETING_URL':
			return trackVideoMeetingLinkInteracted(webappApi, DELETE_LINK, action.integration);
		case 'EXPAND_MODAL':
			return trackModalExpanded({
				webappApi,
				tracking,
				activity,
				expandedFrom: action.field,
			});
		default:
			return result;
	}
};

export { withTracking };
