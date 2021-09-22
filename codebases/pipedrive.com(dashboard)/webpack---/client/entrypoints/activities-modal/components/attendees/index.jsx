import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';

import modalContext from '../../../../utils/context';
import AttendeesField from './attendees-field';
import { sortAttendees } from '../../../../utils/attendees';
import { isValidAttendee } from './helpers';

const Attendees = ({
	participants,
	deal,
	organization,
	showStatus,
	attendees,
	onChange,
	autoFocus,
	onBlur,
	setError,
	translator,
}) => {
	const [selectedAttendees, setSelected] = useState(sortAttendees(attendees || []));
	const setSelectedAttendees = (selectedAttendees) => {
		setSelected(selectedAttendees);
		onChange && onChange(selectedAttendees);
	};

	const addAttendee = (attendee) => {
		const updatedAttendees = [...selectedAttendees, attendee];

		if (!isValidAttendee(attendee, selectedAttendees)) {
			setError('attendees', true);
		}

		setSelectedAttendees(updatedAttendees);
	};

	const removeAttendee = (attendeeToRemove) => {
		const remainingAttendees = selectedAttendees.filter(
			(attendee) => attendee !== attendeeToRemove,
		);
		const hasInvalidAttendees = remainingAttendees.find(
			(attendee) => !isValidAttendee(attendee, remainingAttendees),
		);

		if (!hasInvalidAttendees) {
			setError('attendees', false);
		}

		setSelectedAttendees(remainingAttendees);
	};

	const removeLastAttendee = () => {
		const lastAttendee =
			selectedAttendees.length > 0 ? selectedAttendees[selectedAttendees.length - 1] : null;

		if (lastAttendee) {
			removeAttendee(lastAttendee);
		}
	};

	const onAddContact = (oldAttendee, contact) => {
		const newAttendees = selectedAttendees.map((attendee) => {
			if (attendee === oldAttendee) {
				return { ...attendee, person_id: contact.id, name: contact.name };
			}

			return attendee;
		});

		setSelectedAttendees(newAttendees);
	};

	return (
		<Downshift
			onChange={(attendee) => addAttendee({ ...attendee, isNew: true })}
			defaultHighlightedIndex={0}
			itemToString={() => ''}
		>
			{(downshiftProps) => {
				const { rootRef, ...restRootProps } = downshiftProps.getRootProps({
					refKey: 'rootRef',
				});

				return (
					<AttendeesField
						ref={rootRef}
						{...restRootProps}
						downshiftProps={downshiftProps}
						participants={participants}
						deal={deal}
						organization={organization}
						attendees={selectedAttendees}
						addAttendee={addAttendee}
						removeAttendee={removeAttendee}
						removeLastAttendee={removeLastAttendee}
						showStatus={showStatus}
						onAddContact={onAddContact}
						autoFocus={autoFocus}
						onBlur={onBlur}
						translator={translator}
					/>
				);
			}}
		</Downshift>
	);
};

Attendees.propTypes = {
	participants: PropTypes.array,
	organization: PropTypes.object,
	deal: PropTypes.object,
	showStatus: PropTypes.bool,
	attendees: PropTypes.array,
	onChange: PropTypes.func,
	autoFocus: PropTypes.bool,
	onBlur: PropTypes.func,
	setError: PropTypes.func,
	translator: PropTypes.object.isRequired,
};

export default modalContext(Attendees);
