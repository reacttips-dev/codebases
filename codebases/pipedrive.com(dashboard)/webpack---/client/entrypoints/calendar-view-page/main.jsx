import React from 'react';
import Logger from '@pipedrive/logger-fe';

import App from './index';

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

	function CalendarViewPage() {
		return <App webappApi={webappApi} calendarViewUrl="/activities/calendar" />;
	}

	CalendarViewPage.isMicroFEComponent = true;

	return CalendarViewPage;
};
