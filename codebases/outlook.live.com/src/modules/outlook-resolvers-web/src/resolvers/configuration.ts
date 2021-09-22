import type { Resolvers } from 'owa-graph-schema';
import { lazyUpdateUserConfigurationWeb } from 'userconfiguration-mutation-web';
import { lazyUserConfigurationWeb } from 'userconfiguration-query-web';

/**
 * Please keep fields alphebatized to minimize merge conflicts
 */
export const webResolvers: Resolvers = {
    /* ======================== */
    /* Resolvers for root types */
    /* ======================== */

    /**
     * The root query type. All queries that fetch data start at the Query type.
     * Resolvers under Query should not have effects
     *
     * See https://graphql.org/learn/schema/#the-query-and-mutation-types
     */
    Query: {
        userConfiguration: lazyUserConfigurationWeb,
    },

    /**
     * The root mutation type. All queries that alter data start at the Mutation type.
     * Mutations typically return the mutated data.
     *
     * See https://graphql.org/learn/schema/#the-query-and-mutation-types
     */
    Mutation: {
        updateUserConfiguration: lazyUpdateUserConfigurationWeb,
    },

    /**
     * The root subscription type. Resolvers under subscriptions return an event stream
     * that the client responds to.
     *
     * For for definition and rationale, see https://graphql.org/blog/subscriptions-in-graphql-and-relay/#event-based-subscriptions
     * For resolver implementation, see https://www.apollographql.com/docs/apollo-server/data/subscriptions
     * For client consumption, see https://www.apollographql.com/docs/react/data/subscriptions
     */
    Subscription: {},
};
