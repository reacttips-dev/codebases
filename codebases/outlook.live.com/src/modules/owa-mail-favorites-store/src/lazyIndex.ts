// Import orchestrators and mutators so they are initialized at the same time as the store
import './orchestrators/addFavoriteFolderOrchestrator';
import './orchestrators/removeFavoriteFolderOrchestrator';
import './orchestrators/onCategoryFavoritedOrchestrator';
import './orchestrators/onCategoryUnfavoritedOrchestrator';
import './orchestrators/people/addFavoritePersonaOrPdlFailedOrchestrator';
import './orchestrators/people/onFavoritesLoadedOrchestrator';
import './orchestrators/people/removeFavoritePersonaOrPdlFailedOrchestrator';

export { default as migrateOutlookFavoritesOrchestrator } from './orchestrators/migrateOutlookFavoritesOrchestrator';

export { default as addFavoriteFolder } from './actions/addFavoriteFolder';
export { default as removeFavoriteFolder } from './actions/removeFavoriteFolder';
export { default as addFavoriteFolderV1 } from './actions/v1/addFavoriteFolderV1';
export { default as removeFavoriteFolderV1 } from './actions/v1/removeFavoriteFolderV1';

export { default as markFavoritePersonaNodeAsAdded } from './actions/v1/people/markFavoritePersonaNodeAsAdded';
export { default as onFavoritePersonaSelected } from './actions/v1/people/onFavoritePersonaSelected';
export { default as onFavoritePersonaUpdated } from './actions/v1/people/onFavoritePersonaUpdated';
export { default as onSelectedPersonaNodeChanged } from './actions/v1/people/onSelectedPersonaNodeChanged';
export { default as removeFavoritePersona } from './actions/removeFavoritePersona';
export { default as handleToggleFavoritePersonaError } from './orchestrators/people/helpers/handleToggleFavoritePersonaError';
export { default as removeFavoriteSearch } from './actions/v1/removeFavoriteSearch';
export { default as toggleFavoritesTreeExpansion } from './actions/toggleFavoritesTreeExpansion';
export { default as addFavoritePersona } from './actions/addFavoritePersona';
export { default as initializeFavoritePersonas } from './actions/v1/people/initializeFavoritePersonas';
export { default as outlookFavoritePersonasLoaded } from './actions/v2/people/outlookFavoritePersonasLoaded';
