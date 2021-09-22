import { LazyAction, LazyImport, LazyModule, registerLazyOrchestrator } from 'owa-bundling';
import applyConversationFlagStateStoreUpdate from 'owa-mail-actions/lib/triage/applyConversationFlagStateStoreUpdate';
import deleteConversationStoreUpdate from 'owa-mail-actions/lib/triage/deleteConversationStoreUpdate';
import deleteItemsStoreUpdate from 'owa-mail-actions/lib/triage/deleteItemsStoreUpdate';
import markAllAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markAllAsReadStoreUpdate';
import markConversationsAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markConversationsAsReadStoreUpdate';
import markItemsAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markItemsAsReadStoreUpdate';
import updateInternetMessageId from 'owa-mail-compose-actions/lib/actions/updateInternetMessageId';
import initializeExtendedCardForItemReadingPane from './actions/initializeExtendedCardForItemReadingPane';
import {
    conversationReadyToLoad,
    updateItemMandatoryProperties,
    updateAttachments,
} from 'owa-mail-actions/lib/conversationLoadActions';

// webpackPrefetch is 2 means that the reading pane package could be prefetched ealier than
// the packages which have webpackPrefetch as true.
const lazyModule = new LazyModule(() => import(/* webpackChunkName: "ReadingPane"*/ './lazyIndex'));

// Export delay loaded actions
export let lazyLoadConversationReadingPane = new LazyAction(
    lazyModule,
    m => m.loadConversationReadingPane
);
export let lazyMoveReadingPaneToTab = new LazyAction(lazyModule, m => m.moveReadingPaneToTab);
export let lazyLoadConversationReadingPaneForSingleMailItemSelected = new LazyAction(
    lazyModule,
    m => m.loadConversationReadingPaneForSingleMailItemSelected
);
export let lazyPrint = new LazyAction(lazyModule, m => m.print);
export let lazySetItemIdToScrollTo = new LazyAction(lazyModule, m => m.setItemIdToScrollTo);
export let lazyLoadItemReadingPane = new LazyAction(lazyModule, m => m.loadItemReadingPane);
export let lazyLoadItemReadingPaneForSingleMailItemSelected = new LazyAction(
    lazyModule,
    m => m.loadItemReadingPaneForSingleMailItemSelected
);
export let lazyExpandCollapseAllItemParts = new LazyAction(
    lazyModule,
    m => m.expandCollapseAllItemParts
);

// Register lazy orchestrator
registerLazyOrchestrator(
    deleteItemsStoreUpdate,
    lazyModule,
    m => m.deleteItemsStoreUpdateOrchestrator
);
registerLazyOrchestrator(
    markConversationsAsReadStoreUpdate,
    lazyModule,
    m => m.markConversationsAsReadStoreUpdateOrchestrator
);
registerLazyOrchestrator(
    markItemsAsReadStoreUpdate,
    lazyModule,
    m => m.markItemsAsReadStoreUpdateOrchestrator
);
registerLazyOrchestrator(markAllAsReadStoreUpdate, lazyModule, m => m.markAllAsReadOrchestrator);
registerLazyOrchestrator(
    applyConversationFlagStateStoreUpdate,
    lazyModule,
    m => m.applyConversationFlagStateStoreUpdateOrchestrator
);
registerLazyOrchestrator(
    deleteConversationStoreUpdate,
    lazyModule,
    m => m.deleteConversationStoreUpdateOrchestrator
);
registerLazyOrchestrator(
    conversationReadyToLoad,
    lazyModule,
    m => m.conversationReadyToLoadOrchestrator
);
registerLazyOrchestrator(updateAttachments, lazyModule, m => m.updateAttachmentsOrchestrator);

registerLazyOrchestrator(
    updateItemMandatoryProperties,
    lazyModule,
    m => m.updateItemMandatoryPropertiesOrchestrator
);
registerLazyOrchestrator(
    updateInternetMessageId,
    lazyModule,
    m => m.updateInternetMessageIdOrchestrator
);
registerLazyOrchestrator(
    initializeExtendedCardForItemReadingPane,
    lazyModule,
    m => m.initializeExtendedCardForItemReadingPaneOrchestrator
);

// Export delay loaded utilities
export let lazyGetLastestNonDraftItemId = new LazyImport(
    lazyModule,
    m => m.getLastestNonDraftItemId
);

export let lazyGetLatestNonDraftItemIdFromConversation = new LazyImport(
    lazyModule,
    m => m.getLatestNonDraftItemIdFromConversation
);

export let lazyIsUnsupportedItem = new LazyImport(lazyModule, m => m.isUnsupportedItem);

export let lazyClearReadingPaneStore = new LazyAction(lazyModule, m => m.clearReadingPaneStore);

export let lazyReplyByMeeting = new LazyAction(lazyModule, m => m.replyByMeeting);

export let lazyEnsureSecondaryReadingPaneTabHandler = new LazyAction(
    lazyModule,
    m => m.ensureSecondaryReadingPaneTabHandler
);

// Export synchronous actions
export { isItemHeldByConversationItemParts, isItemHeldByItemReadingPane } from './utils/isItemHeld';
export { default as isLinkedInViewProfileFeatureFlagEnabled } from './utils/isLinkedInViewProfileFeatureFlagEnabled';
export { LOKI_LINKEDINPREBIND_UI_FLIGHTNAME } from './utils/lokiFlightNames';

// Export store and schema
export type { default as ItemViewState } from './store/schema/ItemViewState';
export { default as readingPaneStore } from './store/Store';
export type { default as SmartPillViewState } from './store/schema/SmartPillViewState';
export type { default as ItemReadingPaneViewState } from './store/schema/ItemReadingPaneViewState';
export type { default as ItemPartViewState } from './store/schema/ItemPartViewState';
export type { default as DeeplinkId } from './store/schema/DeeplinkId';
export type { default as ActionableMessageCardInItemViewState } from './store/schema/ActionableMessageCardInItemViewState';
export { default as getItemReadingPaneViewState } from './utils/getItemReadingPaneViewState';
export { default as getConversationReadingPaneViewState } from './utils/getConversationReadingPaneViewState';
