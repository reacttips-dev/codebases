import getConversationTailoredXpData from './getConversationTailoredXpData';
import { MAX_ITEMS_ALLOWED_TO_RETRIEVE } from '../constants';
import createEmptyConversationItemParts from '../utils/createEmptyConversationItemParts';
import isYammerEnabled from '../utils/isYammerEnabled';
import { preloadYammerIfConversationContainsYammerNotification } from '../utils/preloadYammerNotification';
import preserveItemDataInCache from '../utils/preserveItemDataInCache';
import type { ObservableMap } from 'mobx';
import type { ClientItemId, MailboxInfo } from 'owa-client-ids';
import { isFeatureEnabled } from 'owa-feature-flags';
import type * as Schema from 'owa-graph-schema';
import { convertSchemaMessageToOwsMessage } from 'owa-mail-legacy-item-conversion';
import type { MruCache } from 'owa-mru-cache';
import type ConversationNode from 'owa-service/lib/contract/ConversationNode';
import type ConversationSortOrder from 'owa-service/lib/contract/ConversationSortOrder';
import type GetConversationItemsResponseMessage from 'owa-service/lib/contract/GetConversationItemsResponseMessage';
import type Item from 'owa-service/lib/contract/Item';
import type Message from 'owa-service/lib/contract/Message';
import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';
import initializeUndefinedItemProperties, {
    itemMandatoryProperties,
} from '../utils/initializeUndefinedItemProperties';
import {
    conversationCache,
    mailStore,
    CollectionChange,
    ConversationItemParts,
    ConversationReadingPaneNode,
    LoadConversationItemActionSource,
    LocalLieState,
    ClientItem,
} from 'owa-mail-store';
import tryRemoveFromMailStoreItems, {
    RemoveItemSource,
} from 'owa-mail-actions/lib/triage/tryRemoveFromMailStoreItems';
import {
    conversationReadyToLoad,
    updateItemMandatoryProperties,
    ItemMandatoryPropertiesCollectionChange,
} from 'owa-mail-actions/lib/conversationLoadActions';
import { CardFetchStatus } from 'owa-actionable-message-v2';
import { preloadActionableMessageCardForConversationView } from '../utils/preloadActionableMessageCard';

interface IdProvider<T> {
    (object: T): string;
}

const CHRONOLOGICAL_NEWEST_ON_BOTTOM_SORT_ORDER_NAME = 'ChronologicalNewestOnBottom';
const PLACEHOLDER_NODE_INTERNET_MESSAGE_ID = 'PLACEHOLDER_NODE_INTERNET_MESSAGE_ID';

const conversationNodeIdProvider: IdProvider<ConversationNode> = (
    conversationNode: ConversationNode
) => {
    return conversationNode.InternetMessageId;
};

const itemIdProvider: IdProvider<ClientItem> = (item: ClientItem) => {
    return item.ItemId.Id;
};

/** Generate array of ids from array of objects. */
function generateIdsFromObjects<T>(objects: T[], idProvider: IdProvider<T>): string[] {
    const ids: string[] = [];
    objects.forEach(object => {
        ids.push(idProvider(object));
    });
    return ids;
}

/** Compare array of ids between old and new. */
function checkIfDifferentIds(oldIds: string[], newIds: string[]): boolean {
    if (oldIds.length != newIds.length) {
        return true;
    }

    for (let i = 0; i < oldIds.length; i++) {
        if (oldIds[i] != newIds[i]) {
            return true;
        }
    }

    return false;
}

/** Get the old ids that are not included in the array of new ids */
function getAdditionalOldIds(oldIds: string[], newIds: string[]): string[] {
    const additionalOldIds: string[] = [];
    oldIds.forEach(oldId => {
        if (newIds.indexOf(oldId) < 0) {
            additionalOldIds.push(oldId);
        }
    });
    return additionalOldIds;
}

/** Clear and refill with new ids if they are different from old ids. */
/** Also return the old ids that are not included in the new ids. */
function resetIdsIfDifferent<T>(
    oldIds: string[],
    objects: T[],
    idProvider: IdProvider<T>
): [boolean, string[]] {
    const newIds = generateIdsFromObjects(objects, idProvider);
    if (checkIfDifferentIds(oldIds, newIds)) {
        const additionalOldIds = getAdditionalOldIds(oldIds, newIds);
        // Clear and refill.
        const oldCount = oldIds.length;
        oldIds.splice(0, oldCount, ...newIds);
        return [true, additionalOldIds];
    }
    return [false, []];
}

