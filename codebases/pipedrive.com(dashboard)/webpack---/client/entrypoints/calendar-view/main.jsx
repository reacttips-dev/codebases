import React from 'react';
import Logger from '@pipedrive/logger-fe';

import { CalendarItemInterface } from './interface/calendar-item-interface';
import { extendActivitiesInterface } from './interface/activities-interface';
import { extendTimeslotsInterface } from './interface/timeslots-interface';
import { extendExistingActivityInterface } from './interface/custom-activities-interface';
import { extendNewActivityInterface } from './interface/new-activity-interface';

import CalendarView from './calendar-view.jsx';

export default async (componentLoader) => {
	const [userSelf, socketHandler, router, pdMetrics] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:socket-handler'),
		componentLoader.load('froot:router'),
		componentLoader.load('webapp:metrics'),
	]);

	const webappApi = {
		userSelf,
		socketHandler,
		router,
		pdMetrics,
		logger: (...args) => {
			return new Logger(...args);
		},
		componentLoader,
	};

	function CalendarViewWrapper(props) {
		return <CalendarView webappApi={webappApi} {...props} />;
	}

	CalendarViewWrapper.isMicroFEComponent = true;

	return {
		CalendarView: CalendarViewWrapper,
		CalendarItemInterface,
		extendActivitiesInterface,
		extendTimeslotsInterface,
		extendExistingActivityInterface,
		extendNewActivityInterface,
	};
};
