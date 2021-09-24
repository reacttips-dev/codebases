const log = require('debug')('ssr');
import React from 'react';
import {ApolloProvider} from 'react-apollo';
import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {from} from 'apollo-link';
import {onError} from 'apollo-link-error';
import {ApolloClient} from 'apollo-client';
import {setContext} from 'apollo-link-context';
import {createHttpLink} from 'apollo-link-http';
import logger from './link-logger';
import introspectionQueryResultData from '../fragment-types.json';

export default (element, stateId, ctx) => {
  const token = document.querySelector('meta[name=csrf-token]').getAttribute('content');

  const http = createHttpLink({
    uri: process.env.GRAPHQL_URL || '/graphql',
    credentials: 'include'
  });

  const auth = setContext((_, {headers}) => {
    return {
      headers: {
        ...headers,
        'X-CSRF-Token': token
      }
    };
  });

  const fragmentMatcher = new IntrospectionFragmentMatcher({introspectionQueryResultData});

  const cache = new InMemoryCache({fragmentMatcher});
  cache.writeData({data: ctx.defaults});

  if (stateId) {
    const statePayload = document.getElementById(stateId);
    if (statePayload) {
      log(`Restoring cache...`);
      cache.restore(JSON.parse(statePayload.innerHTML));
    } else {
      log(`Cache payload "${stateId}" not found!`);
    }
  }

  const errors = onError(({networkError, response}) => {
    if (networkError) {
      log('GraphQL Network Error: %s', networkError);
    }
    if (response && response.errors) {
      response.errors.forEach(({message}) => log('GraphQL Response Error: %s', message));
    }
  });

  const client = new ApolloClient({
    link: from([auth, errors, ...ctx.middleware, logger, http]),
    cache,
    resolvers: ctx.resolvers
  });

  return <ApolloProvider client={client}>{element}</ApolloProvider>;
};