function checkIfCollectionChanged<T>(change: CollectionChange<T>): boolean {
    return change.added.length > 0 || change.removed.length > 0 || change.modified.length > 0;
}

function checkIfItemMandatoryPropertiesCollectionChanged(
    change: ItemMandatoryPropertiesCollectionChange
): boolean {
    return change.isReadChangedToUnread.length > 0;
}

function cleanUpItem(itemId: string, itemsState: ObservableMap<string, ClientItem>) {
    tryRemoveFromMailStoreItems(itemId, RemoveItemSource.ConversationItemParts);
}

function cleanUpConversationNode(
    nodeId: string,
    conversationNodesState: ObservableMap<string, ConversationReadingPaneNode>,
    itemsState: ObservableMap<string, ClientItem>
) {
    const nodeToRemove = conversationNodesState.get(nodeId);
    nodeToRemove.itemIds.forEach(itemId => {
        const nodeValues = conversationNodesState.values();
        const matchingNodes = [...nodeValues].filter(node => node.itemIds.indexOf(itemId) >= 0);
        if (matchingNodes.length <= 1) {
            cleanUpItem(itemId, itemsState);
        }
    });
    conversationNodesState.delete(nodeId);
}

function checkItemMandatoryPropertiesChange(
    nodeId: string,
    newItems: Item[],
    itemsState: ObservableMap<string, ClientItem>,
    nodeIdCollctionWithItemMandatoryPropertiesChanged: ItemMandatoryPropertiesCollectionChange
) {
    for (const newItem of newItems) {
        const oldItem = itemsState.get(newItem.ItemId.Id);
        if (oldItem) {
            if ((<Message>oldItem).IsRead && !(<Message>newItem).IsRead) {
                nodeIdCollctionWithItemMandatoryPropertiesChanged.isReadChangedToUnread.push(
                    nodeId
                );
            }
        }
    }
}

/** @returns collection change of ids for conversation nodes. */
function mergeConversationNodes(
    oldIds: string[],
    newConversationNodes: ConversationNode[],
    conversationNodesState: ObservableMap<string, ConversationReadingPaneNode>,
    itemsState: ObservableMap<string, ClientItem>,
    conversationSortOrder: ConversationSortOrder,
    conversationId: ClientItemId
): [CollectionChange<string>, ItemMandatoryPropertiesCollectionChange] {
    preservePendingNodesIfNecessary(
        oldIds,
        newConversationNodes,
        conversationNodesState,
        itemsState,
        conversationSortOrder
    );
    const additionalOldIds = resetIdsIfDifferent(
        oldIds,
        newConversationNodes,
        conversationNodeIdProvider
    )[1];
    const nodeIdCollectionChange: CollectionChange<string> = {
        added: [],
        removed: [],
        modified: [],
    };
    const nodeIdCollectionWithItemMandatoryPropertiesChanged: ItemMandatoryPropertiesCollectionChange = {
        isReadChangedToUnread: [],
    };

    // Merge each new node with the old.
    newConversationNodes.forEach(newNode => {
        const nodeId = conversationNodeIdProvider(newNode);
        const oldNode = conversationNodesState.get(nodeId);
        let nodeToMerge: ConversationReadingPaneNode;

        if (!oldNode) {
            // This is the case where a new node is added.
            // Create and save a node to merge.
            conversationNodesState.set(nodeId, {
                conversationId: conversationId.Id,
                internetMessageId: nodeId,
                itemIds: [],
                quotedTextList: newNode.QuotedTextList,
                hasQuotedText: newNode.HasQuotedText,
                isQuotedTextChanged: newNode.IsQuotedTextChanged,
                quotedTextState: newNode.QuotedTextState,
                localLieState: LocalLieState.None,
                parentInternetMessageId: newNode.ParentInternetMessageId,
                diffingInformation: newNode.DiffingInformation,
            });

            nodeToMerge = conversationNodesState.get(nodeId);
            nodeIdCollectionChange.added.push(nodeId);
        } else {
            // We need to merge the parent internet message id for the bus stops to be refreshed. This is because
            // the server will not send down the parent internet message id if the node is the last node in the GCI.
            if (newNode.ParentInternetMessageId) {
                oldNode.parentInternetMessageId = newNode.ParentInternetMessageId;
            }

            if (newNode.QuotedTextList) {
                oldNode.quotedTextList = newNode.QuotedTextList;
            }

            if (newNode.QuotedTextState) {
                oldNode.quotedTextState = newNode.QuotedTextState;
            }

            if (newNode.DiffingInformation) {
                oldNode.diffingInformation = newNode.DiffingInformation;
            }

            // HasQuotedText and IsQuotedTextChanged is conversation node level properties
            // and they align with the first item (primary item) if the conversation contains multiple
            // copies of same message. We should update HasQuotedText and IsQuotedTextChanged in cache
            // as long as item.ContainsOnlyMandatoryProperties = false which means a full set properties
            // is coming down. Also be aware that false is a default value which is often omitted as the
            // response data is prepared on server side.
            // This is right thing to do. However, to reduce risk, I'm limitting this to rp-bodyDiffing
            if (
                isFeatureEnabled('rp-bodyDiffing') &&
                !newNode.Items[0].ContainsOnlyMandatoryProperties
            ) {
                oldNode.hasQuotedText = !!newNode.HasQuotedText;
                oldNode.isQuotedTextChanged = !!newNode.IsQuotedTextChanged;
            } else {
                if (newNode.HasQuotedText) {
                    oldNode.hasQuotedText = true;
                }

                if (newNode.IsQuotedTextChanged) {
                    oldNode.isQuotedTextChanged = true;
                }
            }

            nodeToMerge = oldNode;
        }

        const oldItemIds = nodeToMerge.itemIds;
        const [isItemArrayDifferent, additionalOldItemIds] = resetIdsIfDifferent(
            oldItemIds,
            newNode.Items,
            itemIdProvider
        );
        if (oldNode && isItemArrayDifferent) {
            // This is the case where an old node is modified.
            nodeIdCollectionChange.modified.push(nodeId);
        }
        if (oldNode && !isItemArrayDifferent) {
            checkItemMandatoryPropertiesChange(
                nodeId,
                newNode.Items,
                itemsState,
                nodeIdCollectionWithItemMandatoryPropertiesChanged
            );
        }

        // Merge items for each new node.
        mergeItems(
            oldItemIds,
            newNode.Items,
            additionalOldItemIds,
            itemsState,
            conversationId.mailboxInfo
        );
    });

    // Clean up any additional old node.
    additionalOldIds.forEach(additionalOldId => {
        // This is the case where an old node is removed.
        cleanUpConversationNode(additionalOldId, conversationNodesState, itemsState);
        nodeIdCollectionChange.removed.push(additionalOldId);
    });

    return [nodeIdCollectionChange, nodeIdCollectionWithItemMandatoryPropertiesChanged];
}

