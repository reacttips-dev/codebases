import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailPrefetch"*/ './lazyIndex')
);

// Delay actions
export let lazyPrefetchRowInCache = new LazyAction(lazyModule, m => m.prefetchRowInCache);
export let lazyPrefetchSingleRow = new LazyAction(lazyModule, m => m.prefetchSingleRow);
export let lazyPrefetchFirstN = new LazyAction(lazyModule, m => m.prefetchFirstN);

export let lazyPrefetchAdjacentRowsOnDelay = new LazyAction(
    lazyModule,
    m => m.prefetchAdjacentRowsOnDelay
);
