import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';

import { showSearchResults, visibleItemsSelector } from 'store/modules/sharedState';
import { errorSelector, completedQuerySelector } from 'store/modules/itemSearch';

const MODAL_MAX_HEIGHT = 695;
const MODAL_MIN_HEIGHT = 441;

const TRANSITION_TIME = 400;

export function useTransitions() {
	const searchResultsVisible = useSelector(showSearchResults);

	const [recentItemsOpening, setRecentItemsOpening] = useState(!searchResultsVisible);
	const [sidePanelVisible, setSidepanelVisible] = useState(searchResultsVisible);

	useEffect(() => {
		if (recentItemsOpening) {
			const timeout = setTimeout(() => setRecentItemsOpening(false), TRANSITION_TIME);

			return () => clearTimeout(timeout);
		}
	}, []);

	useEffect(() => {
		if (searchResultsVisible) {
			setRecentItemsOpening(false);
			setSidepanelVisible(true);
		} else {
			setTimeout(() => setSidepanelVisible(false), TRANSITION_TIME);
		}
	}, [searchResultsVisible]);

	return {
		recentItemsOpening,
		sidePanelVisible,
	};
}

export function useContentHeight(ref) {
	const visibleItems = useSelector(visibleItemsSelector);
	const searchError = useSelector(errorSelector);
	const { noResults } = useSelector(completedQuerySelector);

	const [contentHeight, setContentHeight] = useState(0);
	const [hideScrollbar, setHideScrollbar] = useState(false);

	const unhideScrollbarWithDelay = useCallback(
		debounce(() => setHideScrollbar(false), TRANSITION_TIME),
		[],
	);

	useEffect(() => {
		const timeout = setTimeout(() => {
			const newHeight = ref.current?.scrollHeight + 12;

			if (newHeight > contentHeight) {
				setHideScrollbar(true);
				unhideScrollbarWithDelay();
			}

			setContentHeight(newHeight);
		}, 4);

		return () => clearTimeout(timeout);
	}, [visibleItems, searchError, noResults]);

	if (!contentHeight) {
		return {
			modalHeight: MODAL_MIN_HEIGHT,
			hideScrollbar,
		};
	}

	return {
		modalHeight: Math.max(Math.min(contentHeight, MODAL_MAX_HEIGHT), MODAL_MIN_HEIGHT),
		hideScrollbar,
	};
}
