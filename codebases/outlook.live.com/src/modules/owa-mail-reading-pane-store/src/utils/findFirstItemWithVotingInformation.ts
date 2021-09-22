import type Message from 'owa-service/lib/contract/Message';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { getStore as getMailStore } from 'owa-mail-store/lib/store/Store';
import getAllItemPartsShownInConversation from './getAllItemPartsShownInConversation';

export default function findFirstItemWithVotingInformation(
    conversationViewState: ConversationReadingPaneViewState
): Message {
    const itemParts = getAllItemPartsShownInConversation(
        conversationViewState,
        false /* getNewestItemFirst */
    );
    const mailStore = getMailStore();

    if (!itemParts) {
        return null;
    }

    for (let index = 0; index < itemParts.length; index++) {
        const item = mailStore.items.get(itemParts[index].itemId) as Message;
        if (item?.VotingInformation) {
            return item;
        }
    }

    return null;
}
