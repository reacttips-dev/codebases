import type TableView from '../store/schema/TableView';
import * as MailRowDataPropertyGetter from '../selectors/mailRowDataPropertyGetter';
import type FlagType from 'owa-service/lib/contract/FlagType';

/**
 * Helper function to get the itemIds to update for flag operation on a row
 * @param flagType flagType to be applied
 * @param rowKeys rowKeys for which to get itemIds
 * @param tableView tableView where rows belong
 */
export default function getItemIdsToUpdateForFlagOperation(
    flagType: FlagType,
    rowKeys: string[],
    tableView: TableView
): string[] {
    // Gather the item ids to be updated by going through each row
    const itemIdsToUpdate = [];
    rowKeys.forEach(rowKey => {
        const itemIds = MailRowDataPropertyGetter.getItemIds(rowKey, tableView);
        if (flagType.FlagStatus == 'Flagged') {
            // For mark as flag, only flag the latest item in the row (if conversation) and put it in the map.
            // It is always the first item in the itemIds array in FindConversation response,
            // regardless of the conversationSortOrder(NewestOnBottom or NewestOnTop).
            itemIdsToUpdate.push(itemIds[0]);
        } else {
            // For unflagging or complete, apply to all items in the conversation
            itemIdsToUpdate.push(...itemIds);
        }
    });

    return itemIdsToUpdate;
}
