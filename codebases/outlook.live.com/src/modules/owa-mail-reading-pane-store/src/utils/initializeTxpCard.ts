import type Message from 'owa-service/lib/contract/Message';
import setExtendedCardViewState from '../actions/setExtendedCardViewState';
import type TxpCardViewState from 'txp-data/lib/schema/viewSchema/TxpCardViewState';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { ExtendedCardType } from '../store/schema/ExtendedCardViewState';

export default function initializeTxpCard(
    conversationViewState: ConversationReadingPaneViewState,
    item: Message
) {
    setExtendedCardViewState(conversationViewState, {
        cardViewState: {
            item: item,
        } as TxpCardViewState,
        cardType: ExtendedCardType.TXP,
        inScrollRegion: true,
    });
}
