import { processAttachmentPreviewsForItems, getFilteredPreviews } from './processAttachmentsForRow';
import { processAttachmentPreviewsForConversations } from './processAttachmentsForConversation';
import getAttachmentPreviews from '../services/getAttachmentPreviews';
import type { MailboxInfo, ClientItemId } from 'owa-client-ids';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type GetAttachmentPreviewsResponse from 'owa-service/lib/contract/GetAttachmentPreviewsResponse';
import type ItemId from 'owa-service/lib/contract/ItemId';
import { action } from 'satcheljs/lib/legacy';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { listViewStore } from 'owa-mail-list-store';
import { mailStore } from 'owa-mail-store';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getMailboxRequestOptions } from 'owa-request-options-types';

/**
 * List to store the conversation Ids to get the attachment previews for
 */
const rowIdsToGetPreviewsMap: Map<string, RowIdsToGetPreviews> = new Map(); // Map<groupSmtp, RowIdsToGetPreviews>

export interface AttachmentPreviewOperationState {
    rowIdsToGetPreviewsMap: Map<string, RowIdsToGetPreviews>;
}

export interface RowIdsToGetPreviews {
    conversationsIdsArray: ItemId[];
    itemIdsArray: string[];
}

/**
 * Adds the conversationId to the fetch list
 * @param mailboxInfo associated with the table to which the rows belongs
 * @param conversationId which needs to be added to the fetch list.
 * @param itemId itemId of the row for which to fetch the previews using its conversation id
 */
export let add = action('AttachmentPreviewsOperations.add')(function add(
    mailboxInfo: MailboxInfo,
    conversationId: ItemId,
    itemId: string,
    state: AttachmentPreviewOperationState = { rowIdsToGetPreviewsMap: rowIdsToGetPreviewsMap }
) {
    let rowIdsToGetPreviewsFor: RowIdsToGetPreviews =
        state.rowIdsToGetPreviewsMap[mailboxInfo?.mailboxSmtpAddress];
    // Create entry for the rowIds if it does not exist
    if (!rowIdsToGetPreviewsFor) {
        rowIdsToGetPreviewsFor = {
            conversationsIdsArray: [],
            itemIdsArray: [],
        };
        state.rowIdsToGetPreviewsMap[mailboxInfo?.mailboxSmtpAddress] = rowIdsToGetPreviewsFor;
    }
    // Add conversationId to the fetch list if it does not exist
    if (!rowIdsToGetPreviewsFor.conversationsIdsArray.some(cid => cid.Id == conversationId.Id)) {
        rowIdsToGetPreviewsFor.conversationsIdsArray.push(conversationId);
    }
    // Add itemId to the fetch list if it does not exist
    if (rowIdsToGetPreviewsFor.itemIdsArray.indexOf(itemId) == -1) {
        rowIdsToGetPreviewsFor.itemIdsArray.push(itemId);
    }
});

/**
 * Makes a call to getAttachmentPreviews
 */
export let getPreviews = action('AttachmentPreviewsOperations.getPreviews')(
    async function getPreviews(
        mailboxInfo: MailboxInfo,
        listViewType: ReactListViewType,
        state: AttachmentPreviewOperationState = { rowIdsToGetPreviewsMap: rowIdsToGetPreviewsMap }
    ) {
        const rowIdsToGetPreviews = state.rowIdsToGetPreviewsMap[mailboxInfo?.mailboxSmtpAddress];
        // Early return if we do not have any entry for in the fetch list
        if (!rowIdsToGetPreviews) {
            return Promise.resolve();
        }
        const conversationIds: ItemId[] = rowIdsToGetPreviews.conversationsIdsArray;
        const itemIds: string[] = rowIdsToGetPreviews.itemIdsArray;
        // Only include inline images for consumer mailboxes
        const shouldIncludeInlineImages = isConsumer();
        // Clear the entry
        delete state.rowIdsToGetPreviewsMap[mailboxInfo?.mailboxSmtpAddress];
        try {
            // Make service call to get attachment previews
            return getAttachmentPreviews(conversationIds, getMailboxRequestOptions(mailboxInfo), {
                IncludeInlineAttachments: shouldIncludeInlineImages,
            })
                .then(response => {
                    // Sometimes even though the response code is 200, the response may be an exception message
                    // due to some exception that happened server-side, we have to treat this as failure as well
                    if (response.Conversations !== undefined) {
                        if (listViewType == ReactListViewType.Message) {
                            processAttachmentPreviewsForItems(
                                response.Conversations,
                                itemIds,
                                mailboxInfo
                            );
                        } else {
                            processAttachmentPreviewsForConversations(
                                response.Conversations,
                                mailboxInfo
                            );
                        }
                    } else {
                        handleGetAttachmentPreviewsFail(listViewType, itemIds, conversationIds);
                    }
                })
                .catch(() => {
                    handleGetAttachmentPreviewsFail(listViewType, itemIds, conversationIds);
                });
        } catch (error) {
            handleGetAttachmentPreviewsFail(listViewType, itemIds, conversationIds);
        }

        return Promise.resolve();
    }
);

