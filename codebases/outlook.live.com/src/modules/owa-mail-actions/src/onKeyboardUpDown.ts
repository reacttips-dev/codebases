import type { SelectionDirection, TableView } from 'owa-mail-list-store';
import type { MailListItemSelectionSource } from 'owa-mail-store';
import { action } from 'satcheljs';

/**
 * Called when up/down keyboard shortcut is pressed in mail list
 * @param selectionDirection The direction of the keyboard input
 * @param tableView Where the selection took place
 * @param mailListItemSelectionSource The source of selection
 * @param shouldSelect Whether or not to select or only focus the next item
 */
export default action(
    'ON_KEYBOARD_UP_DOWN',
    (
        selectionDirection: SelectionDirection,
        tableView: TableView,
        mailListItemSelectionSource: MailListItemSelectionSource,
        shouldSelect: boolean
    ) => ({
        selectionDirection,
        tableView,
        mailListItemSelectionSource,
        shouldSelect,
    })
);
