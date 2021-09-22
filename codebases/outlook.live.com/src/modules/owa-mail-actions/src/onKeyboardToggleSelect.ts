import type { TableView } from 'owa-mail-list-store';
import type { MailListItemSelectionSource } from 'owa-mail-store';
import { action } from 'satcheljs';

/**
 * Called when ctrl+spacebar is pressed in message list to toggle selection
 * @param tableView Where the selection took place
 * @param mailListItemSelectionSource The source of selection on item part
 */
export default action(
    'ON_KEYBOARD_TOGGLE_SELECT',
    (tableView: TableView, mailListItemSelectionSource: MailListItemSelectionSource) => ({
        tableView,
        mailListItemSelectionSource,
    })
);
