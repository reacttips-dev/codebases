import * as Immutable from 'immutable';
import { combineReducers } from 'redux-immutable';
import dates, { initialState as datesInitialState } from './dates';
import calendar, { initialState as calendarInitialState } from './calendar';
import viewport, { initialState as viewportInitialState } from './viewport';
import scrollToTime, { initialState as scrollToTimeInitialState } from './scroll-to-time';
import query, { initialState as queryInitialState } from './query';
import tracking, { initialState as trackingInitialState } from './tracking';

export function getInitialState() {
	return Immutable.Map({
		dates: datesInitialState,
		calendar: calendarInitialState,
		viewport: viewportInitialState,
		scrollToTime: scrollToTimeInitialState,
		query: queryInitialState,
		tracking: trackingInitialState,
	});
}

export default combineReducers({
	dates,
	calendar,
	viewport,
	scrollToTime,
	query,
	tracking,
});
