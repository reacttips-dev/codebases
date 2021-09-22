import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GetItemManager"*/ './lazyIndex')
);

export let lazyInitializeGetItemManagerForRP = new LazyImport(
    lazyModule,
    m => m.initializeGetItemManagerForRP
);
