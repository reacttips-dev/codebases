import initializeAttachmentsForItem from './initializeAttachmentsForItem';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import shouldInitializeConversationAttachmentWell from '../utils/shouldInitializeConversationAttachmentWell';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import type { ObservableMap } from 'mobx';
import {
    lazyGetConversationAttachmentWellInitialValue,
    lazyInitializeAttachments,
    lazyMergeToConversationAttachmentWell,
    lazySortConversationAttachmentWell,
} from 'owa-attachment-well-data';
import { lazyGetAttachmentsForConversationWell } from 'owa-mail-attachment-previews';
import type { ClientItem } from 'owa-mail-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import { action } from 'satcheljs/lib/legacy';

export interface InitializeAttachmentsForConversationWellState {
    mailStoreItems: ObservableMap<string, ClientItem>;
}

export default action('initializeAttachmentsForConversationWell')(
    async function initializeAttachmentsForConversationWell(
        conversationState: ConversationReadingPaneViewState,
        forceAttachmentInitialize?: boolean,
        state: InitializeAttachmentsForConversationWellState = { mailStoreItems: mailStore.items }
    ) {
        if (shouldInitializeConversationAttachmentWell(conversationState, state.mailStoreItems)) {
            if (!conversationState?.attachmentWell) {
                const [
                    attachmentTypes,
                    parentItemIdMap,
                    itemReceivedTimeMap,
                ] = await lazyGetAttachmentsForConversationWell.importAndExecute(
                    conversationState.conversationId
                );
                const getConversationAttachmentWellInitialValue = await lazyGetConversationAttachmentWellInitialValue.import();
                conversationState.attachmentWell = getConversationAttachmentWellInitialValue(
                    parentItemIdMap,
                    itemReceivedTimeMap
                );
                await lazyInitializeAttachments.importAndExecute(
                    attachmentTypes,
                    conversationState.conversationId.mailboxInfo,
                    conversationState.attachmentWell,
                    true /* forceUpdateAttachmentsInStore */,
                    false /* isInitializationForCompose */
                );
            }
            // go through loaded item parts and add attachments to the convo well
            const itemPartsMapKeys = [...conversationState.itemPartsMap.keys()];
            for (let i = 0; i < itemPartsMapKeys.length; i++) {
                const itemPart = conversationState.itemPartsMap.get(itemPartsMapKeys[i]);
                // itemPartsMap no longer has the item part
                // possibly because the selected conversation was changed
                // during the async operations in this for loop
                if (!itemPart) {
                    continue;
                }
                const item = state.mailStoreItems.get(itemPart.itemId);
                // if item is no longer in cache (moved or deleted)
                // skip to next item part
                if (!item) {
                    continue;
                }
                // call initializeAttachmentsForItem
                // for item parts that are not expanded it will initialize
                // forceAttachmentInitialize is set to true when user navigate back to cached email
                // so that download token will get updated
                // for other cases, it will be no-op because reinitialize flag is false
                await initializeAttachmentsForItem(itemPart, item, forceAttachmentInitialize);
                await lazyMergeToConversationAttachmentWell.importAndExecute(
                    itemPart.attachmentWell,
                    conversationState.attachmentWell,
                    {
                        ...item.ItemId,
                        mailboxInfo: item.MailboxInfo,
                    },
                    item.DateTimeReceived
                );
            }
            await lazySortConversationAttachmentWell.importAndExecute(
                conversationState.attachmentWell,
                isNewestOnBottom()
            );
        }
    }
);
