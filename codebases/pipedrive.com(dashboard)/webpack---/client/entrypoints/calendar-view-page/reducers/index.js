import * as Immutable from 'immutable';
import { combineReducers } from 'redux-immutable';
import filter, { initialState as filterInitialState } from './filter';
import activityTypeFilter, {
	initialState as activityTypeFilterInitialState,
} from './activity-type-filter';
import weekSelect, { initialState as weekSelectInitialState } from './week-select';
import scheduler, { initialState as schedulerInitialState } from './scheduler';
import conferenceMeetingIntegration, {
	initialState as conferenceMeetingIntegrationInitialState,
} from './conference-meeting-integration';
import calendarSync, { initialState as calendarSyncInitialState } from './calendar-sync';

export function getInitialState() {
	return Immutable.Map({
		filter: filterInitialState,
		activityTypeFilter: activityTypeFilterInitialState,
		weekSelect: weekSelectInitialState,
		scheduler: schedulerInitialState,
		conferenceMeetingIntegration: conferenceMeetingIntegrationInitialState,
		calendarSync: calendarSyncInitialState,
	});
}

export default combineReducers({
	filter,
	activityTypeFilter,
	weekSelect,
	scheduler,
	conferenceMeetingIntegration,
	calendarSync,
});
