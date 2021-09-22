import { LazyAction, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "PersonaPhoto" */ './lazyIndex')
);
const lazyOfflineModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaPersonaOffline" */ './lazyIndexOffline')
);

export let lazyDownloadPersonaPhoto = new LazyAction(lazyModule, m => m.downloadPersonaPhoto);
export const lazyEnhanceLpcConfigForOffline = new LazyImport(
    lazyOfflineModule,
    m => m.enhanceLpcConfigForOffline
);
