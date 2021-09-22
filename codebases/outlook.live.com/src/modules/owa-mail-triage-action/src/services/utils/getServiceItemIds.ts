import type ItemId from 'owa-service/lib/contract/ItemId';
import itemId from 'owa-service/lib/factory/itemId';

/**
 * Get the ItemIds in the specified conversations
 * @param itemIdsToUpdate an array of item id strings
 * @return an array of ItemIds for EWS service request
 */
export default function getServiceItemIds(itemIdsToUpdate: string[]): ItemId[] {
    const itemIds = itemIdsToUpdate.map(id => itemId({ Id: id }));
    return itemIds;
}
