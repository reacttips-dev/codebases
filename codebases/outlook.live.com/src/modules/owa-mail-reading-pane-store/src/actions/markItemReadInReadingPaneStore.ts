import expandItemPartOnIsReadChanged from './expandItemPartOnIsReadChanged';
import store from 'owa-mail-store/lib/store/Store';
import type Message from 'owa-service/lib/contract/Message';
import { action } from 'satcheljs/lib/legacy';

export interface MarkItemReadInReadingPaneStoreState {
    message: Message;
}

export default action('markItemReadInReadingPane')(function markItemReadInReadingPaneStore(
    itemId: string,
    isReadValueToSet: boolean,
    state: MarkItemReadInReadingPaneStoreState = { message: store.items.get(itemId) }
) {
    if (state?.message) {
        if (state.message.IsRead && !isReadValueToSet && state.message.ConversationId) {
            expandItemPartOnIsReadChanged(state.message.ConversationId.Id, [
                state.message.InternetMessageId,
            ]);
        }
        state.message.IsRead = isReadValueToSet;
    }
});
