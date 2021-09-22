export default (state = {}, action) => {
	switch (
		action.type // NOSONAR
	) {
		case 'VALIDATE_EMAILS': {
			const { validatedEmails } = action;

			return {
				...state,
				...validatedEmails
			};
		}
		default:
			return state;
	}
};
