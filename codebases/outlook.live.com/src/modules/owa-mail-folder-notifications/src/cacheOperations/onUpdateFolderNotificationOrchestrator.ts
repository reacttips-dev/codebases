import { FolderUpdateNotificationFragmentDoc } from '../graphql/__generated__/FolderFragments.interface';
import { getFolderTypeId } from 'owa-folders-common/lib/util/getFolderTypeId';
import { getApolloClient } from 'owa-apollo';
import { createLazyOrchestrator } from 'owa-bundling';
import { onUpdateFolderNotification } from 'owa-mail-actions/lib/folderNotificationActions';
import { updateFoldersParentFolder } from 'owa-folders-common/lib/util/updateFoldersParentFolder';
import { isBootFeatureEnabled } from 'owa-metatags';

/**
 * Writes the total counts, unread count, display name on folder object upon notification
 */
export const onUpdateFolderNotificationOrchestrator = createLazyOrchestrator(
    onUpdateFolderNotification,
    'onUpdateFolderNotificationClone',
    async actionMessage => {
        if (!isBootFeatureEnabled('gqlfolders')) {
            return;
        }

        const { folderId, unreadCount, totalCount, displayName, parentFolderId } = actionMessage;

        const apolloClient = getApolloClient();
        const folderFragmentToUpdateUponNotification = apolloClient.readFragment({
            id: getFolderTypeId(folderId, apolloClient),
            fragment: FolderUpdateNotificationFragmentDoc,
        });

        // Folder is not present in the local cache, hence do not handle this update notification
        if (!folderFragmentToUpdateUponNotification) {
            return;
        }

        const parentFolderIdWithChangeKey = await updateFoldersParentFolder(
            parentFolderId,
            folderId
        );

        // No parent folder was found, hence return.
        if (!parentFolderIdWithChangeKey) {
            return;
        }

        apolloClient.writeFragment({
            id: getFolderTypeId(folderId, apolloClient),
            fragment: FolderUpdateNotificationFragmentDoc,
            data: {
                UnreadCount: unreadCount,
                TotalCount: totalCount,
                DisplayName: displayName,
                ParentFolderId: parentFolderIdWithChangeKey.FolderId,
            },
        });
    }
);
