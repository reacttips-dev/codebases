import firstLoadConversationReadingPane from './firstLoadConversationReadingPane';
import datapoints from '../datapoints';
import initializeInfoBarIdsForItem from '../infoBar/initializeInfoBarIdsForItem';
import {
    addLoadedConversationReadingPaneViewState,
    releaseOrphanedLoadedConversationViewStates,
} from '../mutators/loadedConversationViewStateMutators';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import type LoadingState from '../store/schema/LoadingState';
import type QuotedBodyViewState from '../store/schema/QuotedBodyViewState';
import type ReadingPaneStore from '../store/schema/ReadingPaneStore';
import type SmartPillViewState from '../store/schema/SmartPillViewState';
import { getConversationReadingPaneStateCustomData } from '../utils/getReadingPaneStateCustomData';
import hasMeetingPoll from '../utils/hasMeetingPoll';
import isConversationReadingPaneViewStateLoaded from '../utils/isConversationReadingPaneViewStateLoaded';
import { createOofRollUpViewState } from '../utils/rollUp/oofRollUpUtils';
import { ObservableMap } from 'mobx';
import {
    logUsage,
    PerformanceDatapoint,
    returnTopExecutingActionDatapoint,
    wrapFunctionForDatapoint,
} from 'owa-analytics';
import type { ClientItemId } from 'owa-client-ids';
import { isFeatureEnabled } from 'owa-feature-flags';
import createInfoBarHostViewState from 'owa-info-bar/lib/utils/createInfoBarHostViewState';
import createAmpViewState from 'owa-mail-amp-store/lib/utils/createAmpViewState';
import checkIfConversationCacheStale from 'owa-mail-check-cache/lib/utils/checkIfConversationCacheStale';
import { getFolderIdForSelectedNode } from 'owa-mail-folder-forest-store';
import {
    isValidConversationCache,
    mailStore,
    ConversationItemParts,
    ConversationReadingPaneNode,
    conversationCache,
} from 'owa-mail-store';
import { lazyLoadConversation } from 'owa-mail-store-actions';
import type { MruCache } from 'owa-mru-cache';
import type Item from 'owa-service/lib/contract/Item';
import type Message from 'owa-service/lib/contract/Message';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import {
    findItemToLoad,
    shouldCreateItemPartViewState,
} from 'owa-mail-store/lib/utils/conversationsUtils';

export interface LoadConversationReadingPaneState {
    readingPaneStore?: ReadingPaneStore;
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>;
    conversations?: MruCache<ConversationItemParts>;
}

const openedConversationIds: string[] = [];

export function shouldExpandItemPart(item: Item, isLocal: boolean, isDeleted: boolean) {
    return (!(<Message>item).IsRead && isLocal) || (item.IsDraft && !isDeleted);
}

export let createItemPartViewState = function createItemPartViewState(
    nodeId: ClientItemId
): [ItemPartViewState, Item] {
    // Don't create ItemPart for empty node.
    if (!nodeId || !nodeId.Id) {
        return [null, null];
    }
    const conversationNode = mailStore.conversationNodes.get(nodeId.Id);
    const [item, isLocal, isDeleted] = findItemToLoad(conversationNode);
    if (!shouldCreateItemPartViewState(item, isDeleted, isLocal)) {
        return [null, null];
    }
    const initialQuotedBodyLoadingState: LoadingState = {
        isLoading: false,
        hasLoadFailed: false,
    };
    const quotedBodyViewState: QuotedBodyViewState = {
        isExpanded: false,
        loadingState: initialQuotedBodyLoadingState,
    };
    const smartPillViewState: SmartPillViewState = {
        smartPillBlockVisible: false,
    };
    const isExpanded = shouldExpandItemPart(item, isLocal, isDeleted);
    const initialItemLoadingState: LoadingState = {
        isLoading: false,
        hasLoadFailed: false,
    };
    const itemId: ClientItemId = {
        mailboxInfo: nodeId.mailboxInfo,
        Id: item.ItemId.Id,
    };
    const itemPartViewState: ItemPartViewState = {
        ...createInfoBarHostViewState(itemId.Id, initializeInfoBarIdsForItem()),
        conversationNodeId: nodeId.Id,
        itemId: itemId.Id,
        isConversationItemPart: true,
        isExpanded: isExpanded,
        isLocal: isLocal,
        isDeleted: isDeleted,
        attachmentWell: null,
        quotedBodyViewState: quotedBodyViewState,
        isFossilizedTextExpanded: isExpanded,
        hideSmartReplyFeedbackDialog: true,
        meetingRequestViewState: null,
        loadingState: initialItemLoadingState,
        actionableMessageCardInItemViewState: {
            showBodyWithMessageCard: false,
            showCardLoading: true,
        },
        undoDarkMode: false,
        isLoadingFullBody: false,
        oofRollUpViewState: createOofRollUpViewState(item.ItemClass),
        isInRollUp: false,
        smartPillViewState: smartPillViewState,
        ampViewState: createAmpViewState(item),
        hasMeetingPoll: hasMeetingPoll(item),
        omeMessageState: null,
    };
    return [itemPartViewState, item];
};

