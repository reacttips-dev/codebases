import { removeMeetingMessagesFromStore } from '../actions/publicActions';
import { getStore as getListViewStore } from 'owa-mail-list-store';
import { mutator } from 'satcheljs';

mutator(removeMeetingMessagesFromStore, actionMessage => {
    const { itemIds } = actionMessage;
    const store = getListViewStore();
    itemIds.forEach(itemId => {
        // This is a cheap way to make sure that the item is deleted and we dont show as Loading on the LV
        // Mobx might call render on the RSVP components, before the MailListItem render gets called
        // Since this is a clean up, it can get executed as a lower priority task
        if (store.meetingMessageItems.has(itemId)) {
            setTimeout(() => {
                store.meetingMessageItems.delete(itemId);
            }, 1000);
        }
    });
});
