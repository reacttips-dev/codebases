import type { TableView } from 'owa-mail-list-store';
import type { MailListItemSelectionSource } from 'owa-mail-store';
import { action } from 'satcheljs';

/**
 * Called when an email is opened
 * @param tableView Where the selection took place
 * @param selectedNodeIds Selected mail item parts, if any
 * @param seletedRowKeys Selected mail items
 * @param mailListItemSelectionSource The source of selection
 */
export default action(
    'ON_KEYBOARD_UP_DOWN',
    (
        tableView: TableView,
        selectedNodeIds: string[],
        selectedRowKeys: string[],
        mailListItemSelectionSource: MailListItemSelectionSource
    ) => ({
        tableView,
        selectedNodeIds,
        selectedRowKeys,
        mailListItemSelectionSource,
    })
);
