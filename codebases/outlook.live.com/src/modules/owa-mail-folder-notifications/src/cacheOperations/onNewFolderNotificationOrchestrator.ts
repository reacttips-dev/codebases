import { NewFolderFragmentDoc } from '../graphql/__generated__/FolderFragments.interface';
import { getApolloClient } from 'owa-apollo';
import { createLazyOrchestrator } from 'owa-bundling';
import { onNewFolderNotification } from 'owa-mail-actions/lib/folderNotificationActions';
import { updateFoldersParentFolder } from 'owa-folders-common/lib/util/updateFoldersParentFolder';
import { isBootFeatureEnabled } from 'owa-metatags';
import { getFolderTypeId } from 'owa-folders-common/lib/util/getFolderTypeId';

/**
 * Adds new folder to apollo cache
 */
export const onNewFolderNotificationOrchestrator = createLazyOrchestrator(
    onNewFolderNotification,
    'onNewFolderNotificationClone',
    async actionMessage => {
        if (!isBootFeatureEnabled('gqlfolders')) {
            return;
        }

        const { displayName, parentFolderId, folderId, unreadCount, totalCount } = actionMessage;
        const parentFolder = await updateFoldersParentFolder(parentFolderId, folderId);

        // No parent folder was found, hence return
        if (!parentFolder) {
            return;
        }

        const apolloClient = getApolloClient();

        // Add folder to cache
        apolloClient.writeFragment({
            id: getFolderTypeId(folderId, apolloClient),
            fragment: NewFolderFragmentDoc,
            data: {
                id: folderId,
                UnreadCount: unreadCount,
                TotalCount: totalCount,
                DisplayName: displayName,
                FolderId: {
                    Id: folderId,
                    ChangeKey: null,
                },
                ParentFolderId: parentFolder.FolderId,
                mailboxInfo: parentFolder.mailboxInfo,
                remoteFolderDisplayName: displayName,
                DistinguishedFolderId: null,
                childFolderIds: [],
                hasChildren: false,
                type: 'Folder:#Exchange',
                FolderClass: 'IPF.Note',
                __typename: 'MailFolder',
            },
        });
    }
);
