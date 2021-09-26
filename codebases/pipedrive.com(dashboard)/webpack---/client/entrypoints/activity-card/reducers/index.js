import * as Immutable from 'immutable';
import { combineReducers } from 'redux-immutable';

import activity from './activity';
import overlays, { initialState as overlaysInitialState } from './overlays';
import requestState, { initialState as requestInitialState } from './request-state';
import tracking from '../tracking/reducer';
import activityInitialState from './helpers/activity-initial-state';
import conferenceMeeting, {
	initialState as conferenceMeetingInitialState,
} from './conference-meeting';

export function getInitialState() {
	return Immutable.Map({
		activity: activityInitialState,
		overlays: overlaysInitialState,
		requestState: requestInitialState,
		tracking: activityInitialState,
		conferenceMeeting: conferenceMeetingInitialState,
	});
}

export default combineReducers({
	activity,
	overlays,
	requestState,
	tracking,
	conferenceMeeting,
});
