import type { ComposeOperation } from 'owa-mail-compose-store';
import type CLPViewState from 'owa-mail-protection-types/lib/schema/clp/CLPViewState';
import type ItemId from 'owa-service/lib/contract/ItemId';
import { action } from 'satcheljs';

export default action(
    'ON_SEND_MESSAGE_SUCCEEDED',
    (
        operation: ComposeOperation,
        referenceItemId: ItemId,
        composeId: string,
        conversationId: string,
        isGroupViewState: boolean,
        clpViewState: CLPViewState
    ) => {
        return {
            operation,
            referenceItemId,
            composeId,
            conversationId,
            isGroupViewState,
            clpViewState,
        };
    }
);