function createInitialConversationState(
    conversationId: ClientItemId,
    conversationSubject: string,
    conversationCategories: string[],
    instrumentationContext: InstrumentationContext,
    itemIdToScrollTo?: string
): ConversationReadingPaneViewState {
    const initialLoadingState: LoadingState = {
        isLoading: true,
        hasLoadFailed: false,
    };
    const initialConversationState: ConversationReadingPaneViewState = {
        conversationId: conversationId,
        conversationSubject: conversationSubject,
        conversationCategories: conversationCategories,
        initiallySelectedItemPart: null,
        itemIdToScrollTo: itemIdToScrollTo, // This will be null if not supplied by the caller
        itemPartsMap: new ObservableMap<string, ItemPartViewState>({}),
        loadingState: initialLoadingState,
        currentSelectedFolderId: getFolderIdForSelectedNode(),
        unsupportedItemId: null,
        instrumentationContext: instrumentationContext,
        attachmentWell: null,
        calendarInlineComposeViewState: null,
        focusedItemPart: null,
        conversationNodeIdsInCollapsedItemsRollUp: [],
        nodeIdBundledWithSeeMoreMessages: null,
        extendedCardViewState: null,
    };
    return initialConversationState;
}

export default wrapFunctionForDatapoint(
    datapoints.RPPerfLoadConversationReadingPane,
    function loadConversationReadingPane(
        conversationId: ClientItemId,
        instrumentationContext: InstrumentationContext,
        conversationSubject?: string,
        conversationCategories?: string[],
        itemIdToScrollTo?: string
    ): Promise<void> {
        let promiseToReturn = Promise.resolve();
        let cacheState: string;

        let conversationViewState = createInitialConversationState(
            conversationId,
            conversationSubject,
            conversationCategories,
            instrumentationContext,
            itemIdToScrollTo
        );

        const hasValidConversationCache = isValidConversationCache(conversationId.Id);

        const datapoint = returnTopExecutingActionDatapoint((dp: PerformanceDatapoint) => {
            return dp.eventName == datapoints.RPPerfLoadConversationReadingPane.name;
        });

        // This datapoint is used to collect the cache status in SDF
        if (isFeatureEnabled('ring-dogfood')) {
            let hasOpened = false;
            if (!openedConversationIds.includes(conversationId.Id)) {
                openedConversationIds.push(conversationId.Id);
            } else {
                hasOpened = true;
            }
            logUsage('RPCacheStatus', {
                hasValidConversationCache,
                hasOpened,
                OpenedCount: openedConversationIds.length,
            });
        }

        releaseOrphanedLoadedConversationViewStates();

        // If has valid conversation cache (no matter stale or not when compared to list view cached data), directly load the valid cache
        if (hasValidConversationCache) {
            cacheState = 'Valid';
            // Touch valid cache to avoid the conversation gets purged from cache
            conversationCache.getAndTouch(conversationId.Id);

            if (!isConversationReadingPaneViewStateLoaded(conversationId.Id)) {
                addLoadedConversationReadingPaneViewState(conversationViewState);
                firstLoadConversationReadingPane(conversationId.Id);
            }
        }
        // If has no valid conversation cache or cache is stale compared to list view cached data, fetch conversation from server
        if (!hasValidConversationCache || checkIfConversationCacheStale(conversationId.Id)) {
            addLoadedConversationReadingPaneViewState(conversationViewState);
            cacheState = hasValidConversationCache ? 'Stale' : 'Not';
            promiseToReturn = lazyLoadConversation.importAndExecute(
                conversationId,
                'LoadConversationReadingPane',
                datapoint
            );
        }

        return promiseToReturn.then(() => {
            // Add conversation state custom data in datapoint
            instrumentationContext?.dp?.addCheckpoint?.('LCRP_POST');
            if (datapoint) {
                datapoint.addCustomData(
                    getConversationReadingPaneStateCustomData(conversationId.Id, cacheState)
                );
            }
        });
    }
);
