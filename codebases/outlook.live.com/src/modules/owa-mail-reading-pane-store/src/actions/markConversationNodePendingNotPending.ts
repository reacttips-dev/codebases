import updateLoadedConversation from './updateLoadedConversation';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { translateEwsIdsToEwsImmutableIds } from 'owa-immutable-id';
import { isImmutableId } from 'owa-immutable-id-store';
import formatTextToHTML from 'owa-mail-compose-actions/lib/utils/formatTextToHTML';
import getRecipientsFromWellViewState from 'owa-mail-compose-actions/lib/utils/getRecipientsFromWellViewState';
import { TableQueryType } from 'owa-mail-list-store';
import getSelectedTableView from 'owa-mail-list-store/lib/utils/getSelectedTableView';
import { LocalLieState } from 'owa-mail-store/lib/store/schema/LocalLieState';
import mailStore from 'owa-mail-store/lib/store/Store';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import bodyContentType from 'owa-service/lib/factory/bodyContentType';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import { action } from 'satcheljs/lib/legacy';
import type { ObservableMap } from 'mobx';
import type { ComposeViewState } from 'owa-mail-compose-store';
import type CollectionChange from 'owa-mail-store/lib/store/schema/CollectionChange';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import type ConversationReadingPaneNode from 'owa-mail-store/lib/store/schema/ConversationReadingPaneNode';
import type BodyType from 'owa-service/lib/contract/BodyType';
import type FlagType from 'owa-service/lib/contract/FlagType';
import type Item from 'owa-service/lib/contract/Item';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type Message from 'owa-service/lib/contract/Message';
import type RecipientCountsType from 'owa-service/lib/contract/RecipientCountsType';
import {
    PLACEHOLDER_NODE_INTERNET_MESSAGE_ID,
    PLACEHOLDER_NODE_ITEM_ID,
} from '../store/schema/PlaceholderNodeIds';
import {
    HTML_BODY_TYPE,
    TEXT_BODY_TYPE,
} from 'owa-mail-compose-actions/lib/utils/getDefaultBodyType';

export interface MarkConversationNodePendingNotPendingState {
    conversations: ObservableMap<string, ConversationItemParts>;
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>;
    items: ObservableMap<string, Item>;
}

