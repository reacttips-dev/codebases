import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "BulkActions" */ './lazyIndex')
);

export let BulkActionProgressBar = createLazyComponent(lazyModule, m => m.BulkActionProgressBar);
