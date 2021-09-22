import { action } from 'satcheljs';
import type { Permission, MailboxInfoInput } from 'owa-graph-schema';
import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';
import type FolderStore from '../store/schema/FolderStore';
import type { MailboxInfo } from 'owa-client-ids';

/**
 * Action to get archive folders.
 */
export const getArchiveFolders = action(
    'GET_ARCHIVE_FOLDERS',
    (source: string, isLoadingMore?: boolean) => ({
        source,
        isLoadingMore,
    })
);

/**
 * Action to initialize archive folder tree for archive mailbox from session data.
 */
export const initializeArchiveFolderTreeFromSessionData = action(
    'INITIALIZE_ARCHIVE_FOLDER_TREE_FROM_SESSIONDATA'
);

/**
 * Action to fetch folder permissions from server.
 * @param folderId Id of the folder
 */
export const getFolderPermissions = action('GET_FOLDER_PERMISSIONS', (folderId: string) => ({
    folderId,
}));

/**
 * Action to dispatch success status for fetch folder permissions request.
 */
export const getFolderPermissionsSuccess = action('GET_FOLDER_PERMISSIONS_SUCCESS');

/**
 * Action to dispatch failure status for fetch folder permissions request.
 */
export const getFolderPermissionsFailed = action('GET_FOLDER_PERMISSIONS_FAILED');

/**
 * Action to update folder permissions on server.
 * @param folderId Id of the folder
 * @param permissions Permissions defined on the folder
 */
export const updateFolderPermissions = action(
    'UPDATE_FOLDER_PERMISSIONS',
    (folderId: string, permissions: Permission[], mailboxInfo: MailboxInfoInput) => ({
        folderId,
        permissions,
        mailboxInfo,
    })
);

/**
 * Action to update folder permissions in store.
 * @param folderId Id of the folder
 * @param permissions Permissions defined on the folder
 */
export const updateFolderPermissionsInStore = action(
    'UPDATE_FOLDER_PERMISSIONS_IN_STORE',
    (folderId: string, permissions: Permission[]) => ({ folderId, permissions })
);

/**
 * Action to dispatch success status for update folder permissions request.
 */
export const updateFolderPermissionsSuccess = action('UPDATE_FOLDER_PERMISSIONS_SUCCESS');

/**
 * Action to dispatch failure status for update folder permissions request.
 */
export const updateFolderPermissionsFailed = action('UPDATE_FOLDER_PERMISSIONS_FAILED');

/**
 * This is using OWS type of Folder because this action is used to create a folder in the store
 * when a new folder notification arrives or user creates a folder from client and on response
 * we use the folder object to create folder in store. Once both these scenarios are migrated to Apollo
 * we should be able to use apollo types
 */
export const createNewFolderInStore = action(
    'ADD_NEW_FOLDER_TO_STORE',
    (
        folderStore: FolderStore,
        folder: BaseFolderType,
        parentFolderId: string,
        displayName: string,
        mailboxInfo?: MailboxInfo
    ) => ({
        folderStore,
        folder,
        parentFolderId,
        displayName,
        mailboxInfo,
    })
);
