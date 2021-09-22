import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

import './mutators/addFavoriteMutators';
import './mutators/addToOrderedFavoriteIdListMutator';
import './mutators/setFavoritesLoadedMutator';
import './orchestrators/loadFavoritesOrchestrator';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FavoritesStore"*/ './lazyIndex')
);

export let lazyMigrateFavorites = new LazyAction(lazyModule, m => m.migrateFavorites);
export let lazyMoveFavoriteUpDown = new LazyImport(lazyModule, m => m.moveFavoriteUpDown);
export let lazyUpdateFavoritePosition = new LazyImport(lazyModule, m => m.updateFavoritePosition);
export let lazyAddFavoriteCategory = new LazyImport(lazyModule, m => m.addFavoriteCategory);
export let lazyRemoveFavoriteCategory = new LazyImport(lazyModule, m => m.removeFavoriteCategory);
export let lazyAddNewMailboxDefaultFavorites = new LazyAction(
    lazyModule,
    m => m.addNewMailboxDefaultFavorites
);
export let lazyRemoveFavoritePersonaV2 = new LazyImport(lazyModule, m => m.removeFavoritePersonaV2);
export let lazyAddFavoritePersonaV2 = new LazyImport(lazyModule, m => m.addFavoritePersonaV2);

export let lazyRemoveFavoriteGroup = new LazyImport(lazyModule, m => m.removeFavoriteGroup);
export let lazyAddFavoriteGroup = new LazyImport(lazyModule, m => m.addFavoriteGroup);

export let lazyRemoveFavoriteFolderV2 = new LazyImport(lazyModule, m => m.removeFavoriteFolderV2);
export let lazyAddFavoriteFolderV2 = new LazyImport(lazyModule, m => m.addFavoriteFolderV2);

export let lazyRemoveFavoritePrivateDistributionList = new LazyImport(
    lazyModule,
    m => m.removeFavoritePrivateDistributionList
);
export let lazyAddFavoritePrivateDistributionList = new LazyImport(
    lazyModule,
    m => m.addFavoritePrivateDistributionList
);
export let lazyEditFavoritePrivateDistributionList = new LazyImport(
    lazyModule,
    m => m.editFavoritePrivateDistributionList
);

export let lazySetOutlookFavoritesBitFlag = new LazyAction(
    lazyModule,
    m => m.setOutlookFavoritesBitFlag
);
// Favoriting actions
export let lazyAddFavoriteToStore = new LazyImport(lazyModule, m => m.addFavoriteToStore);
export let lazyAddFavoriteCompleted = new LazyImport(lazyModule, m => m.addFavoriteCompleted);
export let lazyAddFavoriteFailed = new LazyImport(lazyModule, m => m.addFavoriteFailed);

export let lazyAddMultipleFavoritesToStore = new LazyImport(
    lazyModule,
    m => m.addMultipleFavoritesToStore
);
export let lazyAddMultipleFavoritesCompleted = new LazyImport(
    lazyModule,
    m => m.addMultipleFavoritesCompleted
);

export let lazyRemoveFavoriteFromStore = new LazyImport(lazyModule, m => m.removeFavoriteFromStore);
export let lazyRemoveFavoriteCompleted = new LazyImport(lazyModule, m => m.removeFavoriteCompleted);
export let lazyRemoveFavoriteFailed = new LazyAction(lazyModule, m => m.removeFavoriteFailed);
export let lazyEditOutlookFavoriteService = new LazyAction(
    lazyModule,
    m => m.editOutlookFavoriteService
);
export let lazyCreateOutlookFavoriteService = new LazyAction(
    lazyModule,
    m => m.createOutlookFavoriteService
);
export let lazyDeleteOutlookFavoriteService = new LazyAction(
    lazyModule,
    m => m.deleteOutlookFavoriteService
);
export let lazyCreateMultipleOutlookFavoritesService = new LazyAction(
    lazyModule,
    m => m.createMultipleOutlookFavoritesService
);

export { addFavoriteFailed, addFavoriteToStoreInitial } from './actions/v2/addFavoriteActions';
export { removeFavoriteFailed } from './actions/v2/removeFavoriteActions';

export { getStore, default as favoritesStore } from './store/store';
export type { default as FavoritesStore } from './store/schema/FavoritesStore';
export { default as loadFavorites } from './actions/loadFavorites';
export {
    isFolderInFavorites,
    isGroupInFavorites,
    isPersonaInFavorites,
    isSearchInFavorites,
    isCategoryInFavorites,
    isPublicFolderInFavorites,
    isPrivateDLInFavorites,
    getPersonaFromPersonIdOrEmailAddress,
} from './selectors/isInFavorites';
export { default as isOutlookFavoritingInProgress } from './selectors/v2/isOutlookFavoritingInProgress';
export { default as getFavoriteIdsForPersonaFavorites } from './selectors/getFavoriteIdsForPersonaFavorites';
export { default as getFavoritePersonaEmail } from './selectors/getFavoritePersonaEmail';
export { default as getFavoritePersonaDisplayName } from './selectors/getFavoritePersonaDisplayName';
export { default as ToggleFavoriteButton } from './components/ToggleFavoriteButton';
export { parse as parseFavoriteNode } from './actions/helpers/favoriteNodeParser';
export { default as updateFavoritesUserOption } from './actions/v1/updateFavoritesUserOption';
export { addFavoriteToStoreV1 } from './actions/v1/loadFavoritesV1';
export {
    FavoritesBitFlagsMasks,
    getIsBitEnabled,
} from './actions/helpers/favoritesBitFlagsActions';
export { default as getFavoriteIdFromGroupId } from './actions/v2/helpers/getFavoriteIdFromGroupId';
export { default as getFavoriteIdFromFolderId } from './selectors/v2/getFavoriteIdFromFolderId';
export {
    isFolderPersonaFavoriteSearchFolder,
    isFolderPrivateDLFavoriteSearchFolder,
} from './utils/isFolderPersonaFavoriteSearchFolder';
export {
    convertEWSFolderIdToRestFolderId,
    convertRestFolderIdToEWSFolderId,
} from './utils/ewsRestFolderIdConverter';
export { default as getFavoriteIdFromCategoryId } from './selectors/v2/getFavoriteIdFromCategoryId';
export {
    createOwsFavoriteCategoryData,
    createOwsFavoriteFolderData,
} from './utils/createOwsFavoriteData';
export {
    createClientFavoriteCategoryData,
    createClientFavoriteFolderData,
} from './utils/createClientFavoriteData';
export { default as migrateOutlookFavorites } from './actions/v2/migrateOutlookFavorites';
export { onCategoryFavorited, onCategoryUnfavorited } from './actions/favoriteCategoryActions';
export { convertFavoritePersonaDataToFavoritePersonaNode } from './utils/convertPersonaFavorite';
export { convertFavoritePdlDataToFavoritePdlNode } from './utils/convertPrivateDistributionListFavorite';
export {
    convertServiceResponseToFavoriteData,
    getSingleValueSettingValueForKey,
} from './utils/favoriteServiceDataUtils';
export { default as getFavoriteIdForPDL } from './selectors/v2/getFavoritePdl';
