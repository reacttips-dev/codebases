import apolloClient from './client';

export function query(...args) {
	return apolloClient.query(...args).then((response) => {
		// https://github.com/apollographql/apollo-client/blob/7f502071bab53622c636f34ac02823d5a8a40e24/packages/apollo-client/src/core/networkStatus.ts#L40
		const networkIsOk = response.networkStatus === 7;
		const responseErrors = response?.errors?.length;
		const containsErrors = responseErrors || !networkIsOk;

		response.success = networkIsOk;

		if (containsErrors) {
			const errorMessages = [];

			if (!networkIsOk) errorMessages.push('Network error.');

			if (responseErrors) errorMessages.push('Response contains errors.');

			response.errorMeta = {
				type: 'GraphQL',
				message: errorMessages.join(' ')
			};
		}

		return response;
	});
}
