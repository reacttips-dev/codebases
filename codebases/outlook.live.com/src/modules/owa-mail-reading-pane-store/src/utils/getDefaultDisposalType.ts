import mailStore from 'owa-mail-store/lib/store/Store';
import type DisposalType from 'owa-service/lib/contract/DisposalType';
import doesFolderIdEqualName from 'owa-session-store/lib/utils/doesFolderIdEqualName';
import { isPublicFolder } from 'owa-folders';
import {
    PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID,
    ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID,
} from 'owa-folders-constants';

/**
 * Return the default disposal type when deleting an item from the reading pane
 */
export default function getDefaultDisposalType(itemId: string): DisposalType {
    const item = mailStore.items.get(itemId);
    // If the item is in the deleted items folder or in PublicFolder or in archived deleted items folder, perform a softdelete.
    return !item ||
        doesFolderIdEqualName(item.ParentFolderId.Id, PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID) ||
        doesFolderIdEqualName(item.ParentFolderId.Id, ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID) ||
        isPublicFolder(item.ParentFolderId.Id)
        ? 'SoftDelete'
        : 'MoveToDeletedItems';
}
