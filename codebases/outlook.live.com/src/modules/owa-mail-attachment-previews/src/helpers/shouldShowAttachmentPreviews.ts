import { lazyAddAttachmentPreviews } from '../index';
import { listViewStore, ListViewStore, TableQuery, TableQueryType } from 'owa-mail-list-store';
import { getMailboxInfoFromTableQuery } from 'owa-mail-mailboxinfo';
import { mailStore } from 'owa-mail-store';
import type { ConversationType, ItemRow } from 'owa-graph-schema';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import doesConversationContainSmimeItem from 'owa-smime/lib/utils/doesConversationContainSmimeItem';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import { isFeatureEnabled } from 'owa-feature-flags';

export interface ShouldShowAttachmentPreviewsState {
    listViewStore: ListViewStore;
}

/**
 * Determines whether to add the item to the fetch list and returns a flag
 * indicating whether to show the attachment previews or not.
 * HasAttachments does not guarantee that we will always receive the attachment previews
 * for the item.There are cases when the files folder may not have any attachment entries
 * for certain file types (e.g. audio, video)
 * @param serviceItem Item payload for the item to be added or updated
 * @param tableQuery Table query of the table where the item belongs
 * @return attachmentPreviewFlags
 */
export function shouldShowAttachmentPreviewsForItem(serviceItem: ItemRow, tableQuery: TableQuery) {
    // Case - Junk folder
    // Do not show inline previews in the junk email folder.
    if (tableQuery.folderId && folderIdToName(tableQuery.folderId) == 'junkemail') {
        return false;
    }

    if (isSMIMEItem(serviceItem)) {
        return false;
    }

    const existingItem = mailStore.items.get(serviceItem.ItemId.Id);
    if (existingItem?.shouldShowAttachmentPreviews) {
        //Do not fetch attachment previews again if it has already been fetched
        return true;
    }
    // Item does not have attachments. Items today do not return
    // HasAttachmentPreviews flag, so we are falling back to use HasAttachments
    // which is true when there are classic attachments attached to the item
    // Which means it does not include the inline images
    // We also check if there is any sharepoint link on the item
    if (
        !serviceItem.HasAttachments &&
        (!isFeatureEnabled('doc-linkDiscovery-useNewProperty') ||
            !serviceItem.HasProcessedSharepointLink)
    ) {
        return false;
    }

    // Add the item id to the fetch list
    // Also add the conversationId for this item as we will fetch previews
    // for this item using GetAttachmentPreviews which only understands conversations today.
    lazyAddAttachmentPreviews.importAndExecute(
        getMailboxInfoFromTableQuery(tableQuery),
        serviceItem.ConversationId,
        serviceItem.ItemId.Id
    );

    return true;
}

/**
 * Determines whether to add the conversation to the fetch list and returns a flag
 * indicating whether to show the attachment previews or not.
 * HasAttachmentPreviews does not guarantee that we will always receive the attachment previews
 * for the conversation.There are cases when the files folder may not have any attachment entries
 * for certain file types (e.g. audio, video)
 * @param conversationType Conversation payload for the conversation to be added or updated
 * @param tableQuery Table query of the table where the conversation belongs
 * @return attachmentPreviewFlags
 */
export let shouldShowAttachmentPreviewsForConversation = function shouldShowAttachmentPreviewsForConversation(
    conversationType: Partial<ConversationType>,
    tableQuery: TableQuery,
    state: ShouldShowAttachmentPreviewsState = { listViewStore: listViewStore }
): boolean {
    const isSearchTable = tableQuery.type == TableQueryType.Search;
    const conversationId = conversationType.ConversationId;
    const existingConversation = state.listViewStore.conversationItems.get(conversationId.Id);
    const hasSharepointLink =
        isFeatureEnabled('doc-linkDiscovery-useNewProperty') &&
        conversationType.HasProcessedSharepointLink;
    // Case - Junk folder
    // Do not show inline previews in the junk email folder.
    if (tableQuery.folderId && folderIdToName(tableQuery.folderId) == 'junkemail') {
        return false;
    }
    if (doesConversationContainSmimeItem(conversationType)) {
        return false;
    }
    let shouldGetAttachmentPreviews;
    let shouldShowAttachmentPreviews;
    // Case 1 - Search Table
    if (isSearchTable) {
        // If this is a conversation in the search table
        // check if the conversation existed and use its shouldShowAttachmentPreviews property
        // else check HasAttachments and HasProcessedSharepointLink instead
        if (existingConversation?.shouldShowAttachmentPreviews) {
            //Do not fetch attachment previews again if it has already been fetched
            return true;
        }
        shouldShowAttachmentPreviews = !!conversationType.HasAttachments || hasSharepointLink;
        shouldGetAttachmentPreviews = shouldShowAttachmentPreviews;
    } else if (!conversationType.HasAttachmentPreviews && !hasSharepointLink) {
        // Case 2: HasAttachmentPreviews and HasSharepointLink are false, don't get or show the previews
        return false;
    } else {
        // Case 3: HasAttachmentPreviews or HasSharepointLink are true
        // Case 3.1: This is an update on the existing conversation, determine whether to get & show the previews
        if (existingConversation && !hasSharepointLink) {
            if (
                existingConversation.globalItemIds.length == conversationType.GlobalItemIds.length
            ) {
                // Case 3.1.1: If the number of items remained same it means that there was actually no change in the number of attachments
                // Since we know there are no attachment-related changes, we can set shouldGetAttachmentPreviews to false.
                shouldGetAttachmentPreviews = false;
            } else {
                // Case 3.1.2: If the collection length has changed, it’s possible there are new previews.
                shouldGetAttachmentPreviews = true;
            }
            // As this is an update on the existing conversation we will not optimistically leave a blank space for it,
            // instead we will try to match the existing state of [expand/collapse] of it.
            // E.g. if the conversation was already showing previews, it will remain expanded.
            shouldShowAttachmentPreviews = existingConversation.shouldShowAttachmentPreviews;
        } else {
            // Case 3.2: This conversation does not exist on client
            // or conversation has a sharepoint link
            shouldGetAttachmentPreviews = true;
            shouldShowAttachmentPreviews = true;
        }
    }
    // Add the conversation id to the fetch list
    if (shouldGetAttachmentPreviews) {
        lazyAddAttachmentPreviews.importAndExecute(
            getMailboxInfoFromTableQuery(tableQuery),
            conversationType.ConversationId,
            null /* itemId */
        );
    }
    return shouldShowAttachmentPreviews;
};
