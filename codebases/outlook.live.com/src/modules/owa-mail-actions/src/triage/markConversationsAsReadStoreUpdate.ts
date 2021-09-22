import { action } from 'satcheljs';

export default action(
    'MARK_CONVERSATIONS_AS_READ_STORE_UPDATE',
    (conversationIds: string[], tableViewId: string, isReadValue: boolean, isExplicit: boolean) => {
        return {
            conversationIds,
            tableViewId,
            isReadValue,
            isExplicit,
        };
    }
);
