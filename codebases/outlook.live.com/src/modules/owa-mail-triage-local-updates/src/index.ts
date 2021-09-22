import { LazyAction, LazyModule, registerLazyOrchestrator } from 'owa-bundling';

import deleteConversationStoreUpdate from 'owa-mail-actions/lib/triage/deleteConversationStoreUpdate';
import deleteFolderStoreUpdate from 'owa-mail-actions/lib/triage/deleteFolderStoreUpdate';
import deleteItemsStoreUpdate from 'owa-mail-actions/lib/triage/deleteItemsStoreUpdate';
import markAllAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markAllAsReadStoreUpdate';
import markConversationsAsPinnedStoreUpdate from 'owa-mail-actions/lib/triage/markConversationsAsPinnedStoreUpdate';
import markConversationsAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markConversationsAsReadStoreUpdate';
import markItemsAsPinnedStoreUpdate from 'owa-mail-actions/lib/triage/markItemsAsPinnedStoreUpdate';
import markItemsAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markItemsAsReadStoreUpdate';
import updateCategoriesInView from 'owa-categories-option/lib/actions/updateCategoriesInView';

import './orchestrators/removeRowsFromListViewStoreOrchestrator';
import './actions/mutators/conversationsCategoriesStoreUpdateMutator';
import './actions/mutators/itemsCategoriesStoreUpdateMutator';

const lazyModule = new LazyModule(() => import(/*TriageLocalUpdates*/ './lazyIndex'));

registerLazyOrchestrator(
    markItemsAsReadStoreUpdate,
    lazyModule,
    m => m.markItemsAsReadStoreUpdateOrchestrator
);
registerLazyOrchestrator(
    markItemsAsPinnedStoreUpdate,
    lazyModule,
    m => m.markItemsAsPinnedStoreUpdateOrchestrator
);
registerLazyOrchestrator(
    markConversationsAsReadStoreUpdate,
    lazyModule,
    m => m.markConversationsAsReadStoreUpdateOrchestrator
);

registerLazyOrchestrator(
    markConversationsAsPinnedStoreUpdate,
    lazyModule,
    m => m.markConversationsAsPinnedStoreUpdateOrchestrator
);

registerLazyOrchestrator(
    deleteItemsStoreUpdate,
    lazyModule,
    m => m.deleteItemsStoreUpdateOrchestrator
);

registerLazyOrchestrator(
    deleteConversationStoreUpdate,
    lazyModule,
    m => m.deleteConversationStoreUpdateOrchestrator
);
registerLazyOrchestrator(
    deleteFolderStoreUpdate,
    lazyModule,
    m => m.deleteFolderStoreUpdateOrchestrator
);

registerLazyOrchestrator(markAllAsReadStoreUpdate, lazyModule, m => m.markAllAsReadOrchestrator);

registerLazyOrchestrator(
    updateCategoriesInView,
    lazyModule,
    m => m.updateCategoriesInViewOrchestrator
);

export const lazyRemoveTableFromStore = new LazyAction(lazyModule, m => m.removeTableFromStore);
