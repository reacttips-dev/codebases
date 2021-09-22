import { LazyImport, LazyModule, LazyAction } from 'owa-bundling';
import { folderStore } from './store/store';
export { default as getStore } from './store/store';

// Import mutators
import './mutators/setLoadingStateForFolderTree';
import './mutators/loadOutlookFavoritePersonaSearchFoldersMutator';
import './mutators/addFolderToStoreMutators';
export { addFoldersToFolderTableMutator } from './mutators/addFoldersToFolderTableMutator';
import './mutators/folderTreeDataMutators';

// Import orchestrators
import './orchestrators/updateFolderStoreOrchestrator';
import './orchestrators/onFolderHierarchyResponseOrchestrator';

// export types
export type { default as FolderTreeData } from './store/schema/FolderTreeData';

export { default as folderHasChildWithName } from './util/folderHasChildWithName';
export { getFlattenedFoldersList } from './selectors/getFlattenedFoldersList';
export type { FlattenedFolder } from './selectors/getFlattenedFoldersList';
export { hasDisplayableChildFolders } from './selectors/hasDisplayableChildFolders';
export { SourceWellKnownFolderType } from './store/schema/SourceWellKnownFolderType';
export type { default as FolderStore } from './store/schema/FolderStore';
export { default as FolderTreeLoadStateEnum } from './store/schema/FolderTreeLoadStateEnum';
export { default as getFullFolderId } from './util/getFullFolderId';
export { default as outlookFavoritePersonaSearchFoldersLoaded } from './actions/outlookFavoritePersonaSearchFoldersLoaded';
export {
    resetFolderState,
    folderNameToId,
    getDistinguishedFolder,
    createAndAddFolderToStore,
    getMockFolderStore,
} from './util/folderStoreUtility';
export {
    deleteFoldersFromFolderTable,
    removeFolderFromParentFolder,
    moveFolderToParentFolder,
} from './actions/localFolderOperations';
export {
    createNewFolderInStore,
    initializeArchiveFolderTreeFromSessionData,
    getFolderPermissionsSuccess,
    getFolderPermissionsFailed,
    updateFolderPermissionsSuccess,
    updateFolderPermissionsFailed,
} from './actions/publicActions';
export { initializeSharedFolderRoots } from './actions/initializeSharedFolderRoots';
export { removeFolderTreeData } from './actions/removeFolderTreeData';
export { onFolderHierarchyResponse } from './actions/onFolderHierarchyResponse';
export { setLoadingStateForFolderTree } from './actions/setLoadingStateForFolderTree';

export { default as getArchiveFolderTreeRootFolder } from './selectors/getArchiveFolderTreeRootFolder';
export { default as getPrimaryFolderTreeRootFolder } from './selectors/getPrimaryFolderTreeRootFolder';
export { default as getFolderTable } from './selectors/getFolderTable';
export { default as getFolderTreeLoadingState } from './selectors/getFolderTreeLoadingState';
export { default as getFolderTreeHasMoreData } from './selectors/getFolderTreeHasMoreData';
export { default as getFolderTreeCurrentLoadedIndex } from './selectors/getFolderTreeCurrentLoadedIndex';
export { default as getSharedFolderRoot } from './selectors/getSharedFolderRoot';
export { default as getEffectiveFolderDisplayName } from './selectors/getEffectiveFolderDisplayName';
export { setFolderTreeData } from './mutators/setFolderTreeData';
export { initializeFolderTreeData } from './util/initializeFolderTreeData';
export { getPrimaryMailFolders } from './util/getPrimaryMailFolders';

export { default as isFolderUnderMsg, isFolderOrSubFolderOfMsgRoot } from './util/isFolderUnderMsg';
export {
    isUnderDistinguishedFolder,
    default as isFolderOrSubFolderOfDistinguishedFolder,
} from './util/isFolderOrSubFolderOfDistinguishedFolder';
export type { FolderTableState } from './util/isFolderOrSubFolderOfDistinguishedFolder';
export {
    getFolderByDistinguishedId,
    getMailRootFolderChildIds,
    isFolderInMailboxType,
} from './util/folderUtility';
export { getMailboxInfoForFolderId } from './util/getMailboxInfoForFolderId';
export { isPublicFolder } from './util/idConverter';
export { getMailboxFolderTreeData } from './selectors/getMailboxFolderTreeDataTable';
export { generateMailboxSmtpAddress } from './util/mailboxUtility';

export default folderStore;

export type { OnFolderHierarchyResponseFragment } from './actions/__generated__/onFolderHierarchyResponse.interface';

// Required for actions that depend on them.

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Folders" */ './lazyIndex'));

// Export lazy loaded actions
export const lazyGetArchiveFolders = new LazyImport(lazyModule, m => m.getArchiveFolders);

export const lazyGetFolderPermissions = new LazyImport(lazyModule, m => m.getFolderPermissions);

export const lazyUpdateFolderPermissions = new LazyImport(
    lazyModule,
    m => m.updateFolderPermissions
);

export const lazyUpdateFolderPermissionsInFolderStore = new LazyImport(
    lazyModule,
    m => m.updateFolderPermissionsInStore
);

// Export utils
export const lazyArePermissionArraysEqual = new LazyImport(
    lazyModule,
    m => m.arePermissionArraysEqual
);

export const lazyArePermissionsEqual = new LazyImport(lazyModule, m => m.arePermissionsEqual);

export const lazyGetSharedFoldersForSpecificRoot = new LazyImport(
    lazyModule,
    m => m.getSharedFolders
);

export const lazyUpdateFolder = new LazyAction(lazyModule, m => m.updateFolder);
