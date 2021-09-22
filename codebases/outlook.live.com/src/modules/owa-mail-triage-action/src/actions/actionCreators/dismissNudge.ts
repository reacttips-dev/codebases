import { action } from 'satcheljs';

export const dismissNudge = action(
    'DISMISS_NUDGE',
    (rowKey: string, tableViewId: string, actionSource: string, itemOrConversationId?: string) => ({
        rowKey,
        tableViewId,
        actionSource,
        itemOrConversationId,
    })
);
