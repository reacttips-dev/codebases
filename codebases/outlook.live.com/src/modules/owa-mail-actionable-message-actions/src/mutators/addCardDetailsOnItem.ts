import type { CardDetails } from 'owa-actionable-message-v2';
import type { ClientItem } from 'owa-mail-store';
import { mutatorAction } from 'satcheljs';
import { Warning } from '../traceConstants';

const addCardDetailsOnItem = mutatorAction(
    'addCardDetailsOnItem',
    function addCardDetailsOnItem(
        item: ClientItem,
        newCardDetails: CardDetails[],
        errorMessageList?: [string, boolean][]
    ) {
        const { cardDetails } = item.AdaptiveCardData;
        if (cardDetails && cardDetails.length > 0) {
            errorMessageList?.push([Warning.AddCardDuplicate, false]);
            return;
        }

        item.AdaptiveCardData.cardDetails = newCardDetails;
    }
);

export default addCardDetailsOnItem;
