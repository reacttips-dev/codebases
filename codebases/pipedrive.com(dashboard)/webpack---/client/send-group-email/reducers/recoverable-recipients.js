export default (state = [], action) => {
	switch (
		action.type // NOSONAR
	) {
		case 'REMOVE_RECIPIENT':
			return [...state, action.recoverableRecipient];
		case 'REMOVE_RECOVERABLE_RECIPIENT':
			return state.filter((recipient) => action.id !== recipient.id);
		case 'RESET':
			return [];
	}

	return state;
};
