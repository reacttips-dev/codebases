export { default as addFavoriteCategory } from './actions/addFavoriteCategory';
export { default as migrateFavorites } from './actions/v1/firstRun/migrateFavorites';
export { default as moveFavoriteUpDown } from './actions/moveFavoriteUpDown';
export { default as removeFavoriteCategory } from './actions/removeFavoriteCategory';
export { default as updateFavoritePosition } from './actions/updateFavoritePosition';
export { addFavoritePersonaV2 } from './actions/v2/people/addFavoritePersonaV2';
export { removeFavoritePersonaV2 } from './actions/v2/people/removeFavoritePersonaV2';
export { default as addFavoriteGroup } from './actions/v2/addFavoriteGroup';
export { default as removeFavoriteGroup } from './actions/v2/removeFavoriteGroup';
export { default as addFavoriteFolderV2 } from './actions/v2/addFavoriteFolderV2';
export { default as removeFavoriteFolderV2 } from './actions/v2/removeFavoriteFolderV2';
export { addFavoritePrivateDistributionList } from './actions/v2/people/addFavoritePrivateDistributionList';
export { removeFavoritePrivateDistributionList } from './actions/v2/people/removeFavoritePrivateDistributionList';
export { editFavoritePrivateDistributionList } from './actions/v2/people/editFavoritePrivateDistributionList';
export {
    addFavoriteCompleted,
    addFavoriteFailed,
    addFavoriteToStore,
    addMultipleFavoritesCompleted,
    addMultipleFavoritesToStore,
} from './actions/v2/addFavoriteActions';
export {
    removeFavoriteCompleted,
    removeFavoriteFailed,
    removeFavoriteFromStore,
} from './actions/v2/removeFavoriteActions';
export { default as setOutlookFavoritesBitFlag } from './actions/v2/setOutlookFavoritesBitFlag';
export { default as addNewMailboxDefaultFavorites } from './actions/v2/addNewMailboxDefaultFavorites';

export { default as editOutlookFavoriteService } from './services/v2/editOutlookFavoriteService';
export { default as createOutlookFavoriteService } from './services/v2/createOutlookFavoriteService';
export { default as deleteOutlookFavoriteService } from './services/v2/deleteOutlookFavoriteService';
export { default as createMultipleOutlookFavoritesService } from './services/v2/createMultipleOutlookFavoritesService';

import './mutators/removeFavoriteMutators';
import './mutators/people/markSearchFolderAsPopulatedMutator';
import './mutators/editFavoriteMutators';

// Import orchestrators so they are initialized at the same time as the store
import './orchestrators/updateFavoritePositionOrchestrator';
import './orchestrators/updateFavoritePositionV2Orchestrator';
import './orchestrators/moveFavoriteUpDownOrchestrator';
import './orchestrators/moveFavoriteUpDownV2Orchestrator';
import './orchestrators/addFavoriteCategoryV2Orchestrator';
import './orchestrators/removeFavoriteCategoryV2Orchestrator';
import './orchestrators/addFavoriteCategoryOrchestrator';
import './orchestrators/removeFavoriteCategoryOrchestrator';
import './orchestrators/addFavoriteFolderV2Orchestrator';
import './orchestrators/removeFavoriteFolderV2Orchestrator';
import './orchestrators/addFavoriteGroupOrchestrator';
import './orchestrators/removeFavoriteGroupOrchestrator';
import './orchestrators/people/addFavoritePersonaOrchestrator';
import './orchestrators/people/removeFavoritePersonaOrchestrator';
import './orchestrators/people/loadPersonaSearchFolderOrchestrator';
import './orchestrators/people/addFavoritePrivateDistributionListOrchestrator';
import './orchestrators/people/removeFavoritePrivateDistributionListOrchestrator';
import './orchestrators/people/editFavoritePrivateDistributionListOrchestrator';
import './orchestrators/addNewMailboxDefaultFavoritesOrchestrator';
