import getSpotlightItemByRowKey from '../selectors/getSpotlightItemByRowKey';
import { getStore as getMailStore } from 'owa-mail-store/lib/store/Store';

export default function getSpotlightDonationJson(rowKey: string) {
    const spotlightItem = getSpotlightItemByRowKey(rowKey);

    if (!spotlightItem) {
        return null;
    }

    // Check if we have item in the cache.
    const item = getMailStore().items.get(spotlightItem.itemId);

    // If item isn't found in the cache, then we won't give user option to donate email.
    if (!item) {
        return null;
    }

    return JSON.stringify({
        messageBody: item.UniqueBody?.Value || item.NormalizedBody?.Value || '',
        itemId: item.ItemId.Id,
    });
}
