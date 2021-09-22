import { convertToOwsFocusedViewFilter } from '../utils/convertToOwsFocusedViewFilter';
import { getConversationResponseShape } from '../utils/getConversationResponseShape';
import { getConversationSortResultsFromSortBy } from '../utils/getConversationSortResultsFromSortBy';
import { getMailItemSortResultsFromSortBy } from '../utils/getMailItemSortResultsFromSortBy';
import { createSubscriptionResolver, SubscriptionFactory } from 'create-subscription-resolver';
import type * as Schema from 'owa-graph-schema';
import { mapOwsConversationTypeToGql } from 'owa-mail-conversation-row-gql-mappers';
import { mapOwsItemToGqlItemRow } from 'owa-mail-item-row-gql-mappers';
import type SubscriptionParameters from 'owa-service/lib/contract/SubscriptionParameters';
import {
    lazyGetChannelId,
    lazySubscribe,
    NotificationSubscription,
    NotificationCallback,
    lazyUnsubscribe,
} from 'owa-notification';
import type OWSConverationType from 'owa-service/lib/contract/ConversationType';
import type OWSItem from 'owa-service/lib/contract/Item';

export const subscribeToRowNotificationsWeb = createSubscriptionResolver(createSubscriptionFactory);

/**
 * function that returns a SubscriptionFactory with subscribe and unSubscribe functions
 */
function createSubscriptionFactory(
    parent: {},
    args: Schema.SubscriptionSubscribeToRowNotificationsArgs,
    context: any,
    info: any
): Promise<
    SubscriptionFactory<
        Schema.RowNotificationPayload,
        (payload: Schema.RowNotificationPayload) => void
    >
> {
    return createNotificationSubscription(args).then(subscription => {
        return {
            subscribe: callback => subscribeToServiceNotifications(subscription, callback),
            unSubscribe: callback => unSubscribeToServiceNotifications(subscription, callback),
        };
    });
}

/**
 * function to populate Subscription object with right parameters based on input arguments
 * @param args Input arguments of the GQL subscription SubscribeToRowNotifications
 */
async function createNotificationSubscription(
    args: Schema.SubscriptionSubscribeToRowNotificationsArgs
): Promise<NotificationSubscription> {
    let subscription: NotificationSubscription = {
        subscriptionId: 'RowNotification',
        requiresExplicitSubscribe: true,
        subscriptionParameters: {},
    };

    subscription.subscriptionId = args.input.subscriptionId;
    const channelId = (await lazyGetChannelId.import())();
    const subscriptionParameters: SubscriptionParameters = {
        NotificationType: 'RowNotification',
        FolderId: getFolderIdForSubscription(
            args.input.type,
            args.input.commonRowsOptions.folderId
        ),
        FocusedViewFilter: convertToOwsFocusedViewFilter(args.input.focusedViewFilter),
        IsConversation: args.input.listViewType == 'Conversation',
        CategoryFilter: args.input.categoryName ?? undefined,
        Filter: args.input.viewFilter,
        ChannelId: channelId,
        MailboxId: getMailboxIdForSubscription(
            args.input.type,
            args.input.commonRowsOptions.folderId
        ),
    };

    if (subscriptionParameters.IsConversation === true) {
        subscriptionParameters.ConversationShapeName = args.input.shape?.ShapeName ?? undefined;
        subscriptionParameters.ConversationResponseShape = getConversationResponseShape(
            args.input.shape?.IsScheduledFolder ?? false
        );
        subscriptionParameters.SortBy = getConversationSortResultsFromSortBy(
            args.input.commonRowsOptions.sortBy
        );
    } else {
        subscriptionParameters.SortBy = getMailItemSortResultsFromSortBy(
            args.input.commonRowsOptions.sortBy
        );
    }

    subscription.subscriptionParameters = subscriptionParameters;

    return Promise.resolve(subscription);
}

/**
 * subscribes to owa server notifications and registers callback function to act on the incoming notifications
 * @param subscription subscription object with required parameters
 * @param callback callback function to handle the incoming notifications
 */
async function subscribeToServiceNotifications(
    subscription: NotificationSubscription,
    callback: (payload: Schema.RowNotificationPayload) => void
) {
    const handler = getRowNotificationHandler(callback);

    await lazySubscribe.importAndExecute(subscription, handler as NotificationCallback);

    // return callback so it will be available in unSubscribe
    return handler;
}

function getRowNotificationHandler(callback: (payload: Schema.RowNotificationPayload) => void) {
    return (payload: Schema.RowNotificationPayload) => {
        callback(getRowNotification(payload));
    };
}

function getRowNotification(payload: Schema.RowNotificationPayload): Schema.RowNotificationPayload {
    if (payload.EventType == 'RowDeleted') {
        return {
            __typename: 'RowNotificationDeletePayload',
            id: payload.id,
            EventType: payload.EventType,
            Item: {
                InstanceKey: payload.Item?.InstanceKey,
            } as Schema.RowInstanceKey,
            Conversation: {
                InstanceKey: payload.Conversation?.InstanceKey,
            } as Schema.RowInstanceKey,
        };
    } else {
        return {
            __typename: 'RowNotificationChangePayload',
            id: payload.id,
            EventType: payload.EventType,
            Conversation:
                payload.Conversation != undefined
                    ? mapOwsConversationTypeToGql(payload.Conversation as OWSConverationType)
                    : undefined,
            Item:
                payload.Item != undefined
                    ? mapOwsItemToGqlItemRow(payload.Item as OWSItem)
                    : undefined,
        };
    }
}

/**
 * unsubscribes to the server notifications
 * @param subscription subscription object with required parameters
 * @param callback callback function that was registered at the time of subscribe
 */
async function unSubscribeToServiceNotifications(
    subscription: NotificationSubscription,
    callback: (payload: Schema.RowNotificationPayload) => void
) {
    await lazyUnsubscribe.importAndExecute(subscription, callback as NotificationCallback);
}

function getFolderIdForSubscription(
    type: Schema.TableQueryType,
    folderId: string
): string | undefined {
    return type == 'Folder' ? folderId : undefined;
}

function getMailboxIdForSubscription(
    type: Schema.TableQueryType,
    folderId: string
): string | undefined {
    return type == 'Group' ? folderId : undefined;
}
