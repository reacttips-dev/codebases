import type { ClientItem } from 'owa-mail-store';
import type Item from 'owa-service/lib/contract/Item';

export default function (newItem: Item, itemInCache: ClientItem) {
    const keys = Object.keys(itemInCache);
    keys.forEach(key => {
        // For each property that exists on the item in the cache, set it on the new item if it doesn't already have it.
        if (newItem[key] === undefined) {
            newItem[key] = itemInCache[key];
        }
    });
}
