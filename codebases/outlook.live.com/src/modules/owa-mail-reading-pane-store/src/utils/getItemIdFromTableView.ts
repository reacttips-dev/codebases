import {
    getSelectedTableView,
    getRowKeysFromRowIds,
    MailRowDataPropertyGetter,
} from 'owa-mail-list-store';

/**
 * @param conversationId
 * @returns the item id to show on reading pane and in popout
 */
export default function getItemIdFromTableView(conversationId: string): string {
    const tableView = getSelectedTableView();
    const rowKeys = getRowKeysFromRowIds([conversationId], tableView);
    const clientItemId = MailRowDataPropertyGetter.getRowIdToShowInReadingPane(
        rowKeys[0],
        tableView
    );
    return clientItemId?.Id;
}
