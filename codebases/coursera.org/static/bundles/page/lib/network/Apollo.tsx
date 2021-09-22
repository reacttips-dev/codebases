import React from 'react';

import language from 'js/lib/language';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { createHttpLink } from 'apollo-link-http';
import type { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHybridLink } from '@coursera/graphql-utils';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import NaptimeLink from '@coursera/apollo-link-naptime';
import Cookie from 'js/lib/cookie';
import URI from 'jsuri';
import AuthRedirectLink from 'bundles/page/lib/network/AuthRedirectLink';

import { spaces } from 'bundles/cms/utils/SpaceUtils';

import fragmentMatcher from './fragmentMatcher';

/**
 * We're encapsulating this module so that these module dependencies (which only exist in node_modules)
 * can be stubbed out when executed in RequireJS.
 * You must use Webpack in order to utilize the ApolloClient.
 */

declare const COURSERA_APP_NAME: string;
declare const COURSERA_APP_VERSION: string;
declare global {
  interface Window {
    __APOLLO_STATE__: NormalizedCacheObject;
  }
}

const operationNameHeader = 'OPERATION-NAME';

type PatchedRequestInit = Omit<RequestInit, 'headers'> & { headers: Record<string, string> };

// This custom fetch and the following middleware append the operation name
// as a query parameter, mainly for visibility in edge access logs.
const fetchWithOperationName = (uri: string, options: PatchedRequestInit) => {
  const operationName = options.headers[operationNameHeader];
  const uriWithOpName = new URI(uri).addQueryParam('opname', operationName).toString();
  return fetch(uriWithOpName, options);
};

const operationNameMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'accept-language': language.getIetfLanguageTag(),
      //  A string name of the query if it is named, otherwise it is null. e.g. MembershipsQuery
      [operationNameHeader]: operation.operationName,
    },
  }));
  return forward ? forward(operation) : null;
});

/**
 * Add the CSRF3 token to a graphql request if it appears to need the token.
 */
const csrf3TokenMiddleware = new ApolloLink((operation, forward) => {
  const csrf3Token = Cookie.get('CSRF3-Token');
  if (csrf3Token) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'X-CSRF3-Token': csrf3Token,
      },
    }));
  }
  return forward ? forward(operation) : null;
});

export const createApolloClient = (initialApolloState?: { [key: string]: any }): ApolloClient<{}> => {
  const graphqlLink = createHybridLink({
    singleOptions: {
      uri: '/graphql',
      credentials: 'same-origin',
      headers: {
        'R2-APP-VERSION': COURSERA_APP_VERSION,
        'X-Coursera-Application': COURSERA_APP_NAME,
        'X-Coursera-Version': COURSERA_APP_VERSION,
      },
      fetch: fetchWithOperationName,
    },
    batchOptions: {
      uri: '/graphqlBatch',
      credentials: 'same-origin',
      headers: {
        'R2-APP-VERSION': COURSERA_APP_VERSION,
        'X-Coursera-Application': COURSERA_APP_NAME,
        'X-Coursera-Version': COURSERA_APP_VERSION,
      },
      fetch: fetchWithOperationName,
    },
  });

  const naptimeLink = new NaptimeLink({
    uri: '/api/',
    credentials: 'same-origin',
  });

  const presentationLayerLink = ApolloLink.from([
    createPersistedQueryLink(),
    createHttpLink({
      uri: '/presentation/graphql',
      headers: {
        Accept: 'application/json',
        'apollographql-client-name': COURSERA_APP_NAME,
        'apollographql-client-version': COURSERA_APP_VERSION,
      },
    }),
  ]);

  const enterpriseUserLayerLink = createHttpLink({
    uri: '/dgs/enterprise-user-application/graphql',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
    },
    fetch: fetchWithOperationName,
  });

  const discoveryCollectionsLink = createHttpLink({
    uri: '/dgs/disco-collections-application/graphql',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
    },
    fetch: fetchWithOperationName,
  });

  const CONTENTFUL_BASE_URL = 'https://graphql.contentful.com/content/v1/spaces/';

  const contentfulContentSpaceLink = createHttpLink({
    uri: `${CONTENTFUL_BASE_URL}${spaces.CONTENT.SPACE_ID}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${spaces.CONTENT.DELIVERY_ACCESS_TOKEN}`,
    },
  });

  const contentfulContentSpacePreviewLink = createHttpLink({
    uri: `${CONTENTFUL_BASE_URL}${spaces.CONTENT.SPACE_ID}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${spaces.CONTENT.PREVIEW_ACCESS_TOKEN}`,
    },
  });

  const cache = new InMemoryCache({ fragmentMatcher });

  // Middleware used with presentation layer and default graphql links
  const linkMiddleware = ApolloLink.from([csrf3TokenMiddleware, operationNameMiddleware]);

  // Make sure the key in this object is the same as the context you pass in
  // the GraphQL query
  const defaultLink = ApolloLink.from([linkMiddleware, AuthRedirectLink, naptimeLink, graphqlLink]);
  const allLinks: Record<string, ApolloLink | undefined> = {
    default: defaultLink,
    experimental: ApolloLink.from([linkMiddleware, presentationLayerLink]),
    contentfulGql: contentfulContentSpaceLink,
    contentfulPreviewGql: contentfulContentSpacePreviewLink,
    enterpriseUserGql: enterpriseUserLayerLink,
    discoveryCollectionsGql: discoveryCollectionsLink,
  };

  // Needed to send the GraphQL request to the respective URL
  const linkFromOperation = new ApolloLink((operation, forward) => {
    const { clientName } = operation.getContext();
    const linkToUse = allLinks[clientName] || defaultLink;
    return linkToUse.request(operation, forward);
  });

  return new ApolloClient({
    // In nextjs we pass server fetched data here directly.
    cache: cache.restore(initialApolloState || window.__APOLLO_STATE__),
    connectToDevTools: true,
    link: linkFromOperation,
  });
};

export const provideApolloContext = (apolloClient: ApolloClient<{}>, type: React.ComponentClass<{}>) => {
  return function ApolloClientProvider() {
    return <ApolloProvider client={apolloClient}>{React.createElement(type)}</ApolloProvider>;
  };
};
