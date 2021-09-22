import { onFluidFileInserted } from 'owa-fluid-link';
import { orchestrator } from 'satcheljs';
import findComposeViewStateById, { IdSource } from '../utils/findComposeViewStateById';
import getPrimaryFromAddress from '../utils/fromAddressUtils/getPrimaryFromAddress';
import { tryAddRecipientFromEmailAddressString } from '../utils/tryAddRecipientFromEmailAddressString';

orchestrator(onFluidFileInserted, actionMessage => {
    const composeViewState = findComposeViewStateById(actionMessage.viewStateId, IdSource.Compose);
    if (composeViewState) {
        const fromAddress: string = getPrimaryFromAddress();
        tryAddRecipientFromEmailAddressString(composeViewState, fromAddress, true /* addToCC */);
    }
});
