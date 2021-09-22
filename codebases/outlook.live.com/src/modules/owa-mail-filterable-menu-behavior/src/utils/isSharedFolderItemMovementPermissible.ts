import { getUserConfiguration } from 'owa-session-store';
import { getUserPermissionForFolderId, MenuItemType, doesUserHaveActionPermission } from '../index';

/**
 * This method restricts the movement of the items by drag and drop if user doesn't have enough permission for shared folder
 * @param sourceFolderId - source folder id
 * @param destinationFolderId - destination folder id
 */
export default function isSharedFolderItemMovementPermissible(
    sourceFolderId: string,
    destinationFolderId: string
) {
    const userEmail = getUserConfiguration().SessionSettings.UserEmailAddress;
    const assignedSourceFolderPermission = getUserPermissionForFolderId(sourceFolderId, userEmail);
    const assignedDestinationFolderPermission = getUserPermissionForFolderId(
        destinationFolderId,
        userEmail
    );

    /**
     *  Check write permission for both source and destination folder
     */
    const doesUserHavePermission =
        doesUserHaveActionPermission(MenuItemType.Move, assignedSourceFolderPermission) &&
        doesUserHaveActionPermission(MenuItemType.Move, assignedDestinationFolderPermission);
    return doesUserHavePermission;
}
