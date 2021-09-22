import { TableView, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import { lazyIsFocusedOverridden } from 'owa-mail-focused-inbox-override';

/**
 * Determines whether or not to disable the "Always move to Other folder", which would be
 * disabled if the administrator specifically requested the mail be sent to Focused.
 */
export function isFocusedInboxOverridden(rowKey: string, tableView: TableView) {
    const itemIds = MailRowDataPropertyGetter.getItemIds(rowKey, tableView);
    const latestItemId = itemIds[0];
    const isFocusedOverridden = lazyIsFocusedOverridden.tryImportForRender();
    if (isFocusedOverridden) {
        return isFocusedOverridden(latestItemId);
    }

    return false;
}
