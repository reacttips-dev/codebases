import {
    FolderChildFolderIdsFragmentDoc,
    FolderParentFolderFragmentDoc,
    UpdateFolderChildFolderIdsFragmentDoc,
} from '../graphql/__generated__/FolderUpdateFragments.interface';
import { getApolloClient } from 'owa-apollo';
import { getFolderTypeId } from './getFolderTypeId';

export async function removeChildFromParentFolder(
    folderId: string,
    newParentFolderId: string | null
) {
    const apolloClient = getApolloClient();

    const folderFragment = apolloClient.readFragment({
        id: getFolderTypeId(folderId, apolloClient),
        fragment: FolderParentFolderFragmentDoc,
    });

    // no-op if not existing folder
    if (!folderFragment) {
        return;
    }

    // Get folder fragment for the new parent folder
    const currentParentFolderId = folderFragment.ParentFolderId.Id;
    if (currentParentFolderId == newParentFolderId) {
        return;
    }

    const currentParentFolderFragment = apolloClient.readFragment({
        id: getFolderTypeId(currentParentFolderId, apolloClient),
        fragment: FolderChildFolderIdsFragmentDoc,
    });

    // If we fail to read the new parent folder property, no-op
    if (!currentParentFolderFragment) {
        return null;
    }

    // Update childFolderIds on parent folder
    const existingChildFolderIds = [...currentParentFolderFragment.childFolderIds];
    const folderIdIndex = existingChildFolderIds.indexOf(folderId);
    if (folderIdIndex > -1) {
        existingChildFolderIds.splice(folderIdIndex, 1);
        apolloClient.writeFragment({
            id: getFolderTypeId(currentParentFolderId, apolloClient),
            fragment: UpdateFolderChildFolderIdsFragmentDoc,
            data: {
                childFolderIds: [...existingChildFolderIds],
                hasChildren: existingChildFolderIds.length > 0,
            },
        });
    }
}