export default action('markConversationNodePendingNotPending')(
    async function markConversationNodePendingNotPending(
        composeViewState: ComposeViewState,
        markAsPending: boolean,
        state: MarkConversationNodePendingNotPendingState = {
            conversations: mailStore.conversations,
            conversationNodes: mailStore.conversationNodes,
            items: mailStore.items,
        }
    ) {
        // If in search view, simply return. Because we don’t subscribe to row notifications in search view, we’d never get an updated item to replace the pending node.
        const tableView = getSelectedTableView();
        if (!tableView || tableView.tableQuery.type == TableQueryType.Search) {
            return;
        }
        const conversationId = composeViewState?.conversationId;
        // This action can be called asynchronously. Get the conversationItemParts for this conversation but simply return if it doesn't exist.
        const conversationItemParts = state.conversations.get(conversationId);
        if (!conversationItemParts) {
            return;
        }
        // Initialize the collection change arrays.
        const nodeIdCollectionChange: CollectionChange<string> = {
            added: [],
            removed: [],
            modified: [],
        };
        let itemId = composeViewState.itemId ? composeViewState.itemId.Id : null;
        itemId =
            !!itemId &&
            isHostAppFeatureEnabled('nativeResolvers') &&
            isFeatureEnabled('mon-conv-useHx') &&
            !isImmutableId(itemId)
                ? await translateEwsIdsToEwsImmutableIds([itemId])[0]?.TargetId
                : itemId;
        // If we don't have an itemId, it means previous createItem calls have all failed. Update it to be the placeholder id.
        if (!itemId) {
            itemId = PLACEHOLDER_NODE_ITEM_ID;
        }
        // Try to get the item from the mailStore.
        let item = state.items.get(itemId);
        if (markAsPending) {
            if (!item) {
                // Create our own item here to back the pending node if we don't have one.
                // TODO: 22724. Include ClientItemId into Item
                item = {
                    ConversationId: { Id: conversationId },
                    ItemId: { Id: itemId },
                    IsDraft: true,
                    InternetMessageId: PLACEHOLDER_NODE_INTERNET_MESSAGE_ID,
                    ParentFolderId: { Id: tableView.tableQuery.folderId } as ItemId,
                    Flag: { FlagStatus: 'NotFlagged' } as FlagType,
                    ItemClass: '',
                } as Message;
                state.items.set(itemId, item);
                // Get the reference from the store (http://aka.ms/mobx4)
                item = state.items.get(itemId);
            }
            const message = item as Message;

            if (isNullOrWhiteSpace(message.InternetMessageId)) {
                message.InternetMessageId = PLACEHOLDER_NODE_INTERNET_MESSAGE_ID;
            }
            // Update recipient data on item to display while we wait for the real item from the server, in case:
            // if user modifies recipient well during compose and no save is triggered/save failed before send,
            // the recipient data of this draft item in mailstore is outdated. (VSO#41070)
            updateRecipientsOnMessage(composeViewState, message);
            // Update the attachment well on message in order to hide the attachment well if all attachments are removed.
            updateAttachmentsOnMessage(composeViewState, message);
            // Set the body on the item to display while we wait for the real item from the server.
            updateBodyOnMessage(composeViewState, message);
            // Try to get the conversationNode based on the internetMessageId on the message.
            let nodeId = message.InternetMessageId;
            let conversationNode = state.conversationNodes.get(nodeId);
            // In the event that all previous saves have failed, we also won't have a conversation node to mark as pending.
            if (!conversationNode) {
                // In hx, the conversation node map may not include a matching conversation node with an internet message ID.
                // We can try the other immutable ID included as the item ID by pulling the values and re-searching for a matching item.
                if (isFeatureEnabled('fwk-immutable-ids')) {
                    const nodeValues = state.conversationNodes.values();
                    const matchingNodes = [...nodeValues].filter(
                        node => node.itemIds.indexOf(itemId) >= 0
                    );
                    if (matchingNodes.length > 0) {
                        // We need to remove the node we found, and replace it back in place with the same node, but mutated.
                        conversationNode = matchingNodes[0];
                        if (!!conversationNode.internetMessageId) {
                            nodeId = conversationNode.internetMessageId;
                            message.InternetMessageId = nodeId;
                            nodeIdCollectionChange.modified.push(nodeId);
                        } else {
                            const currentIndex = conversationItemParts.conversationNodeIds.indexOf(
                                conversationNode.internetMessageId
                            );
                            conversationItemParts.conversationNodeIds.splice(
                                currentIndex,
                                1,
                                nodeId
                            );
                            state.conversationNodes.delete(conversationNode.internetMessageId);
                            nodeIdCollectionChange.removed.push(conversationNode.internetMessageId);
                            conversationNode.internetMessageId = nodeId;
                            state.conversationNodes.set(nodeId, conversationNode);
                            // Get the reference from the store (http://aka.ms/mobx4)
                            conversationNode = state.conversationNodes.get(nodeId);
                            nodeIdCollectionChange.added.push(nodeId);
                        }
                    }
                }

                if (!conversationNode) {
                    // If this is the case, we'll need to create a node here and add it to the store and node collection. We'll get the real IMI when send returns.
                    conversationNode = {
                        internetMessageId: nodeId,
                        itemIds: [itemId],
                        conversationId: conversationId,
                        localLieState: LocalLieState.None,
                    } as ConversationReadingPaneNode;
                    conversationItemParts.conversationNodeIds.push(nodeId);
                    state.conversationNodes.set(nodeId, conversationNode);
                    // Get the reference from the store (http://aka.ms/mobx4)
                    conversationNode = state.conversationNodes.get(nodeId);
                    nodeIdCollectionChange.added.push(nodeId);
                }
            } else {
                // Otherwise, proceed with the existing node.
                nodeIdCollectionChange.modified.push(nodeId);
            }
            // Mark the localLieState on the node as pending and make sure it's at the "end" of the collection.
            // Last index for NewestOnBottom or index 0 for NewestOnTop
            conversationNode.localLieState = LocalLieState.Pending;
            const currentIndex = conversationItemParts.conversationNodeIds.indexOf(nodeId);
            if (
                isNewestOnBottom() &&
                currentIndex != conversationItemParts.conversationNodeIds.length - 1
            ) {
                conversationItemParts.conversationNodeIds.splice(currentIndex, 1);
                conversationItemParts.conversationNodeIds.push(nodeId);
            } else if (!isNewestOnBottom() && currentIndex != 0) {
                conversationItemParts.conversationNodeIds.splice(currentIndex, 1);
                conversationItemParts.conversationNodeIds.unshift(nodeId);
            }
        } else {
            // If we're marking the node as NOT pending, get the nodeId from the item
            const conversationNode = state.conversationNodes.get((<Message>item).InternetMessageId);
            if (conversationNode.internetMessageId == PLACEHOLDER_NODE_INTERNET_MESSAGE_ID) {
                // If it is, completely remove the node and let compose handle re-send options
                const currentIndex = conversationItemParts.conversationNodeIds.indexOf(
                    PLACEHOLDER_NODE_INTERNET_MESSAGE_ID
                );
                conversationItemParts.conversationNodeIds.splice(currentIndex, 1);
                state.conversationNodes.delete(PLACEHOLDER_NODE_INTERNET_MESSAGE_ID);
                nodeIdCollectionChange.removed.push(PLACEHOLDER_NODE_INTERNET_MESSAGE_ID);
            } else {
                // Otherwise mark the node as not pending
                conversationNode.localLieState = LocalLieState.None;
            }
        }
        // Notify the reading pane of the modifications.
        updateLoadedConversation(conversationId, nodeIdCollectionChange);
    }
);

