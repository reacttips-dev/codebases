import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import throttle from 'lodash/throttle';

import { showSearchResults } from 'store/modules/sharedState';
import { fetchMoreResults, filteredSearchResults } from 'store/modules/itemSearch';

export function usePaginationOnScroll() {
	const dispatch = useDispatch();
	const searchResultsVisible = useSelector(showSearchResults);

	const onScroll = useCallback(
		throttle((event) => {
			const { scrollTop, scrollHeight } = event.target;
			const viewBoxHeight = event.target.getBoundingClientRect().height;
			const scrollPercentage = (scrollTop + viewBoxHeight) / scrollHeight;

			if (scrollPercentage > 0.9) {
				dispatch(fetchMoreResults());
			}
		}, 300),
		[dispatch],
	);

	return (event) => {
		if (!searchResultsVisible) {
			return;
		}

		event.persist();
		onScroll(event);
	};
}

export function usePaginateOnInitialResults(contentRef, contentHeightRef) {
	const dispatch = useDispatch();
	const searchResults = useSelector(filteredSearchResults);
	const searchResultsVisible = useSelector(showSearchResults);

	useEffect(() => {
		if (!searchResultsVisible || !contentRef.current || !contentHeightRef.current) {
			return;
		}

		const contentBottom = contentHeightRef.current.getBoundingClientRect().bottom;
		const modalBottom = contentRef.current.getBoundingClientRect().bottom;

		if (contentBottom < modalBottom) {
			dispatch(fetchMoreResults());
		}
	}, [searchResults, searchResultsVisible]);
}
