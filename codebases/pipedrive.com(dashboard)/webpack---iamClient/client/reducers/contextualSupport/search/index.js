import Immutable from 'seamless-immutable';
import { cloneDeep } from 'lodash';
import { searchActions } from 'actions/contextualSupport';
import { DEFAULT_LANGUAGE } from 'constants/preferences';

const initialState = Immutable.from({
	fetching: false,
	results: null,
	error: null,
	query: null,
});

export const categorizeSuggestions = (results, articleLang) => {
	let localizedResults = results[articleLang] || [];

	if (!localizedResults.length && results[DEFAULT_LANGUAGE] && results[DEFAULT_LANGUAGE].length) {
		localizedResults = results[DEFAULT_LANGUAGE];
		articleLang = DEFAULT_LANGUAGE;
	}

	const categorizedResults = localizedResults && localizedResults.reduce((acc, item) => {
		if (item && item.title) {
			const title = item.title.trim().toUpperCase();

			let priority = 2;

			if (title.startsWith('VIDEO') || title.startsWith('VÍDEO')) {
				priority = 1;
			} else if (title.endsWith('?')) {
				priority = 3;
			}

			acc.push({
				...item,
				priority,
			});
		}

		return acc;
	}, []);

	if (!categorizedResults || !categorizedResults.length) {
		return null;
	}

	return {
		[articleLang]: categorizedResults.sort((a, b) => {
			if (a.priority > b.priority) {
				return 1;
			}

			if (a.priority < b.priority) {
				return -1;
			}

			return 0;
		}),
	};
};

const categorizeSearchResults = (results, userLang) => {
	const resultsCopy = cloneDeep(results);
	const resultList = [];

	resultsCopy.sort((a) => {
		if (a.source === 'support') {
			return -1;
		}

		if (a.source === 'academy') {
			return 0;
		}

		return 1; // source === community
	});

	resultsCopy.forEach((source) => {
		for (const item of source.hits) {
			if (source.source === 'community' && item.lang && (item.lang !== userLang && item.lang !== DEFAULT_LANGUAGE)) {
				continue;
			}

			item.source = source.source;
			resultList.push(item);
		}
	});

	return resultList;
};

export default function(state = initialState, action) {
	switch (action.type) {
		case searchActions.SUPPORT_SEARCH_REQUEST:
			return Immutable.merge(state, {
				fetching: true,
				results: null,
				error: null,
				query: action.query,
			});
		case searchActions.SUPPORT_SEARCH_RECEIVE:
			return Immutable.merge(state, {
				fetching: false,
				results: [...categorizeSearchResults(action.results, action.userLang)],
				error: null,
			});
		case searchActions.SUPPORT_SEARCH_FAIL:
			return Immutable.merge(state, {
				fetching: false,
				results: null,
				error: action.error,
			});
		case searchActions.SUPPORT_SEARCH_INVALIDATE:
			return Immutable.merge(state, {
				fetching: false,
				results: null,
				error: null,
				query: null,
			});
		default:
			return state;
	}
}
