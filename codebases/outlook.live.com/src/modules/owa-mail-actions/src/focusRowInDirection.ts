import { action } from 'satcheljs';
import type { MailListItemSelectionSource } from 'owa-mail-store';
import type { SelectionDirection, TableView } from 'owa-mail-list-store';

/**
 * Focus the next row in the direction given
 * @param tableView where the operation is being performed
 * @param selectionDirection the direction in which to focus next row
 * @param mailListItemSelectionSource selection mode for the maillist item
 */
export default action(
    'FOCUS_ROW_IN_DIRECTION',
    (
        tableView: TableView,
        selectionDirection: SelectionDirection,
        mailListItemSelectionSource: MailListItemSelectionSource
    ) => ({
        tableView,
        selectionDirection,
        mailListItemSelectionSource,
    })
);
