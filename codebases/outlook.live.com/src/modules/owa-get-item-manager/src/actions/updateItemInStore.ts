import { mutatorAction } from 'satcheljs';
import { mailStore, ClientItem } from 'owa-mail-store';
import type Item from 'owa-service/lib/contract/Item';

export default mutatorAction('updateItemInStore', (itemId: string, updatedItem: Item) => {
    const itemInCache = mailStore.items.get(itemId) as ClientItem;
    // If the item is removed from store, don't need to update the item properties
    if (!itemInCache) {
        return;
    }

    const keys = Object.keys(updatedItem);
    keys.forEach(key => {
        if (key == 'ExtendedProperty') {
            itemInCache.ExtendedProperty = [
                ...updatedItem.ExtendedProperty,
                ...itemInCache.ExtendedProperty,
            ];
        } else if (key != 'ItemId') {
            // Do not update ItemId
            itemInCache[key] = updatedItem[key];
        }
    });
});
