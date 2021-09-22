export const SETTINGS_FETCH_HEADERS = 'SETTINGS_FETCH_HEADERS';
export const SETTINGS_FETCH_URI_PREFIX = 'SETTINGS_FETCH_URI_PREFIX';

export const setFetchHeaders = (headers) => {
	return ({
		type: SETTINGS_FETCH_HEADERS,
		headers,
	});
};

export const setFetchUriPrefix = (uriPrefix) => {
	return ({
		type: SETTINGS_FETCH_URI_PREFIX,
		uriPrefix,
	});
};
