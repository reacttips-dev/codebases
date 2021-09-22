import { shouldShowRSVP, prepareRSVPItemIfNeeded } from './RSVPUtils';
import type { TableView } from 'owa-mail-list-store';
import type { ItemRow } from 'owa-graph-schema';

/**
 * Determines whether to add the item to the fetch list and returns a flag
 * indicating whether to show the RSVP or not
 * It might happen that this return true then the client will hide it after checking
 * other properties that returns as part of LoadItem
 * @param serviceItem Item payload for the item to be added or updated
 * @param tableView The table view
 * @return shouldShowRSVP flag
 */
export default function getShouldShowRSVPForItemAndPrepareItem(
    serviceItem: ItemRow,
    tableView: TableView
): boolean {
    const itemId = serviceItem.ItemId.Id;
    const itemClass = serviceItem.ItemClass;
    if (shouldShowRSVP(serviceItem.InstanceKey, itemId, itemClass, tableView)) {
        // Do all work needed in order to show the Meeting action button
        // i.e. Fetch item with required properties
        prepareRSVPItemIfNeeded(serviceItem.InstanceKey, itemId, itemClass, tableView);
        return true;
    }

    return false;
}
