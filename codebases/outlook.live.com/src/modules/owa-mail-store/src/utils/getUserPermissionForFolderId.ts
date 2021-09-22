import { getFolderTable } from 'owa-folders';
import type { Permission } from 'owa-graph-schema';

/**
 * This function is wrapper over getUserPermissionForFolderIdWithErr function that can handle error.
 * In case of error this function will return null to denote that there are no permissions.
 * @param folderId - folder for which the permissions will be calculated
 * @param userEmailAddress - user email for which permissions will be filtered
 */
export function getUserPermissionForFolderId(
    folderId: string,
    userEmailAddress: string
): Permission {
    try {
        return getUserPermissionForFolderIdWithErr(folderId, userEmailAddress);
    } catch (e) {
        return null;
    }
}

/**
 * Function return user assigned permission for the given folderId and user email address
 * If no permissions are present for user then return undefined
 * If there is no value in store for PermissionSet or Permissions then let the function throw error implicitly
 * @param folderId - folder for which the permissions will be calculated
 * @param userEmailAddress - user email for which permissions will be filtered
 */
export function getUserPermissionForFolderIdWithErr(
    folderId: string,
    userEmailAddress: string
): Permission {
    if (!folderId || !userEmailAddress) {
        return null;
    }
    const selectedFolder = getFolderTable().get(folderId);
    const filteredFolderPermission = selectedFolder.PermissionSet.Permissions.filter(
        permission => permission.UserId.PrimarySmtpAddress === userEmailAddress
    );
    const assignedFolderPermission = filteredFolderPermission?.[0];
    return assignedFolderPermission;
}
