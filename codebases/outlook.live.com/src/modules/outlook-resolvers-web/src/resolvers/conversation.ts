import { lazyConversationRowByIdWeb, lazyConversationRowsWeb } from 'outlook-listview-web';
import {
    lazyDeleteConversationWeb,
    lazyUndoDeleteConversationWeb,
} from 'deleteconversation-mutation-web';
import {
    lazyMoveConversationWeb,
    lazyUndoMoveConversationWeb,
} from 'moveconversation-mutation-web';
import {
    lazyScheduleConversationWeb,
    lazyUndoScheduleConversationWeb,
} from 'scheduleconversation-mutation-web';
import type { Resolvers } from 'owa-graph-schema';
import { lazyCategorizeConversationWeb } from 'categorizeconversation-mutation-web';
import { lazyConversationConversationNodesWebResolver } from 'conversation-conversation-nodes-web';
import { lazyFlagConversationMutationWeb } from 'flagconversation-mutation-web';
import { lazyIgnoreConversationMutationWeb } from 'ignoreconversation-mutation-web';
import { lazyMarkConversationAsReadWeb } from 'markasreadconversation-mutation-web';
import { lazyPinConversationMutationWeb } from 'pinconversation-mutation-web';
import { lazyQueryConversationNodeWeb } from 'query-conversation-node-web';
import { lazyQueryConversationWeb } from 'query-conversation-web';
import { lazySetInferenceClassificationOnConversationWeb } from 'setinferenceclassificationconversation-mutation-web';

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
        conversation: lazyQueryConversationWeb,
        conversationNode: lazyQueryConversationNodeWeb,
        conversationRowById: lazyConversationRowByIdWeb,
        conversationRows: lazyConversationRowsWeb,
    },

    /**
     * The root mutation type. All queries that alter data start at the Mutation type.
     * Mutations typically return the mutated data.
     *
     * See https://graphql.org/learn/schema/#the-query-and-mutation-types
     */
    Mutation: {
        categorizeConversation: lazyCategorizeConversationWeb,
        deleteConversation: lazyDeleteConversationWeb,
        flagConversation: lazyFlagConversationMutationWeb,
        ignoreConversation: lazyIgnoreConversationMutationWeb,
        markConversationAsRead: lazyMarkConversationAsReadWeb,
        moveConversation: lazyMoveConversationWeb,
        pinConversation: lazyPinConversationMutationWeb,
        scheduleConversation: lazyScheduleConversationWeb,
        setInferenceClassificationOnConversation: lazySetInferenceClassificationOnConversationWeb,
        undoDeleteConversation: lazyUndoDeleteConversationWeb,
        undoMoveConversation: lazyUndoMoveConversationWeb,
        undoScheduleConversation: lazyUndoScheduleConversationWeb,
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

    /* ============================ */
    /* Resolvers for non-root types */
    /* ============================ */

    Conversation: {
        conversationNodes: lazyConversationConversationNodesWebResolver,
    },
};
