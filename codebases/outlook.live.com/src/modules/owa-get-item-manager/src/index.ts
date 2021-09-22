import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GetItemManager"*/ './lazyIndex')
);

export let lazyGetAdditionalPropertiesFromServer = new LazyImport(
    lazyModule,
    m => m.getAdditionalPropertiesFromServer
);
export let lazyGetItemProperties = new LazyImport(lazyModule, m => m.getItemProperties);
export let lazyCleanUpByItemId = new LazyImport(lazyModule, m => m.cleanUpByItemId);
