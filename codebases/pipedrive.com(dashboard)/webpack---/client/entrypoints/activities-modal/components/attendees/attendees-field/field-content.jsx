import React, { createRef, useState } from 'react';
import styled from 'styled-components';

import colors from '../../../colors.scss';
import SelectedAttendees from './selected-attendees';
import AttendeesInput from '../attendees-input';
import { getSearchResultsAsAttendees } from '../helpers';
import { findPerson } from '../../../../../api';
import PropTypes from 'prop-types';

const FieldWrapper = styled.div`
	border-radius: 2px;
	box-shadow: inset 0 1px 2px 0 ${colors.attendeesFieldShadow};
	border: 1px solid
		${(props) =>
			props.focused ? colors.attendeesFieldFocusBorder : colors.attendeesFieldBorder};
	background-color: #fff;
	max-height: 264px;
	box-sizing: border-box;
	overflow-y: auto;
`;

const fieldContent = ({
	visible,
	fieldRef,
	attendees,
	removeAttendee,
	showStatus,
	onAddContact,
	setVisible,
	searchResults,
	removeLastAttendee,
	autoFocus,
	setSearchResults,
	addAttendee,
	onBlur,
	downshiftProps,
}) => {
	const { setState: setDownshiftState, inputValue, getInputProps } = downshiftProps;
	const [loading, setLoading] = useState(false);

	const selectedAttendeesRef = createRef();
	const inputRef = createRef();

	const onInputBlur = (e, shouldCollapse = true) => {
		setVisible(false);
		shouldCollapse && onBlur(e);
	};
	const focusTheField = (e) => {
		const clickedOnEmptySpace = e.target === selectedAttendeesRef.current;

		!visible &&
			clickedOnEmptySpace &&
			inputRef.current &&
			inputRef.current.querySelector('input').focus();
	};
	const addAttendeeAndClearInput = (attendee) => {
		addAttendee(attendee);
		setDownshiftState({ inputValue: '' });
	};

	const fetchSearchResults = async (inputValue) => {
		setLoading(true);

		try {
			const data = await findPerson(inputValue);
			const searchResults = getSearchResultsAsAttendees(data, attendees);

			setSearchResults(searchResults);
		} catch (e) {
			setSearchResults([]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<FieldWrapper focused={visible} onClick={focusTheField} ref={fieldRef}>
			<SelectedAttendees
				ref={selectedAttendeesRef}
				attendees={attendees}
				removeAttendee={removeAttendee}
				showStatus={showStatus}
				onAddContact={onAddContact}
			/>
			<AttendeesInput
				inputProps={getInputProps()}
				onFocus={() => setVisible(true)}
				onBlur={onInputBlur}
				addOnEnter={!!inputValue && searchResults.length === 0}
				addAttendee={addAttendeeAndClearInput}
				removeLastAttendee={removeLastAttendee}
				loading={loading}
				fetchSearchResults={fetchSearchResults}
				inputRef={inputRef}
				autoFocus={autoFocus}
			/>
		</FieldWrapper>
	);
};

fieldContent.propTypes = {
	visible: PropTypes.bool,
	fieldRef: PropTypes.object,
	attendees: PropTypes.array,
	removeAttendee: PropTypes.func.isRequired,
	showStatus: PropTypes.bool,
	downshiftProps: PropTypes.object.isRequired,
	recommendations: PropTypes.array,
	searchResults: PropTypes.array,
	addAttendee: PropTypes.func.isRequired,
	removeLastAttendee: PropTypes.func.isRequired,
	onAddContact: PropTypes.func,
	autoFocus: PropTypes.bool,
	onBlur: PropTypes.func,
	setVisible: PropTypes.func,
	setSearchResults: PropTypes.func,
};

export default fieldContent;
