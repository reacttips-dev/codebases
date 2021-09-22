import { createLazySubscriptionResolver, createLazyResolver } from 'owa-lazy-resolver';

export const lazySubscribeToRowNotificationsWeb = createLazySubscriptionResolver(
    () =>
        import(
            /* webpackChunkName: "SubscribeToRowNotificationsWeb"*/ './queries/subscribeToRowNotificationsWeb'
        ),
    m => m.subscribeToRowNotificationsWeb
);

export const lazyConversationRowByIdWeb = createLazyResolver(
    'QUERY_CONVERSATION_ROW_BY_ID',
    () =>
        import(/* webpackChunkName: "ConversationRowByIdWeb"*/ './queries/conversationRowByIdWeb'),
    m => m.conversationRowByIdWeb
);

export const lazyConversationRowsWeb = createLazyResolver(
    'QUERY_CONVERSATION_ROWS',
    () => import(/* webpackChunkName: "ConversationRowsWeb"*/ './queries/conversationRowsWeb'),
    m => m.conversationRowsWeb
);
