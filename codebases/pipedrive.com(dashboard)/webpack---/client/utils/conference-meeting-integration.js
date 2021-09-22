import moment from 'moment';
import Logger from '@pipedrive/logger-fe';
import { getConferenceMeetingIntegrations } from '../api';
import {
	MINUTES_IN_DAY,
	UTC_DATETIME_FORMAT,
	RETRY_ERROR,
	CONNECT_ERROR,
} from '../config/constants';
import { fromJS } from 'immutable';

const logger = new Logger('activities-components', 'conference-meeting-integration-util');

let integrations = null;

const getIntegrations = async (webappApi, useCache = true) => {
	if (integrations !== null && useCache) {
		return integrations;
	}

	try {
		const { data } = await getConferenceMeetingIntegrations(webappApi.userSelf.getLanguage());

		integrations = data;
	} catch (err) {
		logger.error(err, 'Unable to fetch conference meeting integrations.');

		integrations = [];
	}

	return integrations;
};

const getInstalledIntegration = (conferenceMeetingIntegrations) => {
	return conferenceMeetingIntegrations.find((integration) => integration.is_installed);
};

const getConferenceLinkOptions = ({ topic, dueDate, dueTime, duration, clientId }) => {
	const startTime = dueTime
		? `${dueDate} ${dueTime}`
		: moment(dueDate).utc().format(UTC_DATETIME_FORMAT);

	return {
		topic,
		startTime,
		duration: moment.duration(duration).asMinutes() || MINUTES_IN_DAY,
		clientId,
	};
};

const getConferenceLinkErrorType = (err) => {
	return err.errorCode === 401 ? CONNECT_ERROR : RETRY_ERROR;
};

const separateConferenceIntegrationsByInstall = (integrationsToSeparate) => {
	const initialState = { installedIntegrations: [], notInstalledIntegrations: [] };

	const separatedIntegrations = integrationsToSeparate.reduce(
		(result, integration) =>
			integration.get('is_installed')
				? {
						...result,
						installedIntegrations: [...result.installedIntegrations, integration],
				  }
				: {
						...result,
						notInstalledIntegrations: [...result.notInstalledIntegrations, integration],
				  },
		initialState,
	);

	return fromJS(separatedIntegrations);
};

export {
	getIntegrations,
	getConferenceLinkOptions,
	getConferenceLinkErrorType,
	getInstalledIntegration,
	separateConferenceIntegrationsByInstall,
};
