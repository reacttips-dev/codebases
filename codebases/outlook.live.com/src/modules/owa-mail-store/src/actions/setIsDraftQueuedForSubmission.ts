import type ClientItem from '../store/schema/ClientItem';
import { getStore } from '../store/Store';
import type ItemId from 'owa-service/lib/contract/ItemId';
import { mutatorAction } from 'satcheljs';

// Sets flag for indicating a draft is queued for submission, i.e. in the state Delay or Sending
export default mutatorAction(
    'setIsDraftQueuedForSubmission',
    (itemId: ItemId, isDraftQueuedForSubmission: boolean) => {
        const item: ClientItem = getStore().items.get(itemId?.Id);
        if (item) {
            item.isDraftQueuedForSubmission = isDraftQueuedForSubmission;
        }
    }
);
