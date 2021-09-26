import {
	trackActivityCardOpened,
	trackActivityMarkedAsDoneUndone,
	trackActivityDeleted,
	trackActivityCardInteracted,
	trackVideoMeetingLinkInteracted,
} from './metrics';
import { JOIN_MEETING, COPY_LINK } from '../../../config/constants';

// eslint-disable-next-line complexity
const withTracking = (webappApi) => (store) => (middleware) => (action) => {
	const result = middleware(action);
	const tracking = store.getState().get('tracking');

	switch (action.type) {
		case 'FIELD_UPDATE':
			return action.field === 'done' && trackActivityMarkedAsDoneUndone(webappApi, tracking);
		case 'ACTIVITY_SAVE_RESULT':
			return action.result === 'delete_success' && trackActivityDeleted(webappApi, tracking);
		case 'SHOW_ACTIVITY_CARD':
			return trackActivityCardOpened(webappApi, tracking);
		case 'ACTIVITY_CARD_INTERACTION':
			return trackActivityCardInteracted(webappApi, tracking, action.interaction);
		case 'COPY_CONFERENCE_MEETING_URL':
			return trackVideoMeetingLinkInteracted(webappApi, COPY_LINK, action.integration);
		case 'JOIN_CONFERENCE_MEETING_URL':
			return trackVideoMeetingLinkInteracted(webappApi, JOIN_MEETING, action.integration);
		default:
			return result;
	}
};

export { withTracking };
