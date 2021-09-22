export { default as loadTableViewFromTableQuery } from './actions/loadTableViewFromTableQuery';
export { setTableViewErrorState } from './actions/onInitialTableLoadComplete';
export { default as onInitialTableLoadComplete } from './actions/onInitialTableLoadComplete';
import './orchestrators/loadTableViewFromSearchTableQueryOrchestrator';
import './orchestrators/loadMessageSuggestionIntoTableOrchestrator';
import './orchestrators/selectFocusedViewFilterOrchestrator';
import './orchestrators/initializeLazyImports';
import { onListViewTypeOptionSaved } from 'owa-options-actions/lib/onListViewTypeOptionSaved';

import { LazyModule, registerLazyOrchestrator } from 'owa-bundling';
const lazyModule = new LazyModule(() => import(/*TableLoading*/ './lazyIndex'));

registerLazyOrchestrator(
    onListViewTypeOptionSaved,
    lazyModule,
    m => m.onListViewTypeOptionSavedOrchestrator
);
