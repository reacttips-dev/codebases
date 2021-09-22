import { LazyAction, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SearchActions" */ './lazyIndex')
);

export let lazyLoadSearchTable = new LazyAction(lazyModule, m => m.loadSearchTable);

export let lazyCleanSearchTableState = new LazyAction(lazyModule, m => m.cleanSearchTableState)
    .importAndExecute;

export let lazyLoadMoreFindItemSearch = new LazyImport(lazyModule, m => m.loadMoreFindItemSearch);
export let lazyLoadMoreSubstrateSearch = new LazyImport(lazyModule, m => m.loadMoreSubstrateSearch);
