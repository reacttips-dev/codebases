import { SubscribeToHierarchyNotificationsDocument } from './graphql/__generated__/subscribeToHierarchyNotifications.interface';
import { getApolloClient } from 'owa-apollo';
import { lazyOnBulkActionHierarchyNotification } from 'owa-bulk-action-store';
import type * as Schema from 'owa-graph-schema';
import {
    onNewFolderNotification,
    onUpdateFolderNotification,
} from 'owa-mail-actions/lib/folderNotificationActions';
import updateFolderCounts from 'owa-mail-actions/lib/updateFolderCounts';
import findFoldersCountsOnly from 'owa-mail-store/lib/services/findFoldersCountsOnly';
import type Folder from 'owa-service/lib/contract/Folder';
import { trace } from 'owa-trace';

function onHierarchyNotificationCallback(
    hierarchyNotification: Schema.HierarchyNotificationPayload
): void {
    switch (hierarchyNotification.EventType) {
        case 'Reload':
        case 'QueryResultChanged':
            updateFoldersCounts();
            break;
        case 'RowModified':
            onUpdateFolderNotification(
                hierarchyNotification.unreadCount,
                hierarchyNotification.itemCount,
                hierarchyNotification.folderId,
                hierarchyNotification.displayName,
                hierarchyNotification.parentFolderId
            );
            lazyOnBulkActionHierarchyNotification
                .import()
                .then(onBulkActionHierarchyNotification => {
                    onBulkActionHierarchyNotification(hierarchyNotification);
                });
            break;
        case 'RowAdded':
            onNewFolderNotification(
                hierarchyNotification.folderId,
                hierarchyNotification.parentFolderId,
                hierarchyNotification.displayName,
                hierarchyNotification.unreadCount,
                hierarchyNotification.itemCount
            );
            lazyOnBulkActionHierarchyNotification
                .import()
                .then(onBulkActionHierarchyNotification => {
                    onBulkActionHierarchyNotification(hierarchyNotification);
                });
            break;
        default:
            return;
    }
}

export function subscribeToHierarchyNotification() {
    const apolloClient = getApolloClient();
    const apolloSubscription = apolloClient.subscribe({
        query: SubscribeToHierarchyNotificationsDocument,
    });
    // This subscribe returns an object we can use to unsubscribe, but we never unsubscribe to
    // hierarchy notifications
    apolloSubscription.subscribe({
        next: payload =>
            onHierarchyNotificationCallback(payload.data.subscribeToHierarchyNotifications),
        error: err => {
            trace.warn(`Hierarchy notification error ${err}`);
        },
    });
}

const actionName = 'UpdateFolderCountsAction:';

// TODO - For view layer this should be query that returns only unread and total counts for all folders

// update total and unread count for all folders
function updateFoldersCounts(): Promise<void> {
    return findFoldersCountsOnly()
        .then(response => {
            if (response?.ResponseClass == 'Success') {
                response.RootFolder.Folders.forEach((folder: Folder) => {
                    updateFolderCounts(
                        folder.UnreadCount,
                        folder.TotalCount,
                        folder.FolderId.Id,
                        false /* isDeltaChange */
                    );
                });
            } else {
                trace.warn(actionName + 'ResponseNotSuccess');
            }
        })
        .catch(e => {
            trace.warn(actionName + ':' + e.message);
        });
}