/** @returns [whether item collection has been changed, whether item collection contains item changed from read to unread] */
function mergeItems(
    oldIds: string[],
    newItems: Item[],
    additionalOldIds: string[],
    itemsState: ObservableMap<string, ClientItem>,
    mailboxInfo: MailboxInfo
) {
    // Merge each new item with the old.
    newItems.forEach(newItem => {
        const newItemId = newItem.ItemId.Id;
        const oldItem = itemsState.get(newItemId);

        // Initialize required properties that could be undefined so they're observable in the store.
        initializeUndefinedItemProperties(newItem);

        if (!newItem.ContainsOnlyMandatoryProperties) {
            // Only cache new item from response if new item contains complete list of properties.
            // Sync state should guarantee that if we already have an item, the GCI response only contains mandatory properties.
            // But some scenarios (TxP) ignore the sync state, so we should preserve any item data we may have fetched so it doesn't get overwritten.
            if (oldItem) {
                preserveItemDataInCache(newItem, oldItem);
            }

            itemsState.set(newItemId, {
                TranslationData: {
                    isShowingTranslation: false,
                    isTranslatable: false,
                    isTranslating: false,
                    shouldGetFeedback: false,
                    isShowingForwardContentTranslation: false,
                    isForwardContentTranslatable: false,
                    isShowingSubjectTranslation: false,
                    manuallyTranslated: false,
                    userLanguage: null,
                    isWrongLanguage: null,
                },
                AdaptiveCardData: {
                    cardDetails: null,
                    cardFetchStatus: CardFetchStatus.NotLoaded,
                },
                ...newItem,
                MailboxInfo: mailboxInfo,
                SmartReplyData: null,
                SmartTimeData: null,
                SmartTimeExtendedProperty: null,
                smartPillFeedbackSubmitted: false,
                itemCLPInfo: null,
                SIGSData: {
                    SmartPillData: null,
                },
            });
        } else {
            if (oldItem) {
                // Update mandatory properties on old item if it exists in cache.
                itemMandatoryProperties.forEach(property => {
                    if (typeof newItem[property.name] !== 'undefined') {
                        oldItem[property.name] = newItem[property.name];
                    }
                });
            } else {
                // Remove item id from ConversationNode.ItemIds if the old item isn't cached and new item only contains mandatory properties from response.
                oldIds.splice(oldIds.indexOf(newItemId), 1);
            }
        }
    });

    // Clean up any additional old item.
    additionalOldIds.forEach(additionalOldId => {
        cleanUpItem(additionalOldId, itemsState);
    });
}

