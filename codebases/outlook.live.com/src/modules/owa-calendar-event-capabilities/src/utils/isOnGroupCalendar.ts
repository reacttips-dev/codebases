import type { ClientItemId } from 'owa-client-ids';

/**
 * Gets whether the current item is on a group calendar
 * @param item calendar item object
 */
export default (item: { ParentFolderId: ClientItemId }): boolean =>
    item?.ParentFolderId?.mailboxInfo && item.ParentFolderId.mailboxInfo.type == 'GroupMailbox';
