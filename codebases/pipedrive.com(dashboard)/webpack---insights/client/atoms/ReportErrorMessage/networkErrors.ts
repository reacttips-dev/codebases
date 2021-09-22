import { get } from 'lodash';

export const containsErrorWithCode = (error: any, code: string) => {
	const errors = get(error, 'networkError.result.errors', []);

	return !!errors.find(
		(error: any) => get(error, 'extensions.code') === code,
	);
};

export const containsGraphQLError = (error: any, text: string) => {
	const errors = get(error, 'graphQLErrors', []);

	return !!errors.find((error: any) =>
		get(error, 'message', '').includes(text),
	);
};
