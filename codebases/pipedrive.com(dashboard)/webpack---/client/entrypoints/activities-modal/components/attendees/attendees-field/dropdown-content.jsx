import React from 'react';

import SearchResults from '../search-results';
import Recommendations from '../recommendations';
import PropTypes from 'prop-types';

const dropDownContent = ({ recommendations, searchResults, downshiftProps }) => {
	const { inputValue, getItemProps, highlightedIndex } = downshiftProps;
	const shouldShowSearchResults = inputValue && inputValue.length > 1;
	const hasRecommendations = recommendations && recommendations.length > 0;

	if (shouldShowSearchResults) {
		return (
			<SearchResults
				results={searchResults}
				getItemProps={getItemProps}
				highlightedIndex={highlightedIndex}
				inputValue={inputValue}
			/>
		);
	}

	if (hasRecommendations) {
		return (
			<Recommendations
				recommendations={recommendations}
				getItemProps={getItemProps}
				highlightedIndex={highlightedIndex}
			/>
		);
	}

	return null;
};

dropDownContent.propTypes = {
	downshiftProps: PropTypes.object.isRequired,
	recommendations: PropTypes.array,
	searchResults: PropTypes.array,
};

export default dropDownContent;
