import { SubscribeToRowNotificationsDocument } from './graphql/__generated__/subscribeToRowNotifications.interface';
import { handleRowNotification } from './rowNotificationHandler';
import { getApolloClient } from 'owa-apollo';
import type { ObservableSubscription } from '@apollo/client';
import * as findConversationShapeUtil from 'owa-mail-find-rows/lib/utils/findConversationShapeUtil';
import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import { getMailboxInfoFromTableQuery } from 'owa-mail-mailboxinfo';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import * as trace from 'owa-trace';
import {
    isFavoritesSearchFolderScenario,
    MailFolderTableQuery,
    getGqlReactListViewTypeFromOwsReactListViewType,
    getGqlFocusedViewFilterFromOwsFocusedViewFilter,
    getGqlViewFilterFromOwsViewFilter,
    getGqlTableQueryTypeFromOwaTableQueryType,
    getGqlSortColumnFromOwsSortColumn,
} from 'owa-mail-list-store';

export async function subscribeToRowNotificationsUsingGql(
    tableView: TableView
): Promise<ObservableSubscription> {
    const mailFolderTableQuery = tableView.tableQuery as MailFolderTableQuery;

    const apolloClient = getApolloClient();
    const apolloSubscription = apolloClient.subscribe({
        query: SubscribeToRowNotificationsDocument,
        variables: {
            subscriptionId: tableView.id,
            folderId: tableView.tableQuery.folderId,
            listViewType: getGqlReactListViewTypeFromOwsReactListViewType(
                mailFolderTableQuery.listViewType
            ),
            type: getGqlTableQueryTypeFromOwaTableQueryType(tableView.tableQuery.type),
            categoryName: mailFolderTableQuery.categoryName,
            focusedViewFilter: getGqlFocusedViewFilterFromOwsFocusedViewFilter(
                mailFolderTableQuery.focusedViewFilter
            ),
            viewFilter: getGqlViewFilterFromOwsViewFilter(mailFolderTableQuery.viewFilter),
            sortBy: {
                sortColumn: getGqlSortColumnFromOwsSortColumn(
                    mailFolderTableQuery.sortBy.sortColumn
                ),
                sortDirection: mailFolderTableQuery.sortBy.sortDirection,
                canSortByRenewTime: shouldTableSortByRenewTime(mailFolderTableQuery),
            },
            shapeName: findConversationShapeUtil.getFindConversationShape(
                tableView.tableQuery.folderId,
                isFavoritesSearchFolderScenario(mailFolderTableQuery.scenarioType)
            ),
            isScheduledFolder: folderIdToName(tableView.tableQuery.folderId) == 'scheduled',
            mailboxInfo: getMailboxInfoFromTableQuery(mailFolderTableQuery),
        },
    });

    // This subscribe returns an object we can use to unsubscribe
    const subscription: ObservableSubscription = apolloSubscription.subscribe({
        next: payload => handleRowNotification(payload.data.subscribeToRowNotifications),
        error: err => {
            trace.trace.info(`Row notification error ${err}`);
        },
    });

    return subscription;
}

export function unsubscribeToRowNotificationsUsingGql(subscription: ObservableSubscription): void {
    // unsubscribe from this gql subscription
    subscription.unsubscribe();
}
