import React from 'react';
import Logger from '@pipedrive/logger-fe';

import ActivityGlobalMessages from './activity-global-messages.jsx';

export default async (componentLoader) => {
	const [userSelf, pdMetrics, router] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:metrics'),
		componentLoader.load('froot:router'),
	]);

	const webappApi = {
		userSelf,
		pdMetrics,
		logger: (...args) => {
			return new Logger(...args);
		},
		router,
	};

	function ActivityGlobalMessagesWrapper(props) {
		return <ActivityGlobalMessages {...props} webappApi={webappApi} />;
	}

	return ActivityGlobalMessagesWrapper;
};
