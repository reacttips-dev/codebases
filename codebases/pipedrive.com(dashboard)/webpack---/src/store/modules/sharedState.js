import { createSelector, createSlice } from '@reduxjs/toolkit';

import { filterResultsByCategory } from 'utils/helpers';
import track from 'utils/tracking';

export const initialState = {
	searchResultsVisible: false,
	modalVisible: false,
	activeItemIndex: 0,
	visibleImageItem: null,
};

const sharedStateSlice = createSlice({
	name: 'sharedState',
	initialState,
	reducers: {
		setSearchResultsVisible(state, { payload }) {
			state.searchResultsVisible = payload;
		},
		setModalVisible(state, { payload: isVisible }) {
			state.modalVisible = isVisible;
		},
		setActiveItemIndex(state, { payload: newIndex }) {
			state.activeItemIndex = newIndex;
		},
		resetActiveItemIndex(state) {
			state.activeItemIndex = 0;
		},
		setVisibleImageItem(state, { payload: item }) {
			state.visibleImageItem = item;
		},
	},
});

export const { resetActiveItemIndex, setSearchResultsVisible, setActiveItemIndex } = sharedStateSlice.actions;

export const showSearchResults = (state) => state.sharedState.searchResultsVisible;
export const modalVisibleSelector = (state) => state.sharedState.modalVisible;
export const activeItemSelector = (state) => state.sharedState.activeItemIndex;
export const visibleImageSelector = (state) => state.sharedState.visibleImageItem;

const visibleSearchResultsSelector = createSelector(
	(state) => state.itemSearch.results,
	(state) => state.itemSearch.selectedCategory,
	(results, category) => filterResultsByCategory(results, category),
);

export const visibleItemsSelector = createSelector(
	showSearchResults,
	visibleSearchResultsSelector,
	(state) => state.recentItems.keywords,
	(state) => state.recentItems.items,
	(searchResultsVisible, visibleSearchResults, recentKeywords, recentItems) => {
		if (searchResultsVisible) {
			return visibleSearchResults;
		}
		return recentKeywords.concat(recentItems);
	},
);

export function setModalVisible(visible) {
	return (dispatch, getState) => {
		if (visible) {
			track.recordModalOpening();
		}

		dispatch(sharedStateSlice.actions.setModalVisible(visible));

		const searchResultsVisible = showSearchResults(getState());
		if (!visible && !searchResultsVisible) {
			dispatch(resetActiveItemIndex());
		}
	};
}

const { setVisibleImageItem } = sharedStateSlice.actions;

export function openImageOverlay(item) {
	return (dispatch) => {
		dispatch(setVisibleImageItem(item));
	};
}

export function closeImageOverlay() {
	return (dispatch) => {
		dispatch(setVisibleImageItem(null));
	};
}

export default sharedStateSlice.reducer;
