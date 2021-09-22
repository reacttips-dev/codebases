import type Item from 'owa-service/lib/contract/Item';
import { action } from 'satcheljs';

/**
 * Action to try remove an item's normalized body
 * @param item - Id of item attempting to remove the normalized body from
 */
export default action('TRY_REMOVE_ITEM_NORMALIZED_BODY', (item: Item) => {
    return {
        item,
    };
});
