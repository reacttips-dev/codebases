import type { ApplyConversationActionContext } from 'owa-mail-triage-action-utils';
import { getTableConversationRelation, isFolderPaused, listViewStore } from '../index';
import { getISOString } from 'owa-datetime';

/**
 * Gets contextual information for ApplyConversationAction for a given conversation
 */
export default function getApplyConversationActionContext(
    conversationRowKey: string,
    tableViewId: string
): ApplyConversationActionContext {
    const tableConversationRelation = getTableConversationRelation(conversationRowKey, tableViewId);
    let conversationLastSyncTimeStamp = null;

    if (isFolderPaused(listViewStore.tableViews.get(tableViewId).tableQuery.folderId)) {
        conversationLastSyncTimeStamp = getISOString(listViewStore.inboxPausedDateTime);
    } else if (tableConversationRelation) {
        conversationLastSyncTimeStamp = new Date(
            tableConversationRelation.lastModifiedTimeStamp
        ).toISOString();
    }

    return <ApplyConversationActionContext>{
        //TODO: use ClientItemId type in ApplyConversationActionContext: 23338
        // Work Item 27629: Remove workaround for timezone issue (sending requests in UTC time zone)
        conversationId: tableConversationRelation.id,
        conversationLastSyncTimeStamp: conversationLastSyncTimeStamp,
    };
}
