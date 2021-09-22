import { onFilesFolderShown } from './actions/filesFolderActions';
import { default as setFolderSortBy } from './actions/setFolderSortBy';
import { onNewFolderSuccess } from 'owa-mail-actions/lib/onNewFolderSuccess';
import { LazyAction, LazyModule, registerLazyOrchestrator } from 'owa-bundling';
import emptyFolderStoreUpdate from 'owa-folder-emptyfolder/lib/actions/emptyFolderStoreUpdate';
import markAllAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markAllAsReadStoreUpdate';
export { default as showErrorMessage } from './utils/showErrorMessage';
export { onFilesTreeRootNodeClicked, onFilesFolderShown } from './actions/filesFolderActions';
export { default as loadMailFolders } from './actions/loadMailFolders';
export { filesFolderId } from './utils/constants';
import { onNewFolderNotification } from 'owa-mail-actions/lib/folderNotificationActions';
export {
    default as getListViewTypeForFolder,
    getListViewTypeForFolderV2,
} from './utils/getListViewTypeForFolder';

// Import orchestrators so they are registered
import './orchestrators/loadMailFolders';
import './orchestrators/toggleFolderExpansionOrchestrators';
export { setFolderSortBy };

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailFolderStore" */ './lazyIndex')
);

registerLazyOrchestrator(onNewFolderSuccess, lazyModule, m => m.onNewFolderSuccessOrchestrator);
registerLazyOrchestrator(onFilesFolderShown, lazyModule, m => m.onFilesFolderShownOrchestrator);
registerLazyOrchestrator(
    onNewFolderNotification,
    lazyModule,
    m => m.onNewFolderRowNotificationOrchestrator
);
registerLazyOrchestrator(markAllAsReadStoreUpdate, lazyModule, m => m.markAllAsReadOrchestrator);
registerLazyOrchestrator(
    emptyFolderStoreUpdate,
    lazyModule,
    m => m.emptyFolderStoreUpdateOrchestrator
);
registerLazyOrchestrator(setFolderSortBy, lazyModule, m => m.setFolderSortByOrchestrator);

export let lazyDismissMailFolderTextField = new LazyAction(
    lazyModule,
    m => m.dismissMailFolderTextField
);
