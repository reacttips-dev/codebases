import React from 'react';
import Logger from '@pipedrive/logger-fe';

import ActivityDeleteConfirmationDialog from './activity-delete-confirmation-dialog.jsx';

export default async (componentLoader) => {
	const [userSelf] = await Promise.all([componentLoader.load('webapp:user')]);

	const webappApi = {
		userSelf,
		logger: (...args) => {
			return new Logger(...args);
		},
	};

	function DialogWrapper(props) {
		return <ActivityDeleteConfirmationDialog {...props} webappApi={webappApi} />;
	}

	DialogWrapper.isMicroFEComponent = true;

	return DialogWrapper;
};
