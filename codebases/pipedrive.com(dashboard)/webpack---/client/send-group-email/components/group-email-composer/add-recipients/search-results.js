import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import get from 'lodash/get';
import { Option } from '@pipedrive/convention-ui-react';
import fonts from '@pipedrive/convention-ui-css/dist/amd/fonts.js';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';

import { useTranslator } from 'utils/translator/translator-hook';

const SearchResult = styled(Option)`
	width: 288px;
`;
const NoSearchResults = styled.div`
	width: 256px;
	color: ${colors['$color-black-hex-64']};
	font-size: ${fonts['$font-size-m']};
	padding: 8px 16px;
`;
const SearchResultsDropdown = styled.div`
	max-height: 272px;
	overflow-y: auto;
`;
const RecipientName = styled.div`
	font-size: ${fonts['$font-size-m']};
	width: 256px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	line-height: ${fonts['$line-height-m']};
`;
const RecipientEmail = styled.div`
	font-size: ${fonts['$font-size-s']};
	color: ${(props) =>
		props.highlighted ? `${colors['$color-white-hex']}` : `${colors['$color-black-hex-64']}`};
	width: 256px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	line-height: ${fonts['$line-height-s']};
`;

const FoundRecipients = ({
	getMenuProps,
	isOpen,
	searchResults,
	getItemProps,
	highlightedIndex
}) => (
	<SearchResultsDropdown {...getMenuProps()}>
		{isOpen &&
			searchResults &&
			searchResults.map((item, index) => {
				const highlighted = highlightedIndex === index;

				return (
					<SearchResult
						key={index}
						{...getItemProps({
							index,
							item,
							highlighted
						})}
					>
						<RecipientName>{item.name}</RecipientName>
						<RecipientEmail highlighted={highlighted}>
							{get(item, 'emails[0]')}
						</RecipientEmail>
					</SearchResult>
				);
			})}
	</SearchResultsDropdown>
);

const SearchResults = (props) => {
	const translator = useTranslator();

	if (props.noResults) {
		return (
			<NoSearchResults {...props.getMenuProps()}>
				{translator.gettext('No match found')}
			</NoSearchResults>
		);
	} else if (props.hasResults) {
		return <FoundRecipients {...props} />;
	} else {
		return null;
	}
};

FoundRecipients.propTypes = {
	getMenuProps: PropTypes.func,
	isOpen: PropTypes.bool,
	searchResults: PropTypes.object,
	getItemProps: PropTypes.func,
	highlightedIndex: PropTypes.number
};

export default SearchResults;
