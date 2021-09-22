import populatePublicFolderOutlookFavoriteStore from './actions/populatePublicFolderOutlookFavoriteStore';
import populatePublicFolderFavoriteStoreV1 from './actions/populatePublicFolderFavoriteStoreV1';

import { createLazyComponent, LazyModule, registerLazyOrchestrator } from 'owa-bundling';
import loadFavorites from 'owa-favorites/lib/actions/loadFavorites';

// Import mutators
import './mutators/addPublicFolderToStoreMutator';
import './mutators/removeFavoriteFromPublicFolderStoreMutator';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "PublicFolderFavorite" */ './lazyIndex')
);

// Register lazy orchestrators
registerLazyOrchestrator(loadFavorites, lazyModule, m => m.loadPublicFolderFavoritesOchestrator);
registerLazyOrchestrator(
    populatePublicFolderOutlookFavoriteStore,
    lazyModule,
    m => m.populatePublicFolderOutlookFavoriteStoreOrchestrator
);
registerLazyOrchestrator(
    populatePublicFolderFavoriteStoreV1,
    lazyModule,
    m => m.populatePublicFolderFavoriteStoreV1Orchestrator
);

// Create lazy components
export const PostedToLine = createLazyComponent(lazyModule, m => m.PostedToLine);

export { default as getPublicFolderMailboxInfoForSmtpAddress } from './services/utils/getPublicFolderMailboxInfoForSmtpAddress';
export { default as publicFolderFavoriteStore } from './store/publicFolderFavoriteStore';
