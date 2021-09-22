import { action } from 'satcheljs';
import type { TableView } from 'owa-mail-list-store';

export const closeDeeplinkReadingPane = action('CLOSE_DEEPLINK_READING_PANE');

/**
 * Called when the table has single selection, and user selects another single conversation
 * or another item part in the same conversation.
 * @param itemId the id of itemId which is going to be deselected
 * @param tableView the tableView where the single selection changed
 */
export const onItemPartDeselected = action(
    'ON_ITEM_PART_DESELECTED',
    (itemId: string, tableView: TableView) => ({
        itemId,
        tableView,
    })
);
