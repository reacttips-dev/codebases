import type { TableView } from 'owa-mail-list-store';
import { doesUserHaveSharedFolderPermissionFor, MenuItemType } from '../index';

export default function shouldAllowDelete(tableView: TableView): boolean {
    // Deletion is disabled in a shared folder and user doesn't have delete permissions
    if (!doesUserHaveSharedFolderPermissionFor(MenuItemType.Delete)) {
        return false;
    }

    return true;
}
