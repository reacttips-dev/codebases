import { isItemOfMessageType } from 'owa-mail-list-store';
import store from 'owa-mail-store/lib/store/Store';
import type Message from 'owa-service/lib/contract/Message';

/**
 * Filter the items by its isRead value
 * @param itemId the item id
 * @param isReadValue the isRead value to be set
 * @return the filtered itemIds to be updated
 */
export default function filterItemsByIsReadValue(
    itemIds: string[],
    isReadValue: boolean
): string[] {
    const itemIdsToUpdate: string[] = [];
    itemIds.forEach(itemId => {
        const item = store.items.get(itemId);
        if (isItemOfMessageType(item) && item && (item as Message).IsRead != isReadValue) {
            itemIdsToUpdate.push(itemId);
        }
    });

    return itemIdsToUpdate;
}
