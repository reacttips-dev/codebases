import type { CardDetails } from 'owa-actionable-message-v2';
import type { ClientItem } from 'owa-mail-store';
import { mutatorAction } from 'satcheljs';

const updateCardDetailsOnItem = mutatorAction(
    'updateCardDetailsOnItem',
    function updateCardDetailsOnItem(item: ClientItem, cardDetails: CardDetails[]) {
        item.AdaptiveCardData.cardDetails = cardDetails;
    }
);

export default updateCardDetailsOnItem;