function handleNodesWithDuplicateIds(
    conversationNodesState: ObservableMap<string, ConversationReadingPaneNode>,
    conversationNodes: ConversationNode[],
    conversationSortOrder: ConversationSortOrder,
    conversationId: ClientItemId
) {
    const nodeIdMap: { [nodeId: string]: boolean } = {};
    const nodeCount = conversationNodes.length;
    const isNewestOnBottom =
        conversationSortOrder == CHRONOLOGICAL_NEWEST_ON_BOTTOM_SORT_ORDER_NAME;
    let index = isNewestOnBottom ? 0 : nodeCount - 1;
    const increment = isNewestOnBottom ? 1 : -1;
    while (index >= 0 && index < nodeCount) {
        const node = conversationNodes[index];
        const existingNode = conversationNodesState.get(node.InternetMessageId);
        if (
            (existingNode && existingNode.conversationId != conversationId.Id) ||
            nodeIdMap[node.InternetMessageId]
        ) {
            // If there's node with the same InternetMessageId from a different conversation or
            // there's a node with the same InternetMessageId in the same conversation,
            // then append ItemId to InternetMessageId to make it unique
            node.InternetMessageId += node.Items[0].ItemId.Id;

            // Update InternetMessageId of each item in the node
            node.Items.forEach(
                item => ((<Message>item).InternetMessageId = node.InternetMessageId)
            );
        } else {
            nodeIdMap[node.InternetMessageId] = true;
        }

        index += increment;
    }
}

function preservePendingNodesIfNecessary(
    oldIds: string[],
    newConversationNodes: ConversationNode[],
    conversationNodesState: ObservableMap<string, ConversationReadingPaneNode>,
    itemsState: ObservableMap<string, ClientItem>,
    conversationSortOrder: ConversationSortOrder
) {
    if (oldIds.length > 0) {
        // Check if last node is pending
        const isNewestOnBottom =
            conversationSortOrder == CHRONOLOGICAL_NEWEST_ON_BOTTOM_SORT_ORDER_NAME;
        const indexOfLastNode = isNewestOnBottom ? oldIds.length - 1 : 0;
        const lastNode = conversationNodesState.get(oldIds[indexOfLastNode]);

        if (lastNode.localLieState == LocalLieState.Pending) {
            // If so, see if the response collection contains a node with a matching IMI
            let shouldPreserveLocalLie = true;
            let matchingNode = findMatchingNode(newConversationNodes, lastNode);
            if (matchingNode) {
                if (matchingNode.Items[0].IsDraft) {
                    // If the matching node is a draft, remove it since we'll preserve the local lie node.
                    newConversationNodes.splice(newConversationNodes.indexOf(matchingNode), 1);
                } else {
                    // If the matching node is a normal item, keep it and update the local lie node.
                    shouldPreserveLocalLie = false;
                    updateLocalLieNode(lastNode, matchingNode);
                    deleteLocalLieSentTime(lastNode, itemsState);
                }
            }
            if (shouldPreserveLocalLie) {
                // Set the matching node to have the same IMI and itemId so the local lie node persists.
                matchingNode = {
                    InternetMessageId: lastNode.internetMessageId,
                    Items: [itemsState.get(lastNode.itemIds[0])],
                } as ConversationNode;

                if (isNewestOnBottom) {
                    newConversationNodes.push(matchingNode);
                } else {
                    newConversationNodes.unshift(matchingNode);
                }
            }
        }
    }
}

function updateLocalLieNode(
    localLieNode: ConversationReadingPaneNode,
    matchingNode: ConversationNode
) {
    localLieNode.localLieState = LocalLieState.Complete;
    localLieNode.hasQuotedText = matchingNode.HasQuotedText;
    localLieNode.isQuotedTextChanged = matchingNode.IsQuotedTextChanged;
    localLieNode.quotedTextList = matchingNode.QuotedTextList;
}

function deleteLocalLieSentTime(
    localLieNode: ConversationReadingPaneNode,
    itemsState: ObservableMap<string, ClientItem>
) {
    const item = itemsState.get(localLieNode.itemIds[0]);
    if (item) {
        delete item.localLieSentTime;
    }
}

