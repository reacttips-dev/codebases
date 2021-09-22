import type { ResolverContext, Resolvers } from 'owa-graph-schema';
import type { ApolloClient, ApolloLink, NormalizedCacheObject } from '@apollo/client';
import { createApolloClient } from './createApolloClient';
import { OwaCachePolicyMap } from 'owa-lazy-cache-policy';
import { TraceErrorObject } from 'owa-trace';
import { logUsage } from 'owa-analytics';

const ApolloNotInitErroMessage = 'ApolloNotInitialized';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;
let apolloClientPromise: Promise<ApolloClient<NormalizedCacheObject>> | null = null;

export function getApolloClient(): ApolloClient<NormalizedCacheObject> {
    if (!apolloClient) {
        const err: TraceErrorObject = new Error(ApolloNotInitErroMessage);
        err.addQueue = true;
        throw err;
    }

    return apolloClient;
}

// this is just a temporary function to help track all the places in startup
// that are making apoll client queries.
// If the apolloClient variable has already been initialized then this call is being
// made after startup. If not, we want to log an error so we can track down and fix this
// but also return the apolloClientPromise so that the scenarios still work
export function temp_getApolloClientAsync(source: string) {
    if (apolloClient) {
        return undefined;
    }
    logUsage(ApolloNotInitErroMessage, { s: source, cs: new Error().stack });
    return apolloClientPromise;
}

export function initializeApolloClient({
    lazyResolvers,
    lazyLocalStateResolvers,
    lazyCreateManagedQueryLink,
    lazyCachePolicies,
    context,
}: {
    lazyResolvers: Promise<Resolvers>;
    lazyLocalStateResolvers: Promise<Resolvers>;
    lazyCreateManagedQueryLink: Promise<() => ApolloLink> | undefined;
    lazyCachePolicies: Promise<OwaCachePolicyMap>;
    context: Partial<ResolverContext>;
}) {
    apolloClientPromise = Promise.all([
        lazyResolvers,
        lazyLocalStateResolvers,
        lazyCreateManagedQueryLink,
        lazyCachePolicies,
    ]).then(([resolvers, localStateResolvers, createManagedQueryLink, cachePolicies]) => {
        apolloClient = createApolloClient({
            resolvers,
            localStateResolvers,
            createManagedQueryLink,
            cachePolicies,
            context,
        });
        return apolloClient;
    });
    return apolloClientPromise;
}
