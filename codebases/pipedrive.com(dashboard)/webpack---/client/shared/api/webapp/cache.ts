import { keyBy } from 'lodash';

export enum CACHE_KEYS {
	LABEL_OPTIONS_BY_ID = 'LABEL_OPTIONS_BY_ID',
	USERS = 'USERS',
	CURRENT_USER = 'CURRENT_USER',
}

interface WebappApiCache {
	[CACHE_KEYS.LABEL_OPTIONS_BY_ID]?: Pipedrive.DealLabels;
	[CACHE_KEYS.USERS]?: {
		[id: number]: Pipedrive.User;
	};
}

export const webappApiCache: WebappApiCache = {};

export function getFromCache(key: CACHE_KEYS, webappApi: Webapp.API) {
	if (webappApiCache[key]) {
		return webappApiCache[key];
	}

	populateCache(key, webappApi);

	return webappApiCache[key];
}

function populateCache(key: CACHE_KEYS, webappApi: Webapp.API) {
	switch (key) {
		case CACHE_KEYS.LABEL_OPTIONS_BY_ID:
			populateLabelsToCache(key, webappApi);
			break;
		case CACHE_KEYS.USERS:
			populateUsersToCache(key, webappApi);
			break;
	}
}

function populateLabelsToCache(key: CACHE_KEYS, webappApi: Webapp.API) {
	const labelField = webappApi.userSelf.fields.getByKey('deal', 'label');

	if (!labelField) {
		webappApiCache[key] = {};

		return;
	}

	const labelOptions = labelField.options || [];

	webappApiCache[key] = labelOptions.reduce((labelOptionsById: Pipedrive.DealLabels, { id, color, label }) => {
		labelOptionsById[id] = { color, label };
		return labelOptionsById;
	}, {});
}

function populateUsersToCache(key: CACHE_KEYS, webappApi: Webapp.API) {
	webappApiCache[key] = keyBy(
		webappApi.companyUsers.models.map((user) => {
			return user.attributes;
		}),
		'id',
	);
}