/**
 * This function is used to find the matching node in the new conversation nodes for the pending node.
 * Here is the description for the local lie(pending node) scenario:
 * 1. When inline compose is opened, a CreateItem request is triggered and the response contains
 *    itemId of this draft.
 * 2. Notification triggers a GCI to get all the nodes for this conversation, the response contains
 *    the internetMessageId of this draft item.
 * 3. User click send and markConversationNodePendingNotPending is triggered to mark the node as pending.
 *    If the GCI response of #2 doesn't return yet, a local lie node is created with a place holder node id.
 * 4. When undo send is enabled, during the undo send period, if the GCI response of #2 is returned, we need
 *    to find the matching node in the new conversation nodes by itemId and preserve the pending node.
 *    If not, there will be two nodes with the same itemId existing in the conversationNodes list.
 */
function findMatchingNode(
    newConversationNodes: ConversationNode[],
    pendingNode: ConversationReadingPaneNode
): ConversationNode {
    if (pendingNode.internetMessageId == PLACEHOLDER_NODE_INTERNET_MESSAGE_ID) {
        if (pendingNode.itemIds && pendingNode.itemIds.length > 0) {
            return findNodeByItemId(newConversationNodes, pendingNode.itemIds[0]);
        } else {
            return null;
        }
    } else {
        return findNodeById(newConversationNodes, pendingNode.internetMessageId);
    }
}

function findNodeById(conversationNodes: ConversationNode[], nodeId: string): ConversationNode {
    for (const conversationNode of conversationNodes) {
        if (conversationNodeIdProvider(conversationNode) == nodeId) {
            return conversationNode;
        }
    }
    return null;
}

function findNodeByItemId(conversationNodes: ConversationNode[], itemId: string): ConversationNode {
    for (const conversationNode of conversationNodes) {
        for (const item of conversationNode.Items) {
            if (item.ItemId.Id == itemId) {
                return conversationNode;
            }
        }
    }
    return null;
}

export interface ParseConversationResponseState {
    conversations: MruCache<ConversationItemParts>;
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>;
    items: ObservableMap<string, ClientItem>;
}

const isLegacyResponse = (
    responseAsUnknownType: Schema.Conversation | GetConversationItemsResponseMessage
): responseAsUnknownType is GetConversationItemsResponseMessage => {
    return (
        (responseAsUnknownType as any).ResponseClass !== undefined ||
        (responseAsUnknownType as any).conversationNodes === undefined
    );
};

