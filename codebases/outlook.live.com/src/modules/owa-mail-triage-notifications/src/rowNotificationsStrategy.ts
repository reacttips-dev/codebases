import { handleRowNotification } from './rowNotificationHandler';
import type { ObservableSubscription } from '@apollo/client';
import { isFolderInMailboxType } from 'owa-folders';
import * as findConversationShapeUtil from 'owa-mail-find-rows/lib/utils/findConversationShapeUtil';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import { isFolderUnderArchiveRoot } from 'owa-mail-store';
import getConversationSortByProperty from 'owa-mail-triage-table-utils/lib/getConversationSortByProperty';
import getMailItemSortByProperty from 'owa-mail-triage-table-utils/lib/getMailItemSortByProperty';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type SubscriptionParameters from 'owa-service/lib/contract/SubscriptionParameters';
import {
    isFavoritesSearchFolderScenario,
    MailFolderTableQuery,
    SortColumn,
    TableQueryType,
    getStore as getListViewStore,
} from 'owa-mail-list-store';
import {
    lazyGetChannelId,
    lazySubscribe,
    lazyUnsubscribe,
    NotificationSubscription,
} from 'owa-notification';
import {
    subscribeToRowNotificationsUsingGql,
    unsubscribeToRowNotificationsUsingGql,
} from './subscribeToRowNotificationsUsingGql';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazySubscribeToChannelReadyNotification } from 'owa-mail-notification-channel-ready';

// exported only for tests
export const tableIdToSubscriptionMap: {
    [id: string]: NotificationSubscription | ObservableSubscription;
} = {};

export function unsubscribeToRowNotifications(tableId: string): void {
    const subscription = tableIdToSubscriptionMap[tableId];
    if (subscription) {
        const tableView = getListViewStore().tableViews.get(tableId);
        if (shouldSubscribeViaGql(tableView)) {
            unsubscribeToRowNotificationsUsingGql(subscription as ObservableSubscription);
        } else {
            lazyUnsubscribe.importAndExecute(
                subscription as NotificationSubscription,
                handleRowNotification
            );
        }

        delete tableIdToSubscriptionMap[tableId];
    }
}

export function subscribeToRowNotifications(tableView: TableView): void {
    // do not subscribe if we have existing subscription
    if (tableIdToSubscriptionMap[tableView.id]) {
        return;
    }

    if (
        tableView.tableQuery.type != TableQueryType.Folder &&
        tableView.tableQuery.type != TableQueryType.Group
    ) {
        throw new Error(
            'subscribeToRowNotifications should only be called for Folder or Group table type'
        );
    }

    const mailFolderTableQuery = tableView.tableQuery as MailFolderTableQuery;

    // VSO: 18945 - Add notification support for the multivalued sort
    // Till then only support date time sort
    // Also we do not subscribe to notification if the folder is under archive mailbox or shared folders
    if (
        mailFolderTableQuery.sortBy.sortColumn != SortColumn.Date ||
        isFolderUnderArchiveRoot(tableView.tableQuery.folderId) ||
        isFolderInMailboxType(tableView.tableQuery.folderId, 'SharedMailbox')
    ) {
        return;
    }

    // "Important" filter view shouldn't subscribe to notifications.
    if (mailFolderTableQuery.scenarioType === 'spotlight') {
        return;
    }

    if (shouldSubscribeViaGql(tableView)) {
        lazySubscribeToChannelReadyNotification.importAndExecute();
        subscribeToRowNotificationsUsingGql(tableView).then(subscription => {
            tableIdToSubscriptionMap[tableView.id] = subscription;
        });
    } else {
        lazyGetChannelId.import().then(getChannelId => {
            const subscriptionParameters: SubscriptionParameters = {
                NotificationType: 'RowNotification',
                FolderId: getFolderIdForSubscription(tableView),
                FocusedViewFilter: mailFolderTableQuery.focusedViewFilter,
                IsConversation: mailFolderTableQuery.listViewType == ReactListViewType.Conversation,
                CategoryFilter: mailFolderTableQuery.categoryName,
                Filter: mailFolderTableQuery.viewFilter,
                ChannelId: getChannelId(),
                MailboxId: getMailboxIdForSubscription(tableView),
            };

            if (subscriptionParameters.IsConversation === true) {
                subscriptionParameters.ConversationShapeName = findConversationShapeUtil.getFindConversationShape(
                    tableView.tableQuery.folderId,
                    isFavoritesSearchFolderScenario(mailFolderTableQuery.scenarioType)
                );
                subscriptionParameters.ConversationResponseShape = findConversationShapeUtil.getFindConversationResponseShape(
                    tableView.tableQuery.folderId
                );
                subscriptionParameters.SortBy = getConversationSortByProperty(mailFolderTableQuery);
            } else {
                subscriptionParameters.SortBy = getMailItemSortByProperty(mailFolderTableQuery);
            }

            const subscription: NotificationSubscription = {
                subscriptionId: tableView.id,
                requiresExplicitSubscribe: true,
                subscriptionParameters: subscriptionParameters,
            };

            // subscribe and store the subscription object
            lazySubscribe.importAndExecute(subscription, handleRowNotification);
            tableIdToSubscriptionMap[tableView.id] = subscription;
        });
    }
}

function getFolderIdForSubscription(tableView: TableView): string {
    return tableView.tableQuery.type == TableQueryType.Folder
        ? tableView.tableQuery.folderId
        : null;
}

function getMailboxIdForSubscription(tableView: TableView): string {
    return tableView.tableQuery.type == TableQueryType.Group ? tableView.tableQuery.folderId : null;
}

function shouldSubscribeViaGql(tableView: TableView) {
    return (
        tableView &&
        (tableView.tableQuery.listViewType == ReactListViewType.Conversation ||
            (tableView.tableQuery.listViewType == ReactListViewType.Message &&
                isFeatureEnabled('mon-messageList-useGqlForFindItem')))
    );
}
