import { createSlice, createSelector } from '@reduxjs/toolkit';
import isEqual from 'lodash/isEqual';

import { searchQuery } from 'utils/request';
import {
	ALL_CATEGORIES,
	ITEM_TYPES,
	ERR_OUTDATED_QUERY,
	ERR_UNSUCCESSFUL_REQUEST,
	SEARCH_QUERY_ACTIONS,
} from 'utils/constants';
import { filterOutExistingResults, filterResultsByCategory } from 'utils/helpers';
import { makeTermRegex } from 'utils/termHighlight';
import { resetActiveItemIndex, setModalVisible, setSearchResultsVisible } from './sharedState';
import track from 'utils/tracking';

const { FILE, MAIL_ATTACHMENT } = ITEM_TYPES;
const { TERM_ENTERED, CATEGORY_SELECTED, PAGINATION } = SEARCH_QUERY_ACTIONS;

export const initialState = {
	results: [],
	queryInProgress: false,
	error: null,
	selectedCategory: ALL_CATEGORIES,
	term: '',
	completedQuery: {
		term: '',
		category: null,
		isFuzzy: false,
		noResults: false,
	},
	paginationStart: 0,
	moreItemsToLoad: false,
};

const itemSearchSlice = createSlice({
	name: 'itemSearch',
	initialState,
	reducers: {
		setQueryInProgress(state, { payload }) {
			state.queryInProgress = payload;
		},
		setError(state, { payload }) {
			state.error = payload;
		},
		setSearchResults(state, { payload }) {
			state.results = payload;
		},
		appendSearchResults(state, { payload }) {
			const resultsToAppend = filterOutExistingResults(payload, state.results);

			state.results = [...state.results, ...resultsToAppend];
		},
		setSelectedCategory(state, { payload }) {
			state.selectedCategory = payload;
		},
		setSearchTerm(state, { payload }) {
			state.term = payload;
		},
		setCompletedQuery(state, { payload }) {
			state.completedQuery = payload;
		},
		setPaginationStart(state, { payload }) {
			state.paginationStart = payload || 0;
		},
		setMoreItemsToLoad(state, { payload }) {
			state.moreItemsToLoad = payload;
		},
	},
});

export const categorySelector = (state) => state.itemSearch.selectedCategory;
export const allResultsSelector = (state) => state.itemSearch.results;

export const filteredSearchResults = createSelector(allResultsSelector, categorySelector, (results, category) =>
	filterResultsByCategory(results, category),
);

export const errorSelector = (state) => state.itemSearch.error;
export const termSelector = (state) => state.itemSearch.term;
export const completedQuerySelector = (state) => state.itemSearch.completedQuery;
export const highlightRegexSelector = createSelector(completedQuerySelector, ({ term }) => {
	return makeTermRegex(term);
});
const itemTypeParamSelector = (state) => {
	const { selectedCategory } = state.itemSearch;

	if (selectedCategory === ALL_CATEGORIES) {
		return {};
	}

	return {
		item_types: selectedCategory === FILE ? `${FILE},${MAIL_ATTACHMENT}` : selectedCategory,
	};
};
export const queryParamsSelector = (state) => {
	const { term, paginationStart } = state.itemSearch;

	return {
		term,
		start: paginationStart,
		...itemTypeParamSelector(state),
	};
};

export const queryInProgressSelector = (state) => state.itemSearch.queryInProgress;

export const {
	setQueryInProgress,
	setError,
	setSearchResults,
	setSelectedCategory,
	setSearchTerm,
	appendSearchResults,
	enableScrollRequests,
	setPaginationStart,
	setMoreItemsToLoad,
	setCompletedQuery,
} = itemSearchSlice.actions;

export function resetTermAndResults() {
	return (dispatch) => {
		dispatch(setSearchTerm(''));
		dispatch(setSearchResults([]));
		dispatch(setSearchResultsVisible(false));
		dispatch(setCompletedQuery(initialState.completedQuery));
		dispatch(resetActiveItemIndex());
		dispatch(setQueryInProgress(false));
		dispatch(setSelectedCategory(ALL_CATEGORIES));
		track.endSearchPhraseSession();
	};
}

