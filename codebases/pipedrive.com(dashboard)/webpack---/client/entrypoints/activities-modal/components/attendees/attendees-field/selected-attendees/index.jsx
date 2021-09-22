import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { findAttendeeWithSameEmail, getAttendeeTagKey, isValidEmail } from '../../helpers';
import Attendee from './attendee-tag';

const AttendeesWrapper = styled.div`
	display: grid;
	grid-template-columns: auto;
	justify-items: start;
	grid-row-gap: 4px;
	margin: 4px 7px 0 7px;
`;

const SelectedAttendees = ({ attendees, removeAttendee, showStatus, onAddContact }, ref) => {
	if (attendees.length === 0) {
		return null;
	}

	return (
		<AttendeesWrapper ref={ref}>
			{attendees
				.filter((attendee) => !!attendee)
				.map((attendee) => {
					const duplicate = findAttendeeWithSameEmail(attendee, attendees);

					return (
						<Attendee
							key={getAttendeeTagKey(attendee)}
							attendee={attendee}
							duplicate={!!duplicate}
							invalidEmail={!isValidEmail(attendee.email_address)}
							removeAttendee={removeAttendee}
							showStatus={showStatus}
							onAddContact={onAddContact}
						/>
					);
				})}
		</AttendeesWrapper>
	);
};

SelectedAttendees.propTypes = {
	attendees: PropTypes.array.isRequired,
	removeAttendee: PropTypes.func.isRequired,
	showStatus: PropTypes.bool,
	onAddContact: PropTypes.func,
};

export default React.forwardRef(SelectedAttendees);
