import { fromJS } from 'immutable';

const getStatusValue = (status) => {
	switch (status) {
		case 'yes':
			return 1;
		case 'maybe':
			return 2;
		case 'no':
			return 3;
		default:
			return 4;
	}
};

const attendeeComparator = (attendee1, attendee2) => {
	if (!attendee1) {
		return 1;
	}

	if (!attendee2) {
		return -1;
	}

	if (attendee1.is_organizer) {
		return -1;
	}

	if (attendee2.is_organizer) {
		return 1;
	}

	const statusComparison = getStatusValue(attendee1.status) - getStatusValue(attendee2.status);

	if (statusComparison !== 0) {
		return statusComparison;
	}

	const attendee1Name = (attendee1.name || attendee1.email_address || '').toLowerCase();
	const attendee2Name = (attendee2.name || attendee2.email_address || '').toLowerCase();

	return attendee1Name.localeCompare(attendee2Name);
};

export const sortAttendees = (attendees) => {
	if (attendees.toJS) {
		const unsortedAttendees = attendees.toJS();
		const sortedAttendees = unsortedAttendees.sort(attendeeComparator);

		return fromJS(sortedAttendees);
	}

	return attendees.sort(attendeeComparator);
};

export const getRSVPIcon = (status, translator) => {
	switch (status) {
		case 'yes':
			return {
				icon: 'check-circle',
				color: 'green',
				title: translator.gettext('Yes'),
			};
		case 'no':
			return {
				icon: 'cross-circle',
				color: 'red',
				title: translator.gettext('No'),
			};
		case 'maybe':
			return {
				icon: 'help',
				color: 'yellow',
				title: translator.gettext('Maybe'),
			};
		default:
			return {
				icon: 'help-outline',
				color: 'black-32',
				title: translator.gettext('Pending'),
			};
	}
};
