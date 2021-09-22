import { FolderCountsFragmentDoc } from '../graphql/__generated__/FolderUpdateFragments.interface';
import updateFolderCounts from 'owa-mail-actions/lib/updateFolderCounts';
import { getApolloClient } from 'owa-apollo';
import { createLazyOrchestrator } from 'owa-bundling';
import { isBootFeatureEnabled } from 'owa-metatags';
import { getFolderTypeId } from '../util/getFolderTypeId';

export const onUpdateFolderCountsOrchestrator = createLazyOrchestrator(
    updateFolderCounts,
    'updateFolderCountsClone',
    async actionMessage => {
        if (!isBootFeatureEnabled('gqlfolders')) {
            return;
        }

        const { folderId, unreadCount, totalCount, isDeltaChange } = actionMessage;
        const apolloClient = getApolloClient();
        const folderCacheId = getFolderTypeId(folderId, apolloClient);
        const folderFragmentToUpdate = apolloClient.readFragment({
            id: folderCacheId,
            fragment: FolderCountsFragmentDoc,
        });

        // Folder is not present in the local cache
        if (!folderFragmentToUpdate) {
            return;
        }

        let folderUnreadCount = folderFragmentToUpdate.UnreadCount;
        let folderTotalCount = folderFragmentToUpdate.TotalCount;

        if (isDeltaChange) {
            folderUnreadCount += unreadCount;
            folderTotalCount += totalCount;
        } else {
            folderUnreadCount = unreadCount;
            folderTotalCount = totalCount;
        }

        // Do not let counts fall below 0 in the store.
        // This state could happen due to the timing of when
        // folder tree is loaded versus listview.
        folderUnreadCount = Math.max(folderUnreadCount, 0);
        folderTotalCount = Math.max(folderTotalCount, 0);

        apolloClient.writeFragment({
            id: folderCacheId,
            fragment: FolderCountsFragmentDoc,
            data: {
                UnreadCount: folderUnreadCount,
                TotalCount: folderTotalCount,
            },
        });
    }
);
