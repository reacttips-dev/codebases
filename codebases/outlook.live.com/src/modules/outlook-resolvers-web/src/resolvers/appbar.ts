import type { Resolvers } from 'owa-graph-schema';
import { lazyAppBarControlM365AppsQueryWeb } from 'appbarcontrol-query-web';

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
        m365Apps: lazyAppBarControlM365AppsQueryWeb,
    },

    /**
     * The root mutation type. All queries that alter data start at the Mutation type.
     * Mutations typically return the mutated data.
     *
     * See https://graphql.org/learn/schema/#the-query-and-mutation-types
     */
    Mutation: {},

    /**
     * The root subscription type. Resolvers under subscriptions return an event stream
     * that the client responds to.
     *
     * For for definition and rationale, see https://graphql.org/blog/subscriptions-in-graphql-and-relay/#event-based-subscriptions
     * For resolver implementation, see https://www.apollographql.com/docs/apollo-server/data/subscriptions
     * For client consumption, see https://www.apollographql.com/docs/react/data/subscriptions
     */
    Subscription: {},

    /* ============================ */
    /* Resolvers for non-root types */
    /* ============================ */

    M365Application: {
        __resolveType(m365App, _context, _info) {
            return m365App.__typename || 'M365HubApplication';
        },
    },
};
