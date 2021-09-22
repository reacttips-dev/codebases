import { LazyAction, LazyModule, LazyImport, registerLazyOrchestrator } from 'owa-bundling';
import {
    onFirstColumnHandleChanged,
    onSecondColumnHandleChanged,
} from './actions/columnWidthActions';

export { getStore } from './store/Store';

/* Utils */
export { default as getSearchBoxLeftPadding } from './utils/getSearchBoxLeftPadding';
export { getLeftNavWidth } from './utils/getLeftNavWidth';
export { getListViewDimensions } from './utils/getListViewDimensions';
export { getDataMinMaxWidthsForLeftNav } from './utils/getDataMinMaxWidthsForLeftNav';
export { getDataMinMaxDimensionsForListView } from './utils/getDataMinMaxDimensionsForListView';
export { getListViewNotificationDimensions } from './utils/getListViewNotificationDimensions';
export { default as getMinimumRowHeight } from './utils/getMinimumRowHeight';
export { shouldRenderColumnHeaders } from './utils/shouldRenderColumnHeaders';
export { default as getSearchBoxWidthFromListView } from './utils/getSearchBoxWidthFromListView';

/* Selectors */
export {
    isReadingPanePositionBottom,
    isReadingPanePositionOff,
    isReadingPanePositionRight,
} from './selectors/readingPanePosition';

export { isImmersiveReadingPaneShown } from './selectors/isImmersiveReadingPaneShown';
export { shouldShowListView } from './selectors/shouldShowListView';
export { shouldShowReadingPane } from './selectors/shouldShowReadingPane';
export { shouldShowFolderPane } from './selectors/shouldShowFolderPane';
export { shouldShowFolderPaneAsOverlay } from './selectors/shouldShowFolderPaneAsOverlay';
export { isSingleLineListView } from './selectors/listViewLayout';
export { isFolderPaneAutoCollapsed } from './selectors/isFolderPaneAutoCollapsed';
export { default as getListViewColumnWidths } from './selectors/getListViewColumnWidths';

export {
    getLeftPaneStyles,
    getRightPaneStyles,
    getListViewContainerStyles,
    getReadingPaneContainerStyles,
} from './selectors/getMailComponentStyles';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "MailLayout"*/ './lazyIndex'));

export let lazyToggleFolderPaneExpansion = new LazyAction(
    lazyModule,
    m => m.toggleFolderPaneExpansion
);

export let lazySetListViewDimension = new LazyAction(lazyModule, m => m.setListViewDimension);

/* V3 actions */
export { initializeMailLayout } from './utils/initializeMailLayout';
export { onClientReadingPanePositionChange } from './actions/onClientReadingPanePositionChange';
export { setShowListPane } from './actions/setShowListPane';
export { setShowReadingPane } from './actions/setShowReadingPane';
export { setShowFolderPane } from './actions/setShowFolderPane';
export {
    onFirstColumnHandleChanged,
    onSecondColumnHandleChanged,
} from './actions/columnWidthActions';
export { default as onColumnHeaderWidthsUpdated } from './actions/onColumnHeaderWidthsUpdated';

/* Lazy v3 actions */
export const lazyLeftPaneResized = new LazyImport(lazyModule, m => m.leftPaneResized);

/* Register orchestrators and mutators */
import './mutators/setShowListPaneMutator';
import './mutators/setShowReadingPaneMutator';
import './mutators/setShowFolderPaneMutator';
import './orchestrators/mailDynamicLayoutOrchestrator';

// Register lazy orchestrators
registerLazyOrchestrator(
    onFirstColumnHandleChanged,
    lazyModule,
    m => m.onFirstColumnHandleChangedOrchestrator
);
registerLazyOrchestrator(
    onSecondColumnHandleChanged,
    lazyModule,
    m => m.onSecondColumnHandleChangedOrchestrator
);
