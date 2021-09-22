import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { onError } from '@apollo/link-error';
import Logger from '@pipedrive/logger-fe';
import Cookies from 'js-cookie';

const logger = new Logger('graphql-client');

const httpLinkOptions = {
	uri: '/graphql',
	fetch: (url, ...args) => fetch(appendSessionToken(url), ...args),
	credentials: 'same-origin'
};

const httpLink = new HttpLink(httpLinkOptions);
const batchLink = new BatchHttpLink({
	...httpLinkOptions,
	headers: { graph_batch: 'true' },
	batchMax: 5
});

const errorHandleLink = onError(({ graphQLErrors, networkError, operation }) => {
	const { operationName } = operation;

	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, extensions, ...error }) => {
			const serviceName = extensions?.serviceName ?? 'webapp';

			logger.error(`[${serviceName}:${operationName}] ${message}`, { extensions, ...error });
		});
	}

	if (networkError) {
		logger.error(`[${operationName}] Network Error. ${networkError}`);
	}
});

const link = createPersistedQueryLink()
	.concat(errorHandleLink)
	.concat(split((operation) => operation.getContext().important === true, httpLink, batchLink));

const apolloClient = new ApolloClient({
	name: 'webapp',
	version: app.config.build,
	link,
	cache: new InMemoryCache({
		typePolicies: getCacheTypePolicies()
	}),
	defaultOptions: {
		watchQuery: {
			errorPolicy: 'all'
		},
		query: {
			errorPolicy: 'all'
		},
		mutate: {
			errorPolicy: 'all'
		}
	}
});

export default apolloClient;

function appendSessionToken(url) {
	return `${url}${url.includes('?') ? '&' : '?'}session_token=${Cookies.get(
		'pipe-session-token'
	)}`;
}

function getCacheTypePolicies() {
	return {
		// id might be null, invalid results will be returned from cache
		CustomView: { keyFields: false },
		Field: { keyFields: false },
		FieldOptions: { keyFields: false }
	};
}
