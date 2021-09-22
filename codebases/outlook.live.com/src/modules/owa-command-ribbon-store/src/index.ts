export { onViewModeChanged } from './actions/onViewModeChanged';
export { onSetViewModeOrchestrator } from './orchestrators/onSetViewModeOrchestrator';
export { getStore, default as commandRibbonStore } from './store/store';
export { initializeCommandingViewMode } from './mutators/initializeCommandingViewMode';

export * from './selectors';

/* Register orchestrators and mutators */
import './mutators/onViewModeChangedInternal';
import './mutators/initializeCommandingViewMode';
import './orchestrators/onSetViewModeOrchestrator';