export function onSearchCategoryChange(category) {
	return (dispatch, getState) => {
		if (category === ALL_CATEGORIES && categorySelector(getState()) !== ALL_CATEGORIES) {
			dispatch(setSearchResults([]));
		}
		dispatch(setSelectedCategory(category));
		dispatch(getSearchResults(CATEGORY_SELECTED));
	};
}

export function fetchMoreResults() {
	return (dispatch, getState) => {
		const {
			itemSearch: { queryInProgress, moreItemsToLoad },
		} = getState();

		if (!queryInProgress && moreItemsToLoad) {
			dispatch(getSearchResults(PAGINATION));
		}
	};
}

function searchTermTooShort(getState) {
	const term = termSelector(getState());
	return term.trim().length < 2;
}

export function getSearchResults(userAction) {
	return async (dispatch, getState) => {
		if (searchTermTooShort(getState)) {
			return;
		}

		if (userAction !== PAGINATION) {
			dispatch(setPaginationStart(0));
		}

		dispatch(setQueryInProgress(true));

		try {
			const { data, nextStart, moreItems, term, duration, category, isFuzzy } = await dispatch(doSearchQuery());

			dispatch(resetActiveItemIndex());
			if (userAction === PAGINATION) {
				dispatch(appendSearchResults(data));
			} else {
				dispatch(setSearchResults(data));
				dispatch(setCompletedQuery({ term, category, isFuzzy, noResults: data.length === 0 }));
			}

			dispatch(setMoreItemsToLoad(moreItems));
			dispatch(setPaginationStart(nextStart));
			dispatch(setError(false));
			dispatch(setQueryInProgress(false));
			dispatch(setSearchResultsVisible(true));

			if (userAction === TERM_ENTERED) {
				track.searchTermEntered({ data, term, category, duration, isFuzzy });
			}
		} catch (err) {
			if (err.message === ERR_OUTDATED_QUERY) {
				return;
			}
			dispatch(setError(true));
			dispatch(setQueryInProgress(false));
			dispatch(setSearchResultsVisible(true));
		}
	};
}

function doSearchQuery() {
	return async (dispatch, getState) => {
		const queryParams = queryParamsSelector(getState());
		const category = categorySelector(getState());

		const start = Date.now();
		const queryParamsWithCleanedTerm = { ...queryParams, term: queryParams.term.trim().substring(0, 100) };

		const {
			success,
			data: rawData,
			additional_data: {
				pagination: { next_start: nextStart, more_items_in_collection: moreItems },
				isFuzzy,
			},
		} = await searchQuery(queryParamsWithCleanedTerm);

		const duration = Date.now() - start;

		if (queryParamsChanged(queryParams, getState)) {
			throw new Error(ERR_OUTDATED_QUERY);
		}

		if (!success) {
			throw new Error(ERR_UNSUCCESSFUL_REQUEST);
		}

		const data = rawData.map((result, index, results) => addAdditionalData(result, index, results, isFuzzy));

		return { data, nextStart, moreItems, term: queryParams.term, duration, category, isFuzzy };
	};
}

function addAdditionalData(result, index, results, isFuzzy) {
	result.item.isSearchResult = true;
	result.item.trackingData = {
		rank: index + 1,
		result_count: results.length,
		result_score: result.result_score,
		related_item: result.result_score === 0,
		matched_fields: result.matched_fields,
		is_fuzzy: isFuzzy,
	};

	return result;
}

function queryParamsChanged(queryparams, getState) {
	const currentParams = queryParamsSelector(getState());

	return !isEqual(queryparams, currentParams);
}

export function onQuickHelpClick(supportSidebar) {
	return (dispatch, getState) => {
		const state = getState();
		const searchQuery = termSelector(state);

		supportSidebar.hide();
		setImmediate(() => supportSidebar.toggle({ searchQuery }));

		dispatch(setModalVisible(false));

		const visibleSearchResults = filteredSearchResults(state);
		track.quickHelpOpened({
			hasResults: visibleSearchResults.length > 0,
		});
	};
}

export default itemSearchSlice.reducer;
