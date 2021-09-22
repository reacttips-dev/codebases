import { LazyAction, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SearchService" */ './lazyIndex')
);

export let lazyLogLocalContentDataSource = new LazyAction(
    lazyModule,
    m => m.logLocalContentDataSource
);

export let lazyLogLocalContentLayout = new LazyAction(lazyModule, m => m.logLocalContentLayout);

export let lazyClearLocalContentInstrumentationCache = new LazyAction(
    lazyModule,
    m => m.clearLocalContentInstrumentationCache
);

export let lazyGetLocalContentId = new LazyImport(lazyModule, m => m.getLocalContentId);

export const lazySubstrateSearchInitOperation = new LazyImport(
    lazyModule,
    m => m.substrateSearchInitOperation
);
export const lazySubstrateSearchPostSuggestionsService = new LazyImport(
    lazyModule,
    m => m.substrateSearchPostSuggestionsService
);

export const lazyDeleteSubstrateSearchHistoryService = new LazyImport(
    lazyModule,
    m => m.deleteSubstrateSearchHistoryService
);
export const lazyExportSubstrateSearchHistoryService = new LazyImport(
    lazyModule,
    m => m.exportSubstrateSearchHistoryService
);
