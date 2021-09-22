import React from 'react';
import { useSelector } from 'react-redux';

import {
	filteredSearchResults,
	categorySelector,
	errorSelector,
	completedQuerySelector,
} from 'store/modules/itemSearch';
import { getSearchResultsTitles, getFuzzySearchResultsTitle } from 'utils/helpers';
import ItemsList from './ItemsList';
import NoSearchResults from './emptyAndErrorViews/NoSearchResults';
import ErrorView from './emptyAndErrorViews/ErrorView';
import FuzzySearchCTAs from './FuzzySearchCTAs';

function SearchResults() {
	const searchResults = useSelector(filteredSearchResults);
	const selectedCategory = useSelector(categorySelector);
	const showError = useSelector(errorSelector);
	const { isFuzzy, term, noResults } = useSelector(completedQuerySelector);

	const title = isFuzzy ? getFuzzySearchResultsTitle(term) : getSearchResultsTitles()[selectedCategory];

	if (showError) {
		return <ErrorView />;
	}

	if (noResults) {
		return <NoSearchResults />;
	}

	return (
		<>
			{isFuzzy && <FuzzySearchCTAs />}
			<ItemsList items={searchResults} title={title} />
		</>
	);
}

export default SearchResults;
