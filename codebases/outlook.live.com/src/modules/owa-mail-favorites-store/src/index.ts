import { LazyAction, LazyImport, LazyModule, registerLazyOrchestrator } from 'owa-bundling';
import { migrateOutlookFavorites } from 'owa-favorites';

export { default as getFavoriteNodeViewStateFromId } from './selectors/getFavoriteNodeViewStateFromId';
export { getStore } from './store/store';
export { default as showFindFavoritesPicker } from './actions/showFindFavoritesPicker';

export const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailFavoritesStore"*/ './lazyIndex')
);

registerLazyOrchestrator(
    migrateOutlookFavorites,
    lazyModule,
    m => m.migrateOutlookFavoritesOrchestrator
);

export let lazyToggleFavoritesTreeExpansion = new LazyAction(
    lazyModule,
    m => m.toggleFavoritesTreeExpansion
);

export let lazyRemoveFavoriteSearch = new LazyAction(lazyModule, m => m.removeFavoriteSearch);
export let lazyRemoveFavoritePersona = new LazyAction(lazyModule, m => m.removeFavoritePersona);

export let lazyOnSelectedPersonaNodeChanged = new LazyAction(
    lazyModule,
    m => m.onSelectedPersonaNodeChanged
);

export let lazyHandleToggleFavoritePersonaError = new LazyAction(
    lazyModule,
    m => m.handleToggleFavoritePersonaError
);

export let lazyMarkFavoritePersonaNodeAsAdded = new LazyAction(
    lazyModule,
    m => m.markFavoritePersonaNodeAsAdded
);

export let lazyOnFavoritePersonaSelected = new LazyAction(
    lazyModule,
    m => m.onFavoritePersonaSelected
);

export let lazyAddFavoriteFolder = new LazyImport(lazyModule, m => m.addFavoriteFolder);
export let lazyRemoveFavoriteFolder = new LazyImport(lazyModule, m => m.removeFavoriteFolder);
export let lazyAddFavoriteFolderV1 = new LazyAction(lazyModule, m => m.addFavoriteFolderV1);
export let lazyRemoveFavoriteFolderV1 = new LazyAction(lazyModule, m => m.removeFavoriteFolderV1);

export let lazyOnFavoritePersonaUpdated = new LazyAction(
    lazyModule,
    m => m.onFavoritePersonaUpdated
);

export let lazyAddFavoritePersona = new LazyAction(lazyModule, m => m.addFavoritePersona);
export let lazyInitializeFavoritePersonas = new LazyAction(
    lazyModule,
    m => m.initializeFavoritePersonas
);
export let lazyOutlookFavoritePersonasLoaded = new LazyAction(
    lazyModule,
    m => m.outlookFavoritePersonasLoaded
);

export { default as isFavoritingInProgress } from './selectors/isFavoritingInProgress';
