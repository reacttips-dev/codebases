import type { AdapterSharedProperties } from 'owa-addins-core';
import { getFolderTable } from 'owa-folders';
import type { Permission } from 'owa-graph-schema';
import type { ComposeViewState, SharedFolderComposeViewState } from 'owa-mail-compose-store';
import { getUserPermissionForFolderId } from 'owa-mail-store';
import type Item from 'owa-service/lib/contract/Item';
import { getUserEmailAddress } from 'owa-session-store';

export const getSharedPropertiesForCompose = (
    viewState: ComposeViewState
) => (): AdapterSharedProperties => {
    const sharedFolderComposeViewState = viewState as SharedFolderComposeViewState;
    const owner = sharedFolderComposeViewState.folderOwnerEmailAddress;
    const folderPermission = sharedFolderComposeViewState.folderPermission;

    const delegatePermissions = getDelegatePermissions(folderPermission);

    return {
        owner,
        delegatePermissions,
    };
};

export const getSharedProperties = (item: Item) => (): AdapterSharedProperties => {
    const folderId = item.ParentFolderId.Id;
    const userEmail = getUserEmailAddress();
    const folderPermission = getUserPermissionForFolderId(folderId, userEmail);
    const { principalSMTPAddress } = getFolderTable().get(folderId);
    const delegatePermissions = getDelegatePermissions(folderPermission);

    return {
        owner: principalSMTPAddress,
        delegatePermissions,
    };
};

function getDelegatePermissions(folderPermission: Permission) {
    if (!folderPermission) {
        return createDefaultDelegatePermissions();
    }

    return {
        Read: folderPermission.ReadItems == 'FullDetails',
        Create: folderPermission.CanCreateItems,
        EditOwn: folderPermission.EditItems == 'All' || folderPermission.EditItems == 'Owned',
        EditAll: folderPermission.EditItems == 'All',
        DeleteOwn: folderPermission.DeleteItems == 'All' || folderPermission.DeleteItems == 'Owned',
        DeleteAll: folderPermission.DeleteItems == 'All',
    };
}

function createDefaultDelegatePermissions() {
    return {
        Read: true,
        Create: true,
        EditOwn: true,
        EditAll: true,
        DeleteOwn: true,
        DeleteAll: true,
    };
}
