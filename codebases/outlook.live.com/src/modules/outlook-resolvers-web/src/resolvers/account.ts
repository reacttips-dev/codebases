import { Resolvers } from 'owa-graph-schema';
import { lazyAccountSourceListQueryWeb } from 'accounts-query-web';
import { lazyAutoReplyConfigQueryWeb } from 'autoreplyconfig-query-web';
import { lazyMipDataQueryWeb } from 'mipdata-query-web';
import { lazySaveAutomaticRepliesConfigMutationWeb } from 'save-automatic-replies-config-mutation-web';

/**
 * Please keep fields alphabetized to minimize merge conflicts
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
        accountSourceList: lazyAccountSourceListQueryWeb,
        autoReplyConfig: lazyAutoReplyConfigQueryWeb,
        MIPData: lazyMipDataQueryWeb,
    },

    /**
     * The root mutation type. All queries that alter data start at the Mutation type.
     * Mutations typically return the mutated data.
     *
     * See https://graphql.org/learn/schema/#the-query-and-mutation-types
     */
    Mutation: {
        saveAutomaticRepliesConfig: lazySaveAutomaticRepliesConfigMutationWeb,
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
