import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { makeGraphRequest } from 'owa-ows-gateway';

const customFetch = (uri, options) => {
    return makeGraphRequest('/outlookgatewayb2/graphql', options.body);
};

export const remoteGraphLink = () => new BatchHttpLink({ fetch: customFetch });
