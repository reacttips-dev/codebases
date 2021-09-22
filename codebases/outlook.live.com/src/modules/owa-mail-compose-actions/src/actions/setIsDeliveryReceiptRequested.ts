import type { ComposeViewState } from 'owa-mail-compose-store';
import { mutatorAction } from 'satcheljs';

// VSO 32823: Instead of passing in the composeViewState, we should pass in an identifier that can be used to look up the
// composeViewState from the store. As actions are dispatched, there is a possibility we no longer have a reference to the
// most recent version of the composeViewState object by the time we execute this code. Whenever objects need to be mutated,
// they should be fetched from teh store.
export default mutatorAction(
    'setIsDeliveryReceiptRequested',
    function setIsDeliveryReceiptRequested(
        composeViewState: ComposeViewState,
        isDeliveryReceiptRequested: boolean
    ) {
        if (composeViewState.isDeliveryReceiptRequested !== isDeliveryReceiptRequested) {
            composeViewState.isDeliveryReceiptRequested = isDeliveryReceiptRequested;
            composeViewState.isDirty = true;
        }
    }
);
