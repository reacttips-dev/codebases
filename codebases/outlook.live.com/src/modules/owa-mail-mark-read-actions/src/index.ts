import { LazyAction, LazyModule, LazyImport, registerLazyOrchestrator } from 'owa-bundling';
import { onItemPartDeselected } from 'owa-mail-actions/lib/readingPaneActions';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "MarkRead"*/ './lazyIndex'));

export const lazyClearAutoMarkAsReadTimer = new LazyAction(
    lazyModule,
    m => m.clearAutoMarkAsReadTimer
);
export const lazySetAutoMarkAsReadTimer = new LazyAction(lazyModule, m => m.setAutoMarkAsReadTimer);

export const lazyToggleRowReadState = new LazyAction(lazyModule, m => m.toggleRowReadState);

export const lazyMarkItemsAsReadBasedOnNodeIds = new LazyImport(
    lazyModule,
    m => m.markItemsAsReadBasedOnNodeIds
);

export const lazyMarkItemAsReadFromReadingPane = new LazyAction(
    lazyModule,
    m => m.markItemAsReadFromReadingPane
);

export const lazyOnKeyboardMarkAsRead = new LazyAction(lazyModule, m => m.onKeyboardMarkAsRead);

export const lazyMarkAsReadInTable = new LazyAction(lazyModule, m => m.markAsReadInTable);

export const lazyOnSingleSelectionChanged = new LazyAction(
    lazyModule,
    m => m.onSingleSelectionChanged
);

export const lazyMarkReadOnTableViewChange = new LazyImport(
    lazyModule,
    m => m.markReadOnTableViewChange
);

export const lazyOnReadingPaneClosed = new LazyAction(lazyModule, m => m.onReadingPaneClosed);
export const lazyOnNavigateAwayViaUpDown = new LazyAction(
    lazyModule,
    m => m.onNavigateAwayViaUpDown
);

registerLazyOrchestrator(onItemPartDeselected, lazyModule, m => m.onItemPartDeselectedOrchestrator);
