import type { TableView } from 'owa-mail-list-store';
import { action } from 'satcheljs';
import type { ActionType } from './userMailInteractionAction';

export default action(
    'DELETE_CONVERSATION_STORE_UPDATE',
    (conversationIds: string[], tableView: TableView, actionType: ActionType) => ({
        conversationIds,
        tableView,
        actionType,
    })
);
