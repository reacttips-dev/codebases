import autoMarkItemAsRead from '../helpers/autoMarkItemAsRead';
import { onItemPartDeselected } from 'owa-mail-actions/lib/readingPaneActions';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { createLazyOrchestrator } from 'owa-bundling';

/**
 * Called when the table has single selection, and user selects another single conversation
 * or another item in the same conversation.
 */
export const onItemPartDeselectedOrchestrator = createLazyOrchestrator(
    onItemPartDeselected,
    'CLONE_ON_ITEM_PART_DESELECTED',
    actionMessage => {
        const { itemId, tableView } = actionMessage;

        if (!tableView) {
            // tableView can be null when browsing photos from Photohub with inline-compose open
            return;
        }

        if (getUserConfiguration().UserOptions.PreviewMarkAsRead == 'OnSelectionChange') {
            autoMarkItemAsRead(itemId, tableView);
        }
    }
);
