import { LazyModule, registerLazyOrchestrator } from 'owa-bundling';
import { onItemPartContextMenu } from 'owa-mail-actions/lib/mailListSelectionActions';
import emptyFolderStoreUpdate from 'owa-folder-emptyfolder/lib/actions/emptyFolderStoreUpdate';

export { default as PropertyIcons } from './utils/conversationProperty/PropertyIcons';
export { default as getItemClassIcon } from './utils/conversationProperty/getItemClassIcon';
export { default as getPropertyIconStyle } from './utils/conversationProperty/getPropertyIconStyle';
export { default as loadInitialRowsFromServer } from './actions/table/loadInitialRowsFromServer';

const lazyModule = new LazyModule(() => import(/*MailActions*/ './lazyIndex'));

// Import orchestrators and mutators so they get registered
import './mutators/updateTableCurrentLoadedIndexMutator';

// Register lazy orchestrator
registerLazyOrchestrator(
    onItemPartContextMenu,
    lazyModule,
    m => m.mailListItemExpansionOrchestrators
);
registerLazyOrchestrator(
    emptyFolderStoreUpdate,
    lazyModule,
    m => m.emptyFolderStoreUpdateOrchestrator
);
