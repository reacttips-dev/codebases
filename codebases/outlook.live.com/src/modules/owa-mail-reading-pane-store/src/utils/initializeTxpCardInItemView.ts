import setExtendedCardViewState from '../actions/setExtendedCardViewState';
import { ExtendedCardType } from '../store/schema/ExtendedCardViewState';
import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import type { ClientItem } from 'owa-mail-store';
import type TxpCardViewState from 'txp-data/lib/schema/viewSchema/TxpCardViewState';

export default function initializeTxpCardInItemView(
    readingPaneViewState: ItemReadingPaneViewState,
    item: ClientItem
) {
    setExtendedCardViewState(readingPaneViewState, {
        cardViewState: {
            item: item,
        } as TxpCardViewState,
        cardType: ExtendedCardType.TXP,
        inScrollRegion: true,
    });
}
