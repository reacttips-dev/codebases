import { shouldShowRSVP, prepareRSVPItemIfNeeded } from './RSVPUtils';
import type { TableView } from 'owa-mail-list-store';
import type { ConversationType } from 'owa-graph-schema';
import type ItemId from 'owa-service/lib/contract/ItemId';

/**
 * Determines whether to add the conversation to the fetch list and returns a flag
 * indicating whether to show the RSVP or not
 * It might happen that this return true then the client will hide it after checking
 * other properties that returns as part of LoadItem
 * @param conversationType Conversation payload for the item to be added or updated
 * @param tableView The Table view
 * @return shouldShowRSVP flag
 */
export default function getShouldShowRSVPForConversationAndPrepareItem(
    conversationType: Partial<ConversationType>,
    tableView: TableView
): boolean {
    // Search scenarios and Suggestions click will bring conversation with no ItemClasses
    if (!conversationType.ItemClasses || conversationType.ItemClasses.length === 0) {
        return false;
    }

    // We always use the latest ItemId/ItemClass
    const itemId = (conversationType.ItemIds[0] as ItemId).Id;
    const itemClass = conversationType.ItemClasses[0];
    if (shouldShowRSVP(conversationType.InstanceKey, itemId, itemClass, tableView)) {
        // Do all work needed in order to show the Meeting action button
        // i.e. Fetch item with required properties
        prepareRSVPItemIfNeeded(conversationType.InstanceKey, itemId, itemClass, tableView);
        return true;
    }

    return false;
}
