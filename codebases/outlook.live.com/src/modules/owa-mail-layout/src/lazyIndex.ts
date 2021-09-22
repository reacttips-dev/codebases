// Register orchestrators lazily
import './orchestrators/leftPaneResizedOrchestrator';

// Register mutators lazily
import './mutators/columnWidthMutators';

export { default as toggleFolderPaneExpansion } from './legacyActions/toggleFolderPaneExpansion';
export { default as setListViewDimension } from './legacyActions/setListViewDimension';

// Lazy actions
export { leftPaneResized } from './actions/leftPaneResized';

// Export lazy orchestrators
export {
    onFirstColumnHandleChangedOrchestrator,
    onSecondColumnHandleChangedOrchestrator,
} from './orchestrators/columnWidthOrchestrators';
