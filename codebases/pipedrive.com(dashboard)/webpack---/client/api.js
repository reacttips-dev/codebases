import { put, post, get, remove } from '@pipedrive/fetch';
import Logger from '@pipedrive/logger-fe';
import cookies from './utils/cookies';

const logger = new Logger('activities-components', 'api');

const getSessionTokenQueryParam = () => {
	return `session_token=${cookies.get('pipe-session-token')}`;
};

const baseActivityUpdate = (headers = {}) => (activityId, data) => {
	return put(`/api/v1/activities/${activityId}`, data, headers);
};

const baseActivityCreate = (options = {}) => (data) => {
	return post('/api/v1/activities', data, options);
};

const createActivity = baseActivityCreate();

const updateActivity = baseActivityUpdate();

const getActivityById = (id) => get(`/api/v1/activities/${id}`);
const deleteActivity = (activityId, data = {}) => remove(`/api/v1/activities/${activityId}`, data);

const createOrganization = (data) => post('/api/v1/organizations', data);
const getOrganizationById = (id) => get(`/api/v1/organizations/${id}`);

const createPerson = (data) => post('/api/v1/persons', data);
const getPersonById = (id) => get(`/api/v1/persons/${id}`);

const getDealById = (id) => get(`/api/v1/deals/${id}`);

const getProjectById = (id) => get(`/api/v1/projects/${id}`);

const getCallLogForActivity = async (id) => {
	const response = await fetch(`/api/v1/public/sales-phone/flow/activity_id/${id}/call`);

	if (response.status === 200) {
		const responseObject = await response.json();

		return responseObject[0];
	} else {
		return null;
	}
};

class FetchError extends Error {
	constructor(message = 'FetchError', { status, statusText }) {
		super(`${message}. Status: ${status} (${statusText})`);

		this.name = 'FetchError';
		this.status = status;
		this.statusText = statusText;
	}
}

const deleteCallLog = (callLogId) => {
	remove(`/api/v1/callLogs/${callLogId}`).catch((error) =>
		logger.logError(error, 'Unable to delete call log.', 'error', { callLogId }),
	);
};

const checkSync = async (url) => {
	const response = await fetch(url);

	// Don't show teaser (!true)
	// if we cannot determine if user has sync before
	if (response.status === 401) {
		return true;
	}

	if (!response.ok) {
		throw new FetchError(await response.text(), response);
	}

	const { hadEverBeenActivated } = await response.json();

	return !!hadEverBeenActivated;
};

const hasHadCalendarSync = () =>
	Promise.all([
		checkSync('/api/calendar-sync/v1/accounts/sync/had-ever-been-activated'),
		checkSync('/api/v1/fastis/sync/hadEverBeenActivated'),
	])
		.then((results) => results.some(Boolean))
		.catch((e) => {
			const message = 'Unable to check if user ever had calendar sync active';

			logger.logError(e, message);
			e.message = `${message}. Status: ${e.status} (${e.statusText})`;

			throw e;
		});

let cachedHasActiveCalendarSync = null;

const checkActiveSync = async (url) => {
	const response = await fetch(url);

	// Don't show specific dialog
	// if we cannot determine if user has active sync
	if (response.status === 401) {
		return false;
	}

	if (!response.ok) {
		throw new FetchError(await response.text(), response);
	}

	// API response with 204 NO CONTENT when no account found
	const { status } = response.status === 204 ? {} : await response.json();

	return (cachedHasActiveCalendarSync = status === 'active');
};

const hasActiveCalendarSync = async (useCache = true) => {
	if (cachedHasActiveCalendarSync !== null && useCache) {
		return cachedHasActiveCalendarSync;
	}

	return Promise.all([
		checkActiveSync('/api/calendar-sync/v1/accounts/sync/active'),
		checkActiveSync('/api/v1/fastis/sync/active'),
	])
		.then((results) => (cachedHasActiveCalendarSync = results.some(Boolean)))
		.catch((e) => {
			const message = 'Unable to check if user has calendar sync active';

			logger.logError(e, message);
			e.message = `${message}. Status: ${e.status} (${e.statusText})`;

			throw e;
		});
};

const findPerson = async (term) => {
	const { data } = await get('/api/v1/persons/search', {
		queryParams: { term, limit: 100, strict_mode: true },
	});

	return data?.items?.map((obj) => obj.item) || [];
};

const getOrganizationPeople = (orgId) => get(`/api/v1/organizations/${orgId}/persons`);
const getDealParticipants = (dealId) => get(`/api/v1/deals/${dealId}/participants`);

const searchEntities = async ({ itemTypes, term, fields, limit = 100, exactMatch = false }) => {
	if (!term) {
		throw new Error('Search term must be provided');
	}

	const {
		data: { items = [] },
	} = await get(`/api/v1/itemSearch`, {
		queryParams: {
			itemTypes,
			term,
			fields,
			limit,
			exactMatch,
			newFormat: true,
		},
	});

	return items;
};

const searchProjects = async ({ term }) => {
	if (!term) {
		throw new Error('Search term must be provided');
	}

	const {
		data: { items = [] },
	} = await get(`/api/v1/projects/search`, {
		queryParams: {
			title: term,
		},
	});

	return items;
};

const createMeetingLinkFromMeetingApi = async ({ topic, startTime, duration, clientId }) => {
	const options = {
		method: 'POST',
		body: JSON.stringify({ topic, start_time: startTime, duration, client_id: clientId }),
		headers: { 'Content-Type': 'application/json' },
	};

	return fetch(`/api/v1/meeting-api/meetings?${getSessionTokenQueryParam()}`, options)
		.then((response) => {
			if (!response.ok) {
				return { errorCode: response.status };
			}

			return response.json();
		})
		.catch((e) => {
			const message = 'Unable to create meeting link';

			logger.logError(e, message);
			e.message = `${message}: ${e.status} (${e.statusText})`;

			throw e;
		});
};

const deleteMeetingLinkFromMeetingApi = async (conferenceMeetingId) => {
	return fetch(
		`/api/v1/meeting-api/meetings/${conferenceMeetingId}?${getSessionTokenQueryParam()}`,
		{ method: 'DELETE' },
	)
		.then((response) => response.json())
		.catch((e) => {
			const message = 'Unable to delete meeting link';

			logger.logError(e, message);
			e.message = `${message}: ${e.status} (${e.statusText})`;

			throw e;
		});
};

const getConferenceMeetingIntegrations = async (language) => {
	return await get('/api/v1/meeting-api/meetings/integrations', { queryParams: { language } });
};

const hasActiveCompanyWorkflowAutomations = async () => {
	return await get('/api/v2/automation-workflow/summary');
};

export {
	createActivity,
	updateActivity,
	deleteActivity,
	deleteCallLog,
	getActivityById,
	getCallLogForActivity,
	createOrganization,
	createPerson,
	getDealById,
	getPersonById,
	getOrganizationById,
	getProjectById,
	hasHadCalendarSync,
	hasActiveCalendarSync,
	checkActiveSync,
	findPerson,
	getOrganizationPeople,
	getDealParticipants,
	searchEntities,
	searchProjects,
	createMeetingLinkFromMeetingApi,
	deleteMeetingLinkFromMeetingApi,
	getConferenceMeetingIntegrations,
	hasActiveCompanyWorkflowAutomations,
};
