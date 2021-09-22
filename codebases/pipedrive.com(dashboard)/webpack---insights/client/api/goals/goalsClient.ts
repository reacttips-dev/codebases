import { ApolloClient, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RestLink } from 'apollo-link-rest';

import { getShareHash, isPublicPage } from '../../utils/helpers';
import { getLogger } from '../webapp';
import { GoalsApiCache } from './goalsCache';
import {
	getTransformedGoal,
	getTransformedGoals,
} from './responseTransformers';

const GOALS_API_ENDPOINT = isPublicPage()
	? '/insights-public-gateway/api/v1/goals'
	: '/api/v1/goals';

const headers = isPublicPage()
	? {
			headers: {
				'insights-public-hash': getShareHash(),
			},
	  }
	: {};

export const GoalsErrorLink = onError(({ networkError }) => {
	if (networkError) {
		getLogger().remote('error', `Network Error: ${networkError.message}`);
	}
});

export const GoalsRestLink = new RestLink({
	uri: GOALS_API_ENDPOINT,
	responseTransformer: async (response: Response) => {
		try {
			const responseBody = await response.json();
			const responseData = responseBody?.data;

			if (responseData?.goals) {
				return getTransformedGoals(responseData.goals);
			}

			if (responseData?.goal) {
				return getTransformedGoal(responseData.goal);
			}

			return responseData;
		} catch (error) {
			getLogger().remote(
				'error',
				`Could not get goals data: ${error.message}`,
			);
		}

		throw new Error('Could not get goals data');
	},
	...headers,
});

export const GoalsApiClient = new ApolloClient({
	cache: GoalsApiCache,
	link: ApolloLink.from([GoalsErrorLink, GoalsRestLink]),
});
