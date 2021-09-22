import { getItem } from 'owa-mail-store';
import { getBaseItemResponseShape } from 'owa-mail-store/lib/utils/getBaseItemResponseShape';
import type Item from 'owa-service/lib/contract/Item';
import type Message from 'owa-service/lib/contract/Message';
import { action } from 'satcheljs/lib/legacy';
let updateItemRecipients = function updateItemRecipients(originalItem: Item, responseItem: Item) {
    const existingItem: Message = originalItem;
    const newItem: Message = responseItem;
    existingItem.ToRecipients = newItem.ToRecipients;
    existingItem.CcRecipients = newItem.CcRecipients;
    existingItem.BccRecipients = newItem.BccRecipients;
};

updateItemRecipients = action('updateItemRecipients')(updateItemRecipients);

export default async function loadAllRecipientsForItem(item: Item): Promise<void> {
    const itemShape = getBaseItemResponseShape();
    itemShape.MaximumRecipientsToReturn = 0;

    const responseItem = await getItem(item.ItemId.Id, itemShape, 'ItemPart');
    if (!!responseItem && !(responseItem instanceof Error)) {
        updateItemRecipients(item, responseItem);
    }
}
