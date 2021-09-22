import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Dropmenu } from '@pipedrive/convention-ui-react';

import DropDownContent from './dropdown-content';
import FieldContent from './field-content';
import {
	useScrollToBottomEffect,
	useUniqueRecommendationsEffect,
	useRecommendedPeopleEffect,
} from '../helpers';

const AttendeesFieldWrapper = styled.div`
	grid-column: 2;
	position: relative;
	max-width: 100%;

	.cui4-popover:not(.hovercard) {
		width: 100%;

		.cui4-popover__inner {
			width: 100%;
		}
	}
`;

const shouldShowDropDown = ({ inputValue, recommendations, searchResults }) => {
	const hasSearchResults = searchResults && searchResults.length > 0;
	const shouldShowSearchResults = inputValue && inputValue.length > 1 && hasSearchResults;
	const hasRecommendations = recommendations && recommendations.length > 0;

	return shouldShowSearchResults || hasRecommendations;
};

const AttendeesField = (
	{
		downshiftProps,
		participants,
		deal,
		organization,
		attendees,
		addAttendee,
		removeAttendee,
		removeLastAttendee,
		showStatus,
		onAddContact,
		autoFocus,
		onBlur,
		translator,
	},
	ref,
) => {
	const { getMenuProps, inputValue, selectedItem } = downshiftProps;
	const [visible, setVisible] = useState(false);
	const [searchResults, setSearchResults] = useState([]);
	const fieldRef = createRef();

	useScrollToBottomEffect(visible, fieldRef, attendees);
	useEffect(() => {
		setSearchResults([]);
	}, [selectedItem]);

	const [recommendations, setRecommendations] = useState([]);
	const [recommendedParticipants, setRecommendedParticipants] = useState([]);
	const [recommendedOrgPeople, setRecommendedOrgPeople] = useState([]);
	const [recommendedDealPeople, setRecommendedDealPeople] = useState([]);

	useRecommendedPeopleEffect({
		relatedObjectType: 'participants',
		relatedObject: participants,
		setRecommendedPeople: setRecommendedParticipants,
		translator,
	});
	useRecommendedPeopleEffect({
		relatedObjectType: 'deal',
		relatedObject: deal,
		setRecommendedPeople: setRecommendedDealPeople,
		translator,
	});
	useRecommendedPeopleEffect({
		relatedObjectType: 'organization',
		relatedObject: organization,
		setRecommendedPeople: setRecommendedOrgPeople,
		translator,
	});
	useUniqueRecommendationsEffect({
		selectedAttendees: attendees,
		recommendedParticipants,
		recommendedDealPeople,
		recommendedOrgPeople,
		setRecommendations,
	});

	const dropDownHasContent =
		visible && shouldShowDropDown({ inputValue, recommendations, searchResults });

	return (
		<AttendeesFieldWrapper ref={ref}>
			<Dropmenu
				content={
					<DropDownContent
						recommendations={recommendations}
						searchResults={searchResults}
						downshiftProps={downshiftProps}
					/>
				}
				popoverProps={{
					toggleOnTriggerClick: false,
					visible: dropDownHasContent,
					placement: 'bottom-start',
				}}
				{...getMenuProps()}
			>
				<div>
					<FieldContent
						visible={visible}
						fieldRef={fieldRef}
						attendees={attendees}
						removeAttendee={removeAttendee}
						showStatus={showStatus}
						onAddContact={onAddContact}
						setVisible={setVisible}
						searchResults={searchResults}
						removeLastAttendee={removeLastAttendee}
						autoFocus={autoFocus}
						setSearchResults={setSearchResults}
						addAttendee={addAttendee}
						onBlur={onBlur}
						downshiftProps={downshiftProps}
					/>
				</div>
			</Dropmenu>
		</AttendeesFieldWrapper>
	);
};

AttendeesField.propTypes = {
	downshiftProps: PropTypes.object.isRequired,
	participants: PropTypes.array,
	organization: PropTypes.object,
	deal: PropTypes.object,
	attendees: PropTypes.array,
	addAttendee: PropTypes.func.isRequired,
	removeAttendee: PropTypes.func.isRequired,
	removeLastAttendee: PropTypes.func.isRequired,
	getSearchResults: PropTypes.func.isRequired,
	showStatus: PropTypes.bool,
	onAddContact: PropTypes.func,
	autoFocus: PropTypes.bool,
	onBlur: PropTypes.func,
	translator: PropTypes.object.isRequired,
};

export default React.forwardRef(AttendeesField);
