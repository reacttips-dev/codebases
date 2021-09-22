import {
    FolderChildFolderIdsFragmentDoc,
    FolderChildFolderIdsFragment,
    UpdateFolderChildFolderIdsFragmentDoc,
} from '../graphql/__generated__/FolderUpdateFragments.interface';
import { getApolloClient } from 'owa-apollo';
import { getFolderTypeId } from './getFolderTypeId';
import { removeChildFromParentFolder } from './removeChildFromParentFolder';

export async function updateFoldersParentFolder(
    newParentFolderId: string,
    folderId: string
): Promise<FolderChildFolderIdsFragment> {
    const apolloClient = getApolloClient();

    // Update the current parent folder of this folder
    await removeChildFromParentFolder(folderId, newParentFolderId);

    // Get folder fragment for the new parent folder
    const parentFolderFragment = apolloClient.readFragment({
        id: getFolderTypeId(newParentFolderId, apolloClient),
        fragment: FolderChildFolderIdsFragmentDoc,
    });

    // If we fail to read the new parent folder property, no-op
    if (!parentFolderFragment) {
        return null;
    }

    // Update childFolderIds on parent folder
    const existingChildFolderIds = parentFolderFragment.childFolderIds;
    if (!existingChildFolderIds.includes(folderId)) {
        apolloClient.writeFragment({
            id: getFolderTypeId(newParentFolderId, apolloClient),
            fragment: UpdateFolderChildFolderIdsFragmentDoc,
            data: {
                childFolderIds: [...existingChildFolderIds, folderId],
                hasChildren: true,
            },
        });
    }

    const updatedParentFolderFragment = apolloClient.readFragment({
        id: getFolderTypeId(newParentFolderId, apolloClient),
        fragment: FolderChildFolderIdsFragmentDoc,
    });

    return updatedParentFolderFragment;
}
