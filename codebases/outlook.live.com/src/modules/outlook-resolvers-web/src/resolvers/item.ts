import { lazyMarkItemAsJunkWeb, lazyUndoMarkItemAsJunkWeb } from 'markasjunkitem-mutation-web';
import type { Resolvers } from 'owa-graph-schema';
import { lazyCategorizeItemWeb } from 'categorizeitem-mutation-web';
import { lazyItemRowsWeb } from 'itemrows-query-web';
import { lazyMarkItemAsPhishingWeb } from 'markasphishingitem-mutation-web';
import { lazyMarkItemAsReadWeb } from 'markasreaditem-mutation-web';
import { lazyPinItemMutationWeb } from 'pinitem-mutation-web';
import { lazyQueryItemWeb } from 'query-item-web';
import { lazyQueryItemsWeb } from 'query-items-web';
import { lazyMoveItemMutationWeb } from 'moveitem-mutation-web';
import { lazyUndoMoveItemMutationWeb } from 'moveitem-mutation-web';

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
        item: lazyQueryItemWeb,
        items: lazyQueryItemsWeb,
        itemRows: lazyItemRowsWeb,
    },

    /**
     * The root mutation type. All queries that alter data start at the Mutation type.
     * Mutations typically return the mutated data.
     *
     * See https://graphql.org/learn/schema/#the-query-and-mutation-types
     */
    Mutation: {
        categorizeItem: lazyCategorizeItemWeb,
        markItemAsRead: lazyMarkItemAsReadWeb,
        markItemAsJunk: lazyMarkItemAsJunkWeb,
        markItemAsPhishing: lazyMarkItemAsPhishingWeb,
        pinItem: lazyPinItemMutationWeb,
        undoMarkItemAsJunk: lazyUndoMarkItemAsJunkWeb,
        moveItem: lazyMoveItemMutationWeb,
        undoMoveItem: lazyUndoMoveItemMutationWeb,
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