/**
 * Handle the getAttachmentPreview call failure
 * @param listViewType the type of the list view
 * @param itemIds the itemIds if this is for the message view
 * @param conversationIds the ids of the conversations if this is for conversation view
 */
function handleGetAttachmentPreviewsFail(
    listViewType: ReactListViewType,
    itemIds: string[],
    conversationIds: ItemId[]
) {
    if (listViewType == ReactListViewType.Message) {
        itemIds.forEach(itemId => {
            const clientItem = mailStore.items.get(itemId);

            // If the message has already been deleted, no clean up is necessary
            if (!clientItem) {
                return;
            }

            // Check if we are already showing previews for this row, if we are then we do not want to hide them.
            // Else we want to hide the space allocated for the previews as the call to get the previews failed.
            const attachmentPreviewWellViewState = listViewStore.rowAttachmentPreviewWellViews.get(
                itemId
            );

            if (!attachmentPreviewWellViewState) {
                clientItem.shouldShowAttachmentPreviews = false;
            }
        });
    } else {
        conversationIds.forEach(conversationId => {
            const convId = conversationId.Id;
            const conversationItem = listViewStore.conversationItems.get(convId);

            // If the conversation has already been deleted, no clean up is necessary
            if (!conversationItem) {
                return;
            }

            // Check if we are already showing previews for this row, if we are then we do not want to hide them.
            // Else we want to hide the space allocated for the previews as the call to get the previews failed.
            const attachmentPreviewWellViewState = listViewStore.rowAttachmentPreviewWellViews.get(
                convId
            );

            if (!attachmentPreviewWellViewState) {
                conversationItem.shouldShowAttachmentPreviews = false;
            }
        });
    }
}

/**
 * Makes a call to getAttachmentPreviews. This is currently used in the conversation well in the reading pane
 */
export const getAttachmentsForConversationWell = action(
    'AttachmentPreviewsOperations.getAttachmentsForConversationWell'
)(function getAttachmentsForConversationWell(
    conversationId: ClientItemId
): Promise<[AttachmentType[], { [index: string]: ClientItemId }, { [index: string]: string }]> {
    const conversationIds: ItemId[] = [conversationId];
    const attachmentTypes: AttachmentType[] = [];
    const parentItemIdMap: { [index: string]: ClientItemId } = {};
    const itemReceivedTimeMap: { [index: string]: string } = {};

    try {
        return getAttachmentPreviews(
            conversationIds,
            getMailboxRequestOptions(conversationId.mailboxInfo),
            {
                FullPreviewsPerConversation: 300,
                PreviewsPerConversation: 300,
                MinimumAttachmentSize: 0,
                IncludeInlineAttachments: false,
            }
        )
            .then((response: GetAttachmentPreviewsResponse) => {
                if (response.Conversations !== undefined) {
                    response.Conversations.forEach(conversation => {
                        if (
                            conversation.ConversationId.Id == conversationId.Id &&
                            conversation.AttachmentPreviews &&
                            conversation.AttachmentPreviews.Previews
                        ) {
                            const filteredPreviews = getFilteredPreviews(
                                conversation.AttachmentPreviews.Previews
                            );

                            filteredPreviews.forEach(preview => {
                                attachmentTypes.push(preview.Attachment);
                                parentItemIdMap[preview.Attachment.AttachmentId.Id] = {
                                    ...preview.ParentItemId,
                                    mailboxInfo: conversationId.mailboxInfo,
                                };
                                itemReceivedTimeMap[preview.Attachment.AttachmentId.Id] =
                                    preview.ItemReceivedTime;
                            });
                        }
                    });
                }

                return [attachmentTypes, parentItemIdMap, itemReceivedTimeMap];
            })
            .catch(() => {
                return [attachmentTypes, parentItemIdMap, itemReceivedTimeMap] as any;
            });
    } catch (error) {
        // no clean up is needed
    }

    return Promise.resolve([attachmentTypes, parentItemIdMap, itemReceivedTimeMap]);
});
