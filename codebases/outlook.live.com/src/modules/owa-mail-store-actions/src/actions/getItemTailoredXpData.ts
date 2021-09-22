import type { ObservableMap } from 'mobx';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import { loadTailoredXpData, mailStore, TailoredXpData } from 'owa-mail-store';
import type Item from 'owa-service/lib/contract/Item';
import type Message from 'owa-service/lib/contract/Message';
import { createCalendarPerfDatapoint } from 'owa-shared-analytics';
import { action } from 'satcheljs/lib/legacy';

export interface GetTailoredXpDataState {
    items: ObservableMap<string, Item>;
}

export default action('getItemTailoredXpData')(function getItemTailoredXpData(
    newItem: Message,
    state: GetTailoredXpDataState = { items: mailStore.items }
) {
    const newItemId = newItem.ItemId.Id;
    const newTxpEntitiesChangeNumber = newItem.TailoredXpEntitiesChangeNumber;
    if (newTxpEntitiesChangeNumber && newTxpEntitiesChangeNumber > 0) {
        const oldItem = state.items.get(newItemId);
        // oldItem refers to an item with the same ID (read: the same item) that already lives in the client's mailStore.
        // If the newItem has a TxPChangeNumber, the oldItem should too.
        // This portion of the if statement is meant to capture updates to an existing item.
        // But intermittently we were seeing old items with the change number undefined which was causing us to not load the txp cards.
        // If we do see an undefined value we should change it to 0 otherwise oldItem.TailoredXpEntitiesChangeNumber < newItem.TailoredXpEntitiesChangeNumber will fail.
        const oldTailoredXpEntitiesChangeNumber = oldItem?.TailoredXpEntitiesChangeNumber
            ? oldItem.TailoredXpEntitiesChangeNumber
            : 0;
        if (
            (!oldItem || oldTailoredXpEntitiesChangeNumber < newTxpEntitiesChangeNumber) &&
            !newItem.TailoredXpEntities
        ) {
            // If the old item doesn't exist, or its change number is different and the new item doesn't already have the TxP data, load it.
            const datapoint = new PerformanceDatapoint('RPPerfGetTailoredXpData');
            const TxpDatapoint = createCalendarPerfDatapoint('TXPLoadMail');
            loadTailoredXpData(newItemId)
                .then(
                    action('updateTailoredXpEntities')(function updateTailoredXpEntities(
                        tailoredXpData: TailoredXpData
                    ) {
                        const itemInCache = state.items.get(newItemId) as Message;
                        if (itemInCache) {
                            itemInCache.TailoredXpEntities = tailoredXpData.TailoredXpEntities;
                            itemInCache.TailoredXpCalendarEventIds =
                                tailoredXpData.TailoredXpCalendarEventIds;
                            itemInCache.TailoredXpEntitiesStatus =
                                tailoredXpData.TailoredXpEntitiesStatus;
                            itemInCache.EntityNamesMap = tailoredXpData.EntityNamesMap;
                        }
                        datapoint.end();
                        TxpDatapoint.end();
                    })
                )
                .catch(error => {
                    datapoint.endWithError(DatapointStatus.ServerError, error);
                    TxpDatapoint.endWithError(DatapointStatus.ServerError, error);
                });
        }
    }
});
