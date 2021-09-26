import { camelCase } from 'lodash';
import initialState from './helpers/activity-initial-state';

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'FIELD_UPDATE':
			return state.set(action.field, action.value);
		case 'UPDATE_ATTENDEE': {
			const attendeesList = state.get('attendees');
			const attendeeIndex = attendeesList.findIndex(
				(attendee) => attendee.get('email_address') === action.email,
			);

			if (attendeeIndex === -1) {
				return state;
			}

			const attendeeToUpdate = attendeesList.get(attendeeIndex);

			return state.set(
				'attendees',
				attendeesList.set(
					attendeeIndex,
					attendeeToUpdate.set('person_id', action.personId),
				),
			);
		}
		case 'SET_ACTIVITY':
			return state.withMutations((mutatingState) =>
				[...action.activity.keys()].reduce(
					(accumulator, field) =>
						accumulator.set(camelCase(field), action.activity.get(field)),
					mutatingState,
				),
			);
		case 'SET_CONFERENCE_MEETING_INTEGRATION_INSTALLED':
			return state.set('isConferenceMeetingIntegrationInstalled', action.value);
		case 'SET_HAS_ACTIVE_CALENDAR_SYNC':
			return state.set('hasActiveCalendarSync', action.hasActiveCalendarSync);
		case 'SET_CALL_LOG_ID':
			return state.set('callLogId', action.callLogId);
		case 'SET_RECORDING_URL':
			return state.set('recordingUrl', action.recordingUrl);
		case 'CLEAR_STATE':
			return initialState;
		default:
			return state;
	}
};
