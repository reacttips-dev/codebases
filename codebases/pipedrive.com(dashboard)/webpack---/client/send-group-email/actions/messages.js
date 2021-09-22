import { fetchPersons, fetchDealPersons, fetchActivityPersons, fetchPerson } from '../api/messages';
import { validateEmailsRequest } from '../api/emails';

export const validateEmails = (messages) => async (dispatch, state) => {
	const { validatedEmails } = state;
	const emails = messages
		.filter(({ email }) => !validatedEmails.hasOwnProperty(email))
		.map(({ email }) => email);

	if (!emails.length) {
		return;
	}

	const newValidatedEmails = await validateEmailsRequest(emails);

	dispatch({ type: 'VALIDATE_EMAILS', validatedEmails: newValidatedEmails });
};

export const addNewPerson = (id, userSelf) => async (dispatch) => {
	const [message, relatedObjects] = await fetchPerson(id, userSelf);

	dispatch({
		type: 'ADD_MESSAGES',
		messages: [message],
		relatedObjects
	});

	dispatch(validateEmails([message]));
};

export const fetchDataAndGenerateMessages = (viewType, selection, sort, API) => async (
	dispatch
) => {
	let messages, relatedObjects;

	if (viewType === 'person') {
		[messages, relatedObjects] = await fetchPersons(selection, sort, API);
	} else if (viewType === 'deal') {
		[messages, relatedObjects] = await fetchDealPersons(selection, sort, API);
	} else {
		[messages, relatedObjects] = await fetchActivityPersons(selection, sort, API);
	}

	dispatch({
		type: 'SET_MESSAGES',
		messages,
		relatedObjects
	});

	dispatch(validateEmails(messages));
};
