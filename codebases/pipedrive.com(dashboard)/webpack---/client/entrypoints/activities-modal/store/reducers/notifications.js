import { fromJS } from 'immutable';

export const initialState = fromJS({
	notificationLanguageId: null,
	hasParticipantWithoutEmail: false,
});

const participantWithoutEmail = (participant) => {
	return !fromJS(participant).get('email');
};

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'SET_NOTIFICATIONS_LANGUAGE':
			return state.set('notificationLanguageId', action.languageId);
		case 'FIELD_UPDATE': {
			if (action.field === 'participants') {
				return state.set(
					'hasParticipantWithoutEmail',
					action.value.some(participantWithoutEmail),
				);
			}

			return state;
		}
		case 'UPDATE_MULTIPLE_FIELDS': {
			if (action.fields.hasOwnProperty('participants')) {
				return state.set(
					'hasParticipantWithoutEmail',
					action.fields.participants.some(participantWithoutEmail),
				);
			}

			return state;
		}
		default:
			return state;
	}
};
