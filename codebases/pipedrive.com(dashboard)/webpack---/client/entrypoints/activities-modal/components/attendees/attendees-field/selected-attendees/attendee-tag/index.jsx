import React from 'react';
import PropTypes from 'prop-types';

import { getNameFromEmail } from '../../../helpers';
import modalContext from '../../../../../../../utils/context';
import HoverCard from '../../../../../../../common-components/hover-card';
import AttendeeTag from './attendee-tag';

const getError = (invalidEmail, duplicate, translator) => {
	if (invalidEmail) {
		return translator.gettext(
			'Invalid address. Verify the email address before saving the activity.',
		);
	}

	if (duplicate) {
		return translator.gettext(
			'Duplicate address. Verify the email address before saving the activity.',
		);
	}

	return null;
};

const getHoverCardProps = (attendee, onAddContact) => {
	const { email_address: email, person_id: personId } = attendee;

	const personCardProps = { hoverCardProps: { type: 'person', id: personId } };
	const addNewPersonCardProps = {
		addNew: true,
		hoverCardProps: {
			type: 'addNewPerson',
			onAddContact: (contact) => onAddContact(attendee, contact),
			data: {
				name: name || getNameFromEmail(email),
				email,
			},
		},
	};

	return personId ? personCardProps : addNewPersonCardProps;
};

const Attendee = (props) => {
	const {
		translator,
		duplicate,
		invalidEmail,
		onAddContact,
		attendee,
		webappApi,
		removeAttendee,
		showStatus,
		logger,
	} = props;

	if (!attendee) {
		return null;
	}

	const error = getError(invalidEmail, duplicate, translator);
	const tagProps = { attendee, removeAttendee, showStatus, error };

	if (error) {
		return <AttendeeTag {...tagProps} />;
	}

	const hoverCardProps = getHoverCardProps(attendee, onAddContact);

	return (
		<HoverCard
			webappApi={webappApi}
			logger={logger}
			popoverProps={{ offset: '-l' }}
			{...hoverCardProps}
		>
			<AttendeeTag {...tagProps} />
		</HoverCard>
	);
};

Attendee.propTypes = {
	attendee: PropTypes.object.isRequired,
	duplicate: PropTypes.bool,
	invalidEmail: PropTypes.bool,
	removeAttendee: PropTypes.func.isRequired,
	showStatus: PropTypes.bool,
	onAddContact: PropTypes.func,
	webappApi: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
};

export default modalContext(Attendee);