function updateRecipientsOnMessage(composeViewState: ComposeViewState, message: Message): void {
    if (composeViewState) {
        message.ToRecipients = getRecipientsFromWellViewState(composeViewState.toRecipientWell);
        message.CcRecipients = getRecipientsFromWellViewState(composeViewState.ccRecipientWell);
        message.BccRecipients = getRecipientsFromWellViewState(composeViewState.bccRecipientWell);
        message.RecipientCounts = {
            ToRecipientsCount: message.ToRecipients.length,
            CcRecipientsCount: message.CcRecipients.length,
            BccRecipientsCount: message.BccRecipients.length,
        } as RecipientCountsType;
    }
}

function updateAttachmentsOnMessage(composeViewState: ComposeViewState, message: Message) {
    if (composeViewState.attachmentWell) {
        const { attachmentWell } = composeViewState;
        // Remove attachments from message if there is no attachments in compose after sending.
        if (
            !attachmentWell.docViewAttachments.length &&
            !attachmentWell.imageViewAttachments.length
        ) {
            message.Attachments = [];
        }
    }
}

function updateBodyOnMessage(composeViewState: ComposeViewState, message: Message) {
    const isHTML = composeViewState.bodyType == 'HTML';

    // The local lie body will be displayed in the reading pane, so we need the content without removing the src attributes.
    const bodyType: BodyType = isHTML ? HTML_BODY_TYPE : TEXT_BODY_TYPE;

    // If bodyType is text, format text to html before render, otherwise will cause XSS (VSO#40662)
    const bodyContent = isHTML
        ? addBlankTargetForLinks(composeViewState.content)
        : formatTextToHTML(composeViewState.content);

    const body = bodyContentType({ BodyType: bodyType, Value: bodyContent });

    message.UniqueBody = body;
}

function addBlankTargetForLinks(content: string): string {
    const document = new DOMParser().parseFromString(content, 'text/html');
    const TARGET_ATTRIBUTE_NAME = 'target';
    const TARGET_BLANK = '_blank';
    if (!document || !document.documentElement) {
        return content;
    }

    const links = document.documentElement.querySelectorAll('a[href]');
    if (links) {
        for (let i = 0; i < links.length; i++) {
            const link = links[i];

            if (link && !link.getAttribute(TARGET_ATTRIBUTE_NAME)) {
                link.setAttribute(TARGET_ATTRIBUTE_NAME, TARGET_BLANK);
            }
        }
    }
    return document.documentElement.innerHTML;
}
