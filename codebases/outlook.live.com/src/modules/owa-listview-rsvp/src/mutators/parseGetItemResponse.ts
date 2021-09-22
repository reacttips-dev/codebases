import { parseGetItemResponseAction } from '../actions/parseGetItemResponseAction';
import { getStore as getListViewStore } from 'owa-mail-list-store';
import type { ClientItem } from 'owa-mail-store';
import { mutator } from 'satcheljs';

mutator(parseGetItemResponseAction, actionMessage => {
    const { items, clientItemIds } = actionMessage;
    for (let i = 0; i < items.length; i++) {
        const responseItem = items[i];
        const itemId = clientItemIds[i];
        const cachedItem = getListViewStore().meetingMessageItems.get(itemId.Id);
        if (cachedItem) {
            const keys = Object.keys(cachedItem);
            keys.forEach(key => {
                // Update the cache properties if defined/non-null in the
                // response item
                if (responseItem[key]) {
                    cachedItem[key] = responseItem[key];
                }
            });
        } else {
            const newItem: ClientItem = {
                ...responseItem,
                MailboxInfo: itemId.mailboxInfo,
                SmartTimeData: null,
                SmartTimeExtendedProperty: null,
                smartPillFeedbackSubmitted: false,
            };

            getListViewStore().meetingMessageItems.set(itemId.Id, newItem);
        }
    }
});
