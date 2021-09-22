import { LazyAction, LazyBootModule } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(
    () => import(/* webpackChunkName: "AppBarDataBootstrap" */ './lazyIndex')
);

export const lazyBootstrapAppDataCache = new LazyAction(lazyModule, m => m.bootstrapAppDataCache);
