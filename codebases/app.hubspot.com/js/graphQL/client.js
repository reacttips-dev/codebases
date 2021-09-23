'use es6';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { apiLink } from './hubHttpLink';
import possibleTypes from './possibleTypes.json';
export var createCache = function createCache() {
  return new InMemoryCache({
    possibleTypes: possibleTypes
  });
};
export var client = new ApolloClient({
  link: apiLink({
    uri: 'graphql/crm'
  }),
  cache: createCache()
});
export var fetch = function fetch(operation) {
  return client.query(operation);
};