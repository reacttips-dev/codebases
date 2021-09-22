import { get, isEqualWith, isEqual, intersection } from 'lodash';
import * as Immutable from 'immutable';

const fieldsToSendUpdatesOnChange = [
	'subject',
	'publicDescription',
	'dueDate',
	'dueTime',
	'duration',
	'attendees',
	'location',
];
const equalityFunctions = {
	attendees: (first, second) => {
		const emailsFirst = (first || [])
			.map(({ email_address: email }) => email)
			.sort()
			.join('');
		const emailsSecond = (second || [])
			.map(({ email_address: email }) => email)
			.sort()
			.join('');

		return emailsFirst === emailsSecond;
	},
	subject: (first, second) => {
		first = first && first.trim();
		second = second && second.trim();

		return isEqual(first, second);
	},
};

const calculateShouldSendUpdatesToAttendees = (previousShape, newFieldsSet) => {
	if (!previousShape) {
		return false;
	}

	const changedFields = intersection(fieldsToSendUpdatesOnChange, Object.keys(newFieldsSet));

	if (!changedFields.length) {
		return false;
	}

	return !!changedFields.find((field) => {
		const first = previousShape[field];
		const second = newFieldsSet[field];

		if (equalityFunctions[field]) {
			return !isEqualWith(first, second, equalityFunctions[field]);
		}

		return !isEqual(first, second);
	});
};

export const withSendFieldUpdatesSideEffect = (newState, newFieldsSet) => {
	const newActivity = newState.get('activityId', -1) < 0;
	const hasAttendees = !newState.get('attendees', new Immutable.List()).isEmpty();

	if (newActivity) {
		return newState.set('shouldSendUpdatesToAttendees', hasAttendees);
	}

	const hadAttendees = (get(newState.get('previousShape'), 'attendees', []) || []).length > 0;

	if (!hasAttendees && !hadAttendees) {
		return newState.set('shouldSendUpdatesToAttendees', false);
	}

	return newState.set(
		'shouldSendUpdatesToAttendees',
		calculateShouldSendUpdatesToAttendees(newState.get('previousShape'), newFieldsSet),
	);
};
