export const removeRecipient = (id, name) => (dispatch, state) => {
	dispatch({
		type: 'REMOVE_RECIPIENT',
		id,
		recoverableRecipient: {
			id,
			name,
			messages: state.messages.filter((to) => to.person.id === id)
		}
	});
};

export const removeRecoverableRecipient = (id) => ({
	type: 'REMOVE_RECOVERABLE_RECIPIENT',
	id
});

export const restoreRecoverableRecipient = (id) => (dispatch, state) => {
	const recoverableRecipient = state.recoverableRecipients.find(
		(recoverableRecipient) => recoverableRecipient.id === id
	);

	if (recoverableRecipient) {
		dispatch({
			type: 'ADD_MESSAGES',
			messages: recoverableRecipient.messages
		});

		dispatch(removeRecoverableRecipient(id));
	}
};
