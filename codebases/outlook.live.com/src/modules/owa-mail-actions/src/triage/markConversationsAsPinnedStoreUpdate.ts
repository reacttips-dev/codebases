import { action } from 'satcheljs';

/**
 * Action to propagate the pin conversations action to client stores
 * @param rowKeys - the row keys of the rows that get pinned/unpinned
 * @param tableViewId - the table view id
 * @param shouldMarkAsPinned - the pinned value to be set
 */
export default action(
    'MARK_CONVERSATIONS_PINNED_STORE_UPDATE',
    (rowKeys: string[], tableViewId: string, shouldMarkAsPinned: boolean) => {
        return {
            rowKeys,
            tableViewId,
            shouldMarkAsPinned,
        };
    }
);
