import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TriageAction"*/ './lazyIndex')
);

export const lazyAddMailboxToSafeSenders = new LazyAction(
    lazyModule,
    m => m.addMailboxToSafeSenders
);

export const lazyAlwaysMoveRowToFocusedOrOther = new LazyAction(
    lazyModule,
    m => m.alwaysMoveRowToFocusedOrOther
);

export const lazyMoveMailListRowsToFocusedOrOther = new LazyAction(
    lazyModule,
    m => m.moveMailListRowsToFocusedOrOther
);

export const lazyDeleteMailListRows = new LazyAction(lazyModule, m => m.deleteMailListRows);

export const lazyDeleteItems = new LazyAction(lazyModule, m => m.deleteItems);

export const lazyDeleteItemsBasedOnNodeOrThreadIds = new LazyImport(
    lazyModule,
    m => m.deleteItemsBasedOnNodeOrThreadIds
);

export const lazyLikeItem = new LazyImport(lazyModule, m => m.likeItem);

export const lazyReactToItem = new LazyAction(lazyModule, m => m.reactToItem);

export const lazyRestoreAllItems = new LazyAction(lazyModule, m => m.restoreAllItems);

export const lazyToggleRowsFlagState = new LazyAction(lazyModule, m => m.toggleRowsFlagState);

export const lazySetMailListRowsFlagState = new LazyAction(
    lazyModule,
    m => m.setMailListRowsFlagState
);

export const lazySetItemsFlagStateFromItemIds = new LazyAction(
    lazyModule,
    m => m.setItemsFlagStateFromItemIds
);

export const lazyMoveItemsFromItemIds = new LazyAction(lazyModule, m => m.moveItemsFromItemIds);
export const lazyMoveItemsBasedOnNodeIds = new LazyImport(
    lazyModule,
    m => m.moveItemsBasedOnNodeIds
);
export const lazyMoveMailListRows = new LazyAction(lazyModule, m => m.moveMailListRows);
export const lazyCopyMailListRows = new LazyAction(lazyModule, m => m.copyMailListRows);
export const lazyArchiveMailListRows = new LazyAction(
    lazyModule,
    m => m.archiveMailListRowsFromTable
);

export const lazyScheduleRows = new LazyImport(lazyModule, m => m.scheduleRows);
export const lazyToggleRowPinnedState = new LazyAction(lazyModule, m => m.toggleRowPinnedState);
export const lazyMarkRowsPinnedUnpinned = new LazyAction(lazyModule, m => m.markRowsPinnedUnpinned);
export const lazyMarkRowsJunkNotJunk = new LazyAction(
    lazyModule,
    m => m.markRowsJunkNotJunkFromTable
);
export const lazyMarkItemsJunkNotJunkBasedOnNodeIds = new LazyImport(
    lazyModule,
    m => m.markItemsJunkNotJunkBasedOnNodeIds
);
export const lazyMarkItemJunkNotJunkFromReadingPane = new LazyAction(
    lazyModule,
    m => m.markItemJunkNotJunkFromReadingPane
);

export const lazyOnKeyboardMarkAsJunkNotJunk = new LazyAction(
    lazyModule,
    m => m.onKeyboardMarkAsJunkNotJunk
);

export const lazyOnKeyboardToggleFlagState = new LazyAction(
    lazyModule,
    m => m.onKeyboardToggleFlagState
);

export const lazyMarkRowsAsPhishingFromTable = new LazyAction(
    lazyModule,
    m => m.markRowsAsPhishingFromTable
);

export const lazyMarkItemAsPhishingFromReadingPane = new LazyAction(
    lazyModule,
    m => m.markItemAsPhishingFromReadingPane
);
export const lazyRestoreMailListRowsAction = new LazyAction(lazyModule, m => m.restoreMailListRows);
export const lazyUnsubscribeEmail = new LazyAction(lazyModule, m => m.unsubscribeEmail);
export const lazyUnsubscribeEmailV2 = new LazyImport(lazyModule, m => m.unsubscribeEmailV2);
export const lazyBlockLastSendersFromTable = new LazyAction(
    lazyModule,
    m => m.blockLastSendersFromTable
);

export const lazyBlockLastSenderFromReadingPane = new LazyAction(
    lazyModule,
    m => m.blockLastSenderFromReadingPane
);

export const lazyAddCategoriesFromTable = new LazyAction(lazyModule, m => m.addCategoriesFromTable);

export const lazyRemoveCategoriesFromTable = new LazyAction(
    lazyModule,
    m => m.removeCategoriesFromTable
);

export const lazyClearCategoriesFromTable = new LazyAction(
    lazyModule,
    m => m.clearCategoriesFromTable
);

export const lazySweepConversations = new LazyAction(lazyModule, m => m.sweepConversations);
export const lazyEmptyTableView = new LazyAction(lazyModule, m => m.emptyTableView);
export const lazyEmptySearchTableView = new LazyAction(lazyModule, m => m.emptySearchTableView);
export const lazyToggleIgnoreConversations = new LazyImport(
    lazyModule,
    m => m.toggleIgnoreConversations
);
export const lazyMoveSharedFolderItems = new LazyImport(lazyModule, m => m.moveSharedFolderItems);
export const lazyMoveSharedFolderConversations = new LazyImport(
    lazyModule,
    m => m.moveSharedFolderConversations
);

export const lazyDismissNudge = new LazyImport(lazyModule, m => m.dismissNudge);
export const lazyOnRemoveMeeting = new LazyImport(lazyModule, m => m.onRemoveMeeting);
export const lazyTranslateFromTable = new LazyAction(lazyModule, m => m.translateFromTable);
