/**
 * Each message in this array will have this stucture
 * {
 * 	name: 'Persons name',
 * 	email: 'Persons primary email',
 * 	person: {
 * 		// Full person object related to this message. Required
 * 	},
 * 	deal: {
 * 		// Full deal object related to this message.
 * 	},
 * 	organization: {
 * 		// Full organization object related to this message.
 * 	},
 * 	activity: {
 * 		// Full activity object related to this message.
 * 	}
 * }
 *
 * For each message an email will be sent out so this means that a single person can receive more than one email.
 */

export default (state = [], action) => {
	switch (
		action.type // NOSONAR
	) {
		case 'SET_MESSAGES':
			return action.messages;
		case 'REMOVE_RECIPIENT':
			return state.filter((message) => message.person.id !== action.id);
		case 'ADD_MESSAGES':
			return [...state, ...action.messages];
		case 'RESET':
			return [];
	}

	return state;
};