export default action('parseConversationResponse')(function parseConversationResponse(
    response: Schema.Conversation | GetConversationItemsResponseMessage | null,
    conversationSortOrder: ConversationSortOrder,
    conversationId: ClientItemId,
    actionSource: LoadConversationItemActionSource,
    state: ParseConversationResponseState = {
        conversations: conversationCache,
        conversationNodes: mailStore.conversationNodes,
        items: mailStore.items,
    }
) {
    const conversationRawId = conversationId.Id;
    let conversationToLoad = state.conversations.get(conversationRawId);
    if (!conversationToLoad) {
        // If conversation is not in cache, it must be purged. In this case, we need to create an empty one.
        conversationToLoad = createEmptyConversationItemParts(
            conversationId,
            conversationSortOrder
        );
    }
    // Save empty conversationItemPart or touch conversationCache
    state.conversations.add(conversationRawId, conversationToLoad);
    conversationToLoad = state.conversations.get(conversationRawId);
    // Property hasLoadFailed is undefined implies we create an empty ConversationItemParts due to no cache or previous cache failed,
    // update hasLoadFailed if it's undefined, otherwise, keep the cached value as is.
    const hasLoadFailed =
        !response || (isLegacyResponse(response) && response.ResponseClass !== 'Success');
    if (conversationToLoad.loadingState.hasLoadFailed === undefined) {
        conversationToLoad.loadingState.hasLoadFailed = hasLoadFailed;
    }
    if (conversationToLoad.loadingState.hasLoadFailed) {
        // Notify reading pane that load has failed.
        conversationReadyToLoad(conversationRawId);
    }
    // Parse Success conversation response
    if (!hasLoadFailed) {
        const {
            responseNodes,
            totalNodeCount,
            serverIndicatedMorePages,
            canDelete,
            syncState,
        } = isLegacyResponse(response)
            ? {
                  responseNodes: response.Conversation?.ConversationNodes,
                  totalNodeCount: response.Conversation?.TotalConversationNodesCount,
                  serverIndicatedMorePages:
                      response.Conversation?.RemainingConversationNodesCount > 0,
                  syncState: response.Conversation?.SyncState,
                  canDelete: response.Conversation?.CanDelete,
              }
            : {
                  responseNodes:
                      response.conversationNodes.edges &&
                      response.conversationNodes.edges.map(
                          (edge: Schema.ConversationConversationNodesEdge) => ({
                              ...edge.node,
                              Items: edge.node.Items.map(convertSchemaMessageToOwsMessage),
                          })
                      ),
                  totalNodeCount: response.totalConversationNodesCount,
                  serverIndicatedMorePages: response.conversationNodes.pageInfo?.hasNextPage,
                  syncState: response.syncState,
                  canDelete: response.canDelete,
              };
        if (!responseNodes) {
            trace.warn(
                `GCI response has no conversationNodes, but TotalConversationNodesCount is ${totalNodeCount}`
            );
            // Even though the response was successful, we don't have anything to show.
            // Set hasLoadFailed and notify reading pane so we show the error message.
            conversationToLoad.loadingState.hasLoadFailed = true;
            conversationReadyToLoad(conversationRawId);
            return;
        }
        // Only update SyncState when the conversation node counts match.
        // When send mail to self, it is possible that the conversation table is updated according to sent item, but the message is not delivered yet.
        // In this case the syncState might contain new message id but GCI response doesn't really contain this conversationNode.
        if (responseNodes.length == totalNodeCount) {
            conversationToLoad.syncState = syncState;
        } else {
            trace.warn(
                `Count of conversationNodes (${responseNodes.length}) returned from GetConversationItems doesn't match TotalConversationNodesCount (${totalNodeCount})`
            );
        }
        // Update load more value. For CreateConversationRelationMap we load a slimmed down version, not complete enough to render
        // Do not update canLoadMore if the action source is CreateConversationRelationMap
        const canLoadMore =
            serverIndicatedMorePages ||
            (conversationToLoad.maxItemsToReturn < MAX_ITEMS_ALLOWED_TO_RETRIEVE &&
                responseNodes &&
                !(responseNodes.length < conversationToLoad.maxItemsToReturn));
        conversationToLoad.canLoadMoreForRelationMap = canLoadMore;
        if (actionSource != 'CreateConversationRelationMap') {
            conversationToLoad.canLoadMore = canLoadMore;
        }
        conversationToLoad.isLoadMoreInProgress = false;
        conversationToLoad.canDelete = canDelete || null;
        // Handle nodes with duplicate ids.
        // Append ItemId to InternetMessageId to make it unique whenever a duplicate InternetMessageId is detected.
        // This usually happens to system-generated emails wrongfully using the same InternetMessageId.
        // Note that it doesn't handle the case where the first node/conversation with duplicate InternetMessageId is hard deleted,
        // but it's a corner case and there's no other way to correlate.
        handleNodesWithDuplicateIds(
            state.conversationNodes,
            responseNodes,
            conversationSortOrder,
            conversationId
        );
        // Fetch TxP data if necessary
        getConversationTailoredXpData(responseNodes, conversationSortOrder);

        // Fetch Actionable Messages
        preloadActionableMessageCardForConversationView(responseNodes);

        // Check for Yammer notification
        if (isYammerEnabled()) {
            preloadYammerIfConversationContainsYammerNotification(
                responseNodes,
                conversationSortOrder
            );
        }
        // Merge nodes.
        const [
            nodeIdCollectionChanged,
            nodeIdCollectionWithItemMandatoryPropertiesChanged,
        ] = mergeConversationNodes(
            conversationToLoad.conversationNodeIds,
            responseNodes,
            state.conversationNodes,
            state.items,
            conversationSortOrder,
            conversationId
        );
        // Notify reading pane to update readingPaneStore if there's collection change.
        if (checkIfCollectionChanged(nodeIdCollectionChanged)) {
            conversationReadyToLoad(conversationRawId, nodeIdCollectionChanged);
        }
        // If has item changed to unread from notification, notify reading pane to expand the item part.
        // If has item changed to read from notification, leave the item part as is.
        if (
            checkIfItemMandatoryPropertiesCollectionChanged(
                nodeIdCollectionWithItemMandatoryPropertiesChanged
            )
        ) {
            updateItemMandatoryProperties(
                conversationRawId,
                nodeIdCollectionWithItemMandatoryPropertiesChanged
            );
        }
    }
});
