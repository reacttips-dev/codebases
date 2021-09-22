import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { get } from '@pipedrive/fetch';
import { Input, Dropmenu } from '@pipedrive/convention-ui-react';

import { APIContext, UsageTrackingContext } from 'shared/contexts';
import { mapSearchResult } from 'shared/helpers/search';
import { useTranslator } from 'utils/translator/translator-hook';
import useStore from '../../../store';
import { MAX_MESSAGES_PER_GROUP_EMAIL } from '../../../constants';
import { addNewPerson } from '../../../actions/messages';
import SearchResults from './search-results';

const SearchInput = styled(Input)`
	margin: 0 16px;
`;

const getFilteredSearchResults = (searchResults, recipientsIds) => {
	if (isEmpty(searchResults)) {
		return null;
	}

	const filteredSearchResults = searchResults
		// People with no email and people already in recipients list, are excluded from search results
		.filter(({ id, emails }) => !recipientsIds.includes(id) && emails && emails.length)
		// Show max 5 search results
		.slice(0, 5);

	if (!filteredSearchResults.length) {
		return null;
	}

	return filteredSearchResults;
};

const searchPeople = debounce(
	async (setIsSearching, setSearchResults, searchTerm, recipientsIds) => {
		// limit the response to 30 results as we only show 5 results but do some filtering in getFilteredSearchResults
		const url = `/v1/itemSearch?term=${searchTerm}&item_types=person&limit=30`;
		const searchResults = await get(url);
		const filteredSearchResults = getFilteredSearchResults(
			mapSearchResult(searchResults.data),
			recipientsIds
		);

		setIsSearching(false);
		setSearchResults(filteredSearchResults);
	},
	250
);

const AddRecipients = ({ recipientsIds, messagesCount }) => {
	const translator = useTranslator();
	const { actions } = useStore({ addNewPerson });
	const [searchResults, setSearchResults] = useState(null);
	const [isSearching, setIsSearching] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const { userSelf } = useContext(APIContext);
	const [isPopoverVisible, setPopoverVisibility] = useState(false);
	const usageTracking = useContext(UsageTrackingContext);

	const popoverProps = {
		popperProps: { modifiers: { flip: { enabled: false } } },
		visible: isPopoverVisible,
		toggleOnTriggerClick: false,
		onPopupVisibleChange: () => setPopoverVisibility(!isPopoverVisible)
	};

	useEffect(() => {
		if (!searchTerm || searchTerm.length <= 1) {
			setSearchResults(null);

			return;
		}

		setPopoverVisibility(true);
		setIsSearching(true);
		searchPeople(setIsSearching, setSearchResults, searchTerm, recipientsIds);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm]);

	return (
		<Downshift
			onChange={({ id }) => {
				setSearchTerm('');
				actions.addNewPerson(id, userSelf);

				usageTracking.sendMetrics('group_email_modal', 'interacted', {
					interaction: 'recipient_added'
				});
			}}
			itemToString={() => searchTerm}
			inputValue={searchTerm}
			defaultHighlightedIndex={0}
		>
			{({ getInputProps, getRootProps, getItemProps, getMenuProps, highlightedIndex }) => (
				<Dropmenu
					{...getRootProps({ popoverProps }, { suppressRefError: true })}
					content={
						<SearchResults
							getMenuProps={getMenuProps}
							isOpen={isPopoverVisible}
							searchResults={searchResults}
							getItemProps={getItemProps}
							highlightedIndex={highlightedIndex}
							noResults={
								isPopoverVisible &&
								!isSearching &&
								!searchResults &&
								searchTerm.length > 2
							}
							hasResults={isPopoverVisible && searchResults}
						/>
					}
				>
					<SearchInput
						{...getInputProps({
							placeholder: translator.gettext('Add recipients'),
							icon: 'search',
							loading: isSearching,
							allowClear: true,
							onChange: ({ target: { value } }) => setSearchTerm(value),
							autoComplete: 'off',
							disabled: messagesCount >= MAX_MESSAGES_PER_GROUP_EMAIL,
							onKeyDown: (event) => {
								if (event.key === 'Escape') {
									setSearchTerm('');
								}
							},
							onClick: (e) => e.stopPropagation()
						})}
					/>
				</Dropmenu>
			)}
		</Downshift>
	);
};

AddRecipients.propTypes = {
	recipientsIds: PropTypes.array.isRequired,
	messagesCount: PropTypes.number.isRequired
};

export default AddRecipients;
