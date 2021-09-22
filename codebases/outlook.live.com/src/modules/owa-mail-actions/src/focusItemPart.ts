import { action } from 'satcheljs';
import type { MailListItemSelectionSource } from 'owa-mail-store';

/**
 * Called when an item part is focused
 * @param nodeId the nodeId of the focused item part
 * @param mailListItemSelectionSource The source of selection on item part
 */
export default action(
    'FOCUS_ITEM_PART',
    (nodeId: string, mailListItemSelectionSource: MailListItemSelectionSource) => ({
        nodeId,
        mailListItemSelectionSource,
    })
);
