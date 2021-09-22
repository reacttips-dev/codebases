import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "RecipientCache" */ './lazyIndex')
);

export let lazyInitializeCache = new LazyAction(lazyModule, m => m.initializeCache);
