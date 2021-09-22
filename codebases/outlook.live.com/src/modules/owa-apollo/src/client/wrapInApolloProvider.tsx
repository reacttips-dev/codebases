import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { getApolloClient } from './apolloClient';

export function wrapInApolloProvider(renderMainComponent: () => JSX.Element): () => JSX.Element {
    return () => (
        <ApolloProvider client={getApolloClient()}>{renderMainComponent()}</ApolloProvider>
    );
}
