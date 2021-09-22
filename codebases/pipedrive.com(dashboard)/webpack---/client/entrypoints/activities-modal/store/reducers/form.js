import Immutable, { fromJS } from 'immutable';
import moment from 'moment';

import { DEFAULT_LOCALE } from '../../../../config/constants';
import { transformFieldValue } from './util/field-transformers';
import { withSendFieldUpdatesSideEffect } from './util/fields-changes';

export const initialState = fromJS({
	subject: '',
	publicDescription: null,
	note: null,
	dueDate: `${moment().locale(DEFAULT_LOCALE).format('YYYY-MM-DD')}`,
	dueTime: '',
	duration: '',
	type: '',
	busyFlag: null,
	assignedToUserId: null,
	activeField: '',
	activityId: null,
	participants: [],
	attendees: [],
	deal: null,
	lead: null,
	project: null,
	done: false,
	organization: null,
	userId: null,
	location: null,
	sendActivityNotifications: false,
	errors: new Immutable.Set(),
	previousShape: null,
	shouldSendUpdatesToAttendees: false,
	conferenceMeetingUrl: null,
	conferenceMeetingClient: null,
	conferenceMeetingId: null,
	conferenceMeetingUrlError: null,
	callLogId: null,
	recordingUrl: null,
});

const setFieldError = (state, action) => {
	const hasError = state.get('errors').has(action.field);

	if (action.hasError === hasError) {
		return state;
	}

	return action.hasError
		? state.set('errors', state.get('errors').add(action.field))
		: state.set('errors', state.get('errors').delete(action.field));
};

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'FIELD_UPDATE':
			return withSendFieldUpdatesSideEffect(
				state.set(action.field, fromJS(transformFieldValue(action.field, action.value))),
				{ [action.field]: action.value },
			);
		case 'UPDATE_MULTIPLE_FIELDS':
			return withSendFieldUpdatesSideEffect(
				state.withMutations((state2) =>
					Object.keys(action.fields).reduce(
						(accumulator, field) =>
							accumulator.set(
								field,
								fromJS(transformFieldValue(field, action.fields[field])),
							),
						state2,
					),
				),
				action.fields,
			);
		case 'SET_FIELD_ERROR':
			return setFieldError(state, action);
		case 'SET_CONFERENCE_MEETING_URL_ERROR':
			return state.set('conferenceMeetingUrlError', action.error);
		case 'CLEAR_FIELD_ERRORS':
			return state.set('errors', new Immutable.Set());
		case 'CLEAR_SPECIFIC_FIELD_ERRORS':
			return state.set(
				'errors',
				action.fields.reduce(
					(accumulator, field) => accumulator.delete(field),
					state.get('errors'),
				),
			);
		case 'ACTIVITY_LOAD_START':
			return state.set('activityId', action.activityId);
		case 'SET_PREVIOUS_ACTIVITY_SHAPE':
			return state.set('previousShape', action.fields);
		case 'CLEAR_ALL':
			return initialState;
		default:
			return state;
	}
};
