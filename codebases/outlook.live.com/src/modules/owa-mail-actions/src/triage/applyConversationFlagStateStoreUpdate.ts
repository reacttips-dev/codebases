import type FlagType from 'owa-service/lib/contract/FlagType';
import { action } from 'satcheljs';

export default action(
    'APPLY_CONVERSATION_FLAG_STATE_STORE_UPDATE',
    (conversationIds: string[], flagType: FlagType, tableViewId: string) => ({
        conversationIds,
        flagType,
        tableViewId,
    })
);
