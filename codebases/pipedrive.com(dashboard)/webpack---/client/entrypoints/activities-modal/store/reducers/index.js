import * as Immutable from 'immutable';
import { combineReducers } from 'redux-immutable';

import form, { initialState as formInitialState } from './form';
import modal, { initialState as modalInitialState } from './modal';
import notifications, { initialState as notificationsInitialState } from './notifications';
import viewport, { initialState as viewportInitialState } from './viewport';
import requestState, { initialState as requestStateInitialState } from './request-state';
import tracking, { initialState as trackingInitialState } from '../../tracking/reducer';
import actionsTracking, {
	initialState as actionsTrackingInitialState,
} from '../../actions-tracker/reducer';
import defaults, { initialState as defaultsInitialState } from './defaults';
import conferenceMeeting, {
	initialState as conferenceMeetingInitialState,
} from './conference-meeting';
import calendarSyncTeaser, {
	initialState as calendarSyncTeaserInitialState,
} from './calendar-sync-teaser';

export function getInitialState() {
	return Immutable.Map({
		form: formInitialState,
		modal: modalInitialState,
		notifications: notificationsInitialState,
		viewport: viewportInitialState,
		requestState: requestStateInitialState,
		tracking: trackingInitialState,
		actionsTracking: actionsTrackingInitialState,
		defaults: defaultsInitialState,
		conferenceMeeting: conferenceMeetingInitialState,
		calendarSyncTeaser: calendarSyncTeaserInitialState,
	});
}

export default combineReducers({
	form,
	modal,
	notifications,
	viewport,
	requestState,
	tracking,
	actionsTracking,
	defaults,
	conferenceMeeting,
	calendarSyncTeaser,
});
