import { PLACEHOLDER_NODE_ITEM_ID } from '../store/schema/PlaceholderNodeIds';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { ClientItem, mailStore } from 'owa-mail-store';
import { action } from 'satcheljs/lib/legacy';

export default action('setLocalLieSentTime')(function setLocalLieSentTime(
    composeViewState: ComposeViewState
) {
    // Stamp a local lie sent time on the item
    const itemId = composeViewState.itemId ? composeViewState.itemId.Id : PLACEHOLDER_NODE_ITEM_ID;
    const item = mailStore.items.get(itemId) as ClientItem;
    if (item) {
        item.localLieSentTime = new Date().toISOString();
    }
});
