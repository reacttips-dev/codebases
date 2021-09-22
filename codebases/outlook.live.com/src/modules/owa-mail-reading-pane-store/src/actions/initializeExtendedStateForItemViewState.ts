import initializeAttachmentsForItem from './initializeAttachmentsForItem';
import type ItemViewState from '../store/schema/ItemViewState';
import type { ClientItem } from 'owa-mail-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import { isMeetingRequest, lazyInitializeMeetingRequestViewState } from 'owa-meeting-message';
import { action } from 'satcheljs/lib/legacy';

export interface InitializeExtendedStateForItemViewStateState {
    item: ClientItem;
}

export default action('initializeExtendedStateForItemViewState')(
    async function initializeExtendedStateForItemViewState(
        itemViewState: ItemViewState,
        reinitializeAttachments: boolean = false,
        state: InitializeExtendedStateForItemViewStateState = {
            item: mailStore.items.get(itemViewState.itemId),
        }
    ) {
        await initializeAttachmentsForItem(itemViewState, state.item, reinitializeAttachments);
        state.item &&
            isMeetingRequest(state.item.ItemClass) &&
            lazyInitializeMeetingRequestViewState.importAndExecute(itemViewState);
    }
);
