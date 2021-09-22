import type { ResolverContext, Resolvers } from 'owa-graph-schema';
import { ApolloClient, ApolloLink, InMemoryCache, FetchPolicy } from '@apollo/client';
import { onErrorLink } from '../links/onErrorLink';
import executeGraphLink from '../links/executeGraphLink';
import { localStateResolversLink } from '../links/localStateResolversLink';
import { remoteGraphLink } from '../links/remoteGraphLink';
import { localRemoteRouterLink } from '../links/localRemoteRouterLink';
import { cachePolicyLoaderLink } from '../links/cachePolicyLoaderLink';
import { possibleTypes } from 'owa-graph-schema-possible-types';
import { createBootPolicies } from '../typePolicies/bootTypePolicies';
import { merge } from 'lodash-es';
import { QueueOperationLink } from '../links/QueueOperationLink';
import { OwaCachePolicyMap } from 'owa-lazy-cache-policy';

// Not sure if we need this, but putting it in case its handy
const globalContext = {
    getSessionId: () => {
        throw new Error('getSessionId not set in context');
    },
};

export function createApolloClient({
    resolvers,
    localStateResolvers,
    createManagedQueryLink,
    cachePolicies,
    context,
}: {
    resolvers: Resolvers;
    localStateResolvers: Resolvers;
    createManagedQueryLink: (() => ApolloLink) | undefined;
    cachePolicies: OwaCachePolicyMap;
    context?: Partial<ResolverContext>;
}) {
    /**
     * For phase 1, where we intend to use GQL only for network layer abstraction
     * by default we are disabling the apollo cache as we would still rely on Mobx stores/caching.
     * For scenarios which wish to use Apollo caching either because
     * 1. They are new scenarios that intend to create new stores OR
     * 2. They are moving to phase 2 from 1 during this migration OR
     * 3. They are starting with phase 2 when enabling scenario over Hx
     *
     * should use override caching policy.
     */
    const noCacheFetchPolicy: FetchPolicy = 'no-cache';
    const defaultOptions = {
        watchQuery: {
            fetchPolicy: noCacheFetchPolicy,
        },
        query: {
            fetchPolicy: noCacheFetchPolicy,
        },
    };

    const mergedContext: Partial<ResolverContext> = {
        ...globalContext,
        ...context,
    };

    const managedQueryLink = createManagedQueryLink ? [createManagedQueryLink()] : [];
    const bootTypePolicies = createBootPolicies();
    const localLink = executeGraphLink(resolvers, mergedContext);
    const remoteLink = remoteGraphLink();
    const localRemoteLink = localRemoteRouterLink({
        localLink,
        remoteLink,
        resolvers,
    });
    const policyLoaderLink = cachePolicyLoaderLink(cachePolicies);

    const apolloClient = new ApolloClient({
        cache: new InMemoryCache({
            possibleTypes,
            typePolicies: merge(bootTypePolicies),
        }),
        defaultOptions,
    });

    mergedContext.client = apolloClient;

    apolloClient.setLink(
        ApolloLink.from([
            onErrorLink,
            ...managedQueryLink,
            new QueueOperationLink(),
            localStateResolversLink(localStateResolvers, mergedContext),
            policyLoaderLink,
            localRemoteLink,
        ])
    );

    return apolloClient;
}
