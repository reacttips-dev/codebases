import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Option, Icon } from '@pipedrive/convention-ui-react';

import { getMatch, getSearchResultKey } from './helpers';

const SearchResultOption = styled(Option)`
	display: flex;
	align-items: flex-start;
	overflow: hidden;
`;
const SearchResultIcon = styled(Icon)`
	margin: 2px 10px 0 0;
`;
const SearchResultContent = styled.div`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;
const Match = styled.span`
	background: ${(props) => (props.isHighlighted ? `rgba(255, 255, 255, 0.32)` : `yellow`)};
`;

const SearchResult = ({ person, itemProps, isHighlighted, inputValue }) => {
	const { name, email_address: emailAddress } = person;
	const content = emailAddress ? `${name} (${emailAddress})` : name;
	const contentWithMatch = getMatch(content, inputValue.trim());

	return (
		<SearchResultOption {...itemProps} highlighted={isHighlighted}>
			<SearchResultIcon icon="person" size="s" />
			<SearchResultContent>
				{contentWithMatch.map((content) =>
					content.match ? (
						<Match key={`${content.value}-search-result`} isHighlighted={isHighlighted}>
							{content.value}
						</Match>
					) : (
						content.value
					),
				)}
			</SearchResultContent>
		</SearchResultOption>
	);
};

SearchResult.propTypes = {
	person: PropTypes.object.isRequired,
	itemProps: PropTypes.object.isRequired,
	isHighlighted: PropTypes.bool,
	inputValue: PropTypes.string.isRequired,
};

const SearchResults = ({ results, getItemProps, highlightedIndex, inputValue }) => {
	if (!results || !results.length) {
		return null;
	}

	return results.map((person, index) => (
		<SearchResult
			key={getSearchResultKey(person)}
			person={person}
			itemProps={getItemProps({ key: getSearchResultKey(person), index, item: person })}
			isHighlighted={highlightedIndex === index}
			inputValue={inputValue}
		/>
	));
};

SearchResults.propTypes = {
	results: PropTypes.array,
	getItemProps: PropTypes.func.isRequired,
	highlightedIndex: PropTypes.number,
	inputValue: PropTypes.string.isRequired,
};

export default SearchResults;
