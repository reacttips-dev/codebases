import { getOperationAST } from 'graphql';
import { ApolloLink } from '@apollo/client';
import type { OwaCachePolicyMap } from 'owa-lazy-cache-policy';
import { isFeatureEnabled } from 'owa-feature-flags';
import { request } from 'owa-apollo-policy-loader';
import { getApolloClient } from '../client/apolloClient';

export function cachePolicyLoaderLink(policies: OwaCachePolicyMap) {
    const link = new ApolloLink((operation, forward) => {
        const opNode = getOperationAST(operation?.query);

        if (
            !isFeatureEnabled('fwk-on-demand-cache-policies') ||
            !opNode ||
            opNode.operation === 'subscription'
        ) {
            return forward(operation);
        } else {
            return request(getApolloClient(), policies, operation, forward);
        }
    });

    return link;
}
