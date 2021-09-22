import { LazyModule, LazyAction, registerLazyOrchestrator } from 'owa-bundling';
import { onSelectFolderComplete } from 'owa-mail-shared-actions/lib/onSelectFolderComplete';
import deleteItemsStoreUpdate from 'owa-mail-actions/lib/triage/deleteItemsStoreUpdate';
import rowUpdatedUponNotification from 'owa-mail-actions/lib/triage/rowUpdatedUponNotification';
import markConversationsAsPinnedStoreUpdate from 'owa-mail-actions/lib/triage/markConversationsAsPinnedStoreUpdate';
import markItemsAsPinnedStoreUpdate from 'owa-mail-actions/lib/triage/markItemsAsPinnedStoreUpdate';
import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';
import onSendMessageSucceeded from 'owa-mail-compose-actions/lib/actions/onSendMessageSucceeded';
import { onNudgeInfoBarClicked } from 'owa-mail-shared-actions/lib/onNudgeInfoBarClicked';
import { dismissNudge } from 'owa-mail-triage-action/lib/actions/actionCreators/dismissNudge';
import { onNudgeIsEnableSaved } from 'owa-mail-shared-actions/lib/onNudgeIsEnableSaved';
import { onNudgeRemoved } from 'owa-mail-nudge-store';

const lazyModule = new LazyModule(() => import(/**/ './lazyIndex'));

export const lazyDisableNudgeOption = new LazyAction(lazyModule, m => m.disableNudgeOption);

registerLazyOrchestrator(
    onSelectFolderComplete,
    lazyModule,
    m => m.getNudgesOnSelectFolderComplete
);
registerLazyOrchestrator(onNudgeIsEnableSaved, lazyModule, m => m.getNudgesOnNudgeOptionChange);
registerLazyOrchestrator(onNudgeRemoved, lazyModule, m => m.getNudgesOnNudgeRemoved);

registerLazyOrchestrator(
    onNudgeInfoBarClicked,
    lazyModule,
    m => m.removeNudgeOnInfoBarClickedOrchestrator
);

registerLazyOrchestrator(
    dismissNudge,
    lazyModule,
    m => m.removeNudgeOnDismissNudgeClickedOrchestrator
);

registerLazyOrchestrator(onNudgeIsEnableSaved, lazyModule, m => m.updateNudgesOnNudgeOptionChange);

registerLazyOrchestrator(
    deleteItemsStoreUpdate,
    lazyModule,
    m => m.removeNudgeOnItemDeleteStoreUpdateOrchestrator
);

registerLazyOrchestrator(rowUpdatedUponNotification, lazyModule, m => m.removeNudgeUponRowUpdate);
registerLazyOrchestrator(
    removeRowsFromListViewStore,
    lazyModule,
    m => m.removeNudgeOnRowsDeleteStoreUpdateOrchestrator
);

registerLazyOrchestrator(
    markItemsAsPinnedStoreUpdate,
    lazyModule,
    m => m.removeNudgeOnItemsPinnedStoreUpdateOrchestrator
);

registerLazyOrchestrator(
    markConversationsAsPinnedStoreUpdate,
    lazyModule,
    m => m.removeNudgeOnConversationsPinnedStoreUpdateOrchestrator
);

registerLazyOrchestrator(
    onSendMessageSucceeded,
    lazyModule,
    m => m.removeNudgeOnReplyOrReplyAllOrForwardOrchestrator
);
