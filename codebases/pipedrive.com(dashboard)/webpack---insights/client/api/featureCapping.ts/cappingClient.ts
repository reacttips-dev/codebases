import { ApolloClient, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RestLink } from 'apollo-link-rest';

import { getLogger } from '../webapp';
import { CappingApiCache } from './cappingCache';

const CAPPING_API_ENDPOINT = '/v1/usage-caps';

export const CappingErrorLink = onError(({ networkError }) => {
	if (networkError) {
		getLogger().remote('error', `Network Error: ${networkError.message}`);
	}
});

export const CappingRestLink = new RestLink({
	uri: CAPPING_API_ENDPOINT,
	responseTransformer: async (response: Response) => {
		try {
			const responseBody = await response.json();

			return responseBody.data;
		} catch (error) {
			getLogger().remote(
				'error',
				`Could not get feature capping data: ${error.message}`,
			);
		}

		throw new Error('Could not get feature capping data');
	},
});

export const CappingApiClient = new ApolloClient({
	cache: CappingApiCache,
	link: ApolloLink.from([CappingErrorLink, CappingRestLink]),
});
