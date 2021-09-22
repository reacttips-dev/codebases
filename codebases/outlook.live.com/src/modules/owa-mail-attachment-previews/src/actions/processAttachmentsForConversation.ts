import { action } from 'satcheljs/lib/legacy';
import type ConversationType from 'owa-service/lib/contract/ConversationType';
import type { MailboxInfo } from 'owa-client-ids';
import type ListViewStore from 'owa-mail-list-store/lib/store/schema/ListViewStore';
import getDedupedInlinePreviews from '../helpers/getDedupedInlinePreviews';
import { logVerboseUsage } from 'owa-analytics';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import type AttachmentPreview from 'owa-service/lib/contract/AttachmentPreview';
import { getFilteredPreviews, processAttachmentsForRow } from './processAttachmentsForRow';
import removeAttachmentPreviewsForRow from './removeAttachmentPreviewsForRow';

export interface ProcessAttachmentState {
    listView: ListViewStore;
}

// CTQ marker when getAttachmentPreviews returned no previews for a conversation
const INLINEPREVIEWS_FALSEPOSITIVE: string = 'IP_FP';
const INLINEPREVIEWS_INLINEIMAGE_DUP: string = 'IP_II_DP';

/**
 * Create the attachment well view state for the conversation
 * @param conversation - conversation payload from the getAttachmentPreviews response
 */
export const processAttachmentsForConversation = action('processAttachmentsForConversation')(
    function processAttachmentsForConversation(
        conversation: ConversationType,
        mailboxInfo: MailboxInfo,
        state: ProcessAttachmentState = { listView: listViewStore }
    ) {
        const conversationItem = state.listView.conversationItems.get(
            conversation.ConversationId.Id
        );
        // Conversation may have been removed on the client, in which case we ignore the response
        if (!conversationItem) {
            return;
        }
        /** We will filter attachments that are missing information
         * since FAST seems to leave entries on the files folder that are not cleaned up
         */
        let filteredPreviews: AttachmentPreview[] = [];
        if (conversation.AttachmentPreviews?.Previews) {
            filteredPreviews = getFilteredPreviews(conversation.AttachmentPreviews.Previews);
        }
        if (filteredPreviews.length > 0) {
            /**
             * Step 1 - De-dupe previews for conversations
             * Most of the times the duplicates that we have seen have same file name but the size is different
             * This happens when the conversation is getting updated in different outlook clients.
             */
            const dedupedPreviews = getDedupedInlinePreviews(
                conversation.AttachmentPreviews.Previews
            );
            // Step 2 - process deduped previews for conversation
            processAttachmentsForRow(conversation.ConversationId.Id, dedupedPreviews, mailboxInfo);
            // Log number of inline images that were deduped
            const numOfInlineImagesDeduped =
                conversation.AttachmentPreviews.Previews.length - dedupedPreviews.length;
            if (numOfInlineImagesDeduped > 0) {
                logVerboseUsage(INLINEPREVIEWS_INLINEIMAGE_DUP, [numOfInlineImagesDeduped]);
            }
        } else {
            // Set this flag so that the placeholder space is removed.
            conversationItem.shouldShowAttachmentPreviews = false;
            removeAttachmentPreviewsForRow(conversation.ConversationId.Id);
            // Log everytime we did not receive any attachment previews
            logVerboseUsage(INLINEPREVIEWS_FALSEPOSITIVE);
        }
    }
);

/**
 * Process attachment previews for the conversations
 * @param conversations received in the GetAttachmentPreviews response
 * @param mailboxInfo
 */
export function processAttachmentPreviewsForConversations(
    conversations: ConversationType[],
    mailboxInfo: MailboxInfo
) {
    conversations.forEach(conversation => {
        processAttachmentsForConversation(conversation, mailboxInfo);
    });
}
