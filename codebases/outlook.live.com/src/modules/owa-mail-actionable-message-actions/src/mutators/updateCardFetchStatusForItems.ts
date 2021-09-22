import type { ClientItem } from 'owa-mail-store';
import { CardFetchStatus } from 'owa-actionable-message-v2';
import { mutatorAction } from 'satcheljs';

const updateCardFetchStatusForItems = mutatorAction(
    'updateCardFetchStatusForItems',
    function updateCardFetchStatusForItems(
        itemList: ClientItem[],
        cardFetchStatus: CardFetchStatus
    ) {
        for (const item of itemList) {
            item.AdaptiveCardData.cardFetchStatus = cardFetchStatus;
        }
    }
);

export default updateCardFetchStatusForItems;
