import { createSlice } from '@reduxjs/toolkit';

import { setSelectedCategory, setSearchTerm, getSearchResults, termSelector, categorySelector } from './itemSearch';
import { recentItemsQuery } from 'utils/request';
import { fetchRecentKeywords, storeRecentKeywords, addNewKeywordToArray } from 'utils/keywords';
import { SEARCH_QUERY_ACTIONS } from 'utils/constants';
import track from 'utils/tracking';

export const initialState = {
	items: [],
	recentsQueryInProgress: false,
	keywords: [],
	error: null,
};

const recentItemsSlice = createSlice({
	name: 'recentItems',
	initialState,
	reducers: {
		setItems(state, { payload }) {
			state.items = payload;
		},
		setRecentsQueryInProgress(state, { payload }) {
			state.recentsQueryInProgress = payload;
		},
		setKeywords(state, { payload }) {
			state.keywords = payload;
		},
		setError(state, { payload }) {
			state.error = payload;
		},
	},
});

const { setItems, setKeywords, setRecentsQueryInProgress, setError } = recentItemsSlice.actions;

export const recentItemsSelector = (state) => state.recentItems.items;
export const recentQueryInProgressSelector = (state) => state.recentItems.recentsQueryInProgress;
export const recentKeywordsSelector = (state) => state.recentItems.keywords;
export const recentErrorSelector = (state) => state.recentItems.error;

function addAdditionalData(result, index, results) {
	result.item.trackingData = {
		rank: index + 1,
		item_count: results.length,
		action_type: result.action_type,
		action_time: result.action_time,
	};

	return result;
}

export function resetRecentItems() {
	return (dispatch) => {
		dispatch(setItems([]));
	};
}

export function getRecentItemsAndKeywords() {
	return async (dispatch) => {
		const recentKeywords = fetchRecentKeywords();
		dispatch(setKeywords(recentKeywords));

		try {
			dispatch(setRecentsQueryInProgress(true));
			const recentItems = await recentItemsQuery();
			dispatch(setItems(recentItems.data.map(addAdditionalData)));
			dispatch(setError(false));

			track.recentItemsOpened(recentKeywords, recentItems.data);
		} catch {
			dispatch(setError(true));
		} finally {
			dispatch(setRecentsQueryInProgress(false));
		}
	};
}

export function recordRecentKeyword() {
	return (dispatch, getState) => {
		const state = getState();

		const previousKeywords = recentKeywordsSelector(state);
		const term = termSelector(state);
		const category = categorySelector(state);

		const newKeywords = addNewKeywordToArray({ category, term }, previousKeywords);

		storeRecentKeywords(newKeywords);
	};
}

export function onKeywordItemClick(item) {
	return (dispatch) => {
		dispatch(setSelectedCategory(item.category));
		dispatch(setSearchTerm(item.term));
		dispatch(getSearchResults(SEARCH_QUERY_ACTIONS.KEYWORD_CLICKED));
	};
}

export default recentItemsSlice.reducer;
