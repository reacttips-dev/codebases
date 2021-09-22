import React from 'react';
import Logger from '@pipedrive/logger-fe';

import ActivityModal from './activities-modal.jsx';

export default async (componentLoader) => {
	const [
		userSelf,
		companyUsers,
		pdMetrics,
		socketHandler,
		router,
		modelCollectionFactory,
	] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:users'),
		componentLoader.load('webapp:metrics'),
		componentLoader.load('webapp:socket-handler'),
		componentLoader.load('froot:router'),
		componentLoader.load('webapp:model-collection-factory'),
	]);

	const webappApi = {
		userSelf,
		companyUsers,
		router,
		pdMetrics,
		socketHandler,
		modelCollectionFactory,
		logger: (...args) => {
			return new Logger(...args);
		},
		componentLoader,
	};

	await modelCollectionFactory.initAsync();

	function ActivityModalWrapper(props) {
		return <ActivityModal {...props} webappApi={webappApi} />;
	}

	ActivityModalWrapper.isMicroFEComponent = true;

	return ActivityModalWrapper;
};
