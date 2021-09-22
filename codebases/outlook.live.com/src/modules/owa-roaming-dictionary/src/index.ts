import { LazyModule, LazyAction, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaRoamingDictionary"*/ './lazyIndex')
);

export const lazyPreloadRoamingDictionary = new LazyAction(
    lazyModule,
    m => m.preloadRoamingDictionary
);

export const lazySaveRoamingDictionary = new LazyAction(lazyModule, m => m.saveRoamingDictionary);

export const lazyGetRoamingDictionary = new LazyImport(lazyModule, m => m.getRoamingDictionary);
