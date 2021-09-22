import getViewFilterForTable from './getViewFilterForTable';
import type { TableView } from '../index';

/**
 * Determines whether to suppress the server behavior where it marks the item to which user is r\R\F as read
 * @param tableView tableView for which to check the view filter
 * @return a flag indicating whether to suppress the server behavior if mark read on r\R\F
 */
export default function shouldSuppressServerMarkReadOnReplyOrForward(
    tableView: TableView | undefined
) {
    // TableView can be null in fileshub, currently there is no cleaner way to avoid not
    // calling this function if r\R\F is being performed from FilesHub
    return tableView && getViewFilterForTable(tableView) == 'Unread';
}
