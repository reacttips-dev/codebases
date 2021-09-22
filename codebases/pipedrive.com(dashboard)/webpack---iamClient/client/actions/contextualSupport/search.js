import { events as seshetaEvents } from 'constants/sesheta.json';
import { events as amplitudeEvents } from 'constants/amplitude.json';
import routes from 'constants/contextualSupport/routes.json';
import { serializeSearchArticles } from 'utils/serializeArticles';

export const SUPPORT_SEARCH_REQUEST = 'SUPPORT_SEARCH_REQUEST';
export const SUPPORT_SEARCH_RECEIVE = 'SUPPORT_SEARCH_RECEIVE';
export const SUPPORT_SEARCH_FAIL = 'SUPPORT_SEARCH_FAIL';
export const SUPPORT_SEARCH_INVALIDATE = 'SUPPORT_SEARCH_INVALIDATE';

export const searchReceive = (results, query, userLang) => {
	const searchReceiveAction = {
		type: SUPPORT_SEARCH_RECEIVE,
		results,
		userLang,
		meta: {
			route: {
				pathname: routes.SEARCH_RESULTS,
			},
		},
	};

	const receivedSources = results.filter(result => Array.isArray(result.hits)).reduce((acc, perSource) => {
		if (perSource.hits.length) {
			acc.push(perSource.source);
		}

		return acc;
	}, []);

	if (receivedSources.length) {
		searchReceiveAction.meta.sesheta = {
			name: seshetaEvents.search.RECEIVED,
			data: serializeSearchArticles(results),
		};

		searchReceiveAction.meta.amplitude = {
			event: amplitudeEvents.search.SEARCHED,
			data: {
				keyword: query,
				result_source: receivedSources,
			},
		};
	} else {
		searchReceiveAction.meta.sesheta = {
			name: seshetaEvents.search.NO_RESULTS,
			data: {
				query,
			},
			debounce: 1500,
		};

		searchReceiveAction.meta.amplitude = {
			event: amplitudeEvents.search.SEARCHED,
			data: {
				keyword: query,
				result_source: 'no_results',
			},
		};
	}

	return searchReceiveAction;
};

export const searchInvalidate = () => {
	return {
		type: SUPPORT_SEARCH_INVALIDATE,
		meta: {
			route: {
				pathname: routes.INDEX,
			},
			fetch: {
				invalidate: true,
			},
		},
	};
};

export const searchFail = (error, details) => {
	return {
		type: SUPPORT_SEARCH_FAIL,
		error,
		meta: {
			route: {
				pathname: routes.SEARCH_RESULTS,
			},
			sesheta: {
				name: seshetaEvents.search.FAILED,
				data: {
					details,
					error,
				},
			},
		},
	};
};

export const searchRequest = (query, userLang) => {
	const baseDomain = window?.app?.config?.baseDomain || 'pipedrive.com';
	const request = {
		endpoint: `https://www.${baseDomain}/search/all`,
		method: 'GET',
		params: {
			term: query,
			locale: userLang,
			limit: 5,
			sources: 'academy,community,support',
		},
		withoutSessionToken: true,
	};

	return {
		type: SUPPORT_SEARCH_REQUEST,
		query,
		meta: {
			route: {
				pathname: routes.FETCHING,
				replace: true,
			},
			sesheta: {
				name: seshetaEvents.search.REQUESTED,
				data: {
					query,
				},
				debounce: 1500,
			},
			fetch: {
				request,
				success: (results) => {
					return searchReceive(results, query, userLang);
				},
				fail: (error) => {
					return searchFail(error, request);
				},
			},
		},
	};
};

export const search = (query) => (dispatch, getState) => {
	const userLang = getState().user.userLang;

	return dispatch(searchRequest(query, userLang));
};
