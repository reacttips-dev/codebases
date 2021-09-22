import { LazyAction, LazyModule, registerLazyOrchestrator } from 'owa-bundling';
import reloadTableOnTriageActionFail from 'owa-mail-actions/lib/table-loading/reloadTableOnTriageActionFail';
import undoWhenNotificationChannelNotReady from 'owa-mail-actions/lib/table-loading/undoWhenNotificationChannelNotReady';

export { getCanTableLoadMore } from './utils/getCanTableLoadMore';

const lazyModule = new LazyModule(() => import(/*TableLoadMore*/ './lazyIndex'));

registerLazyOrchestrator(
    reloadTableOnTriageActionFail,
    lazyModule,
    m => m.reloadTableOnTriageActionFailOrchestrator
);

registerLazyOrchestrator(
    undoWhenNotificationChannelNotReady,
    lazyModule,
    m => m.reloadTableUponUndoWithoutNotificaitonChannel
);

export const lazyLoadMoreInTable = new LazyAction(lazyModule, m => m.loadMoreInTable);
export const lazyReloadInboxPostBoot = new LazyAction(lazyModule, m => m.reloadInboxPostBoot);

export { tryLoadMoreUponRowRemove } from './actions/tryLoadMoreUponRowRemove';
import './orchestrators/loadMoreInTableOrchestrator';
