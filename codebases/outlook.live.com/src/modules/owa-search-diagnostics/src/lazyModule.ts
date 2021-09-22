import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SearchDiagnostics"*/ './lazyIndex')
);

export const lazyAddSearchRequestInstrumentation = new LazyImport(
    lazyModule,
    m => m.addSearchRequestInstrumentation
);

export const lazyAddResourceTimingEntry = new LazyImport(lazyModule, m => m.addResourceTimingEntry);

export const lazySearchDiagnostics = new LazyImport(lazyModule, m => m.searchDiagnostics);
