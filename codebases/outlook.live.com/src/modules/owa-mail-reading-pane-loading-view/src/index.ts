import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ReadingPaneLoading"*/ './lazyIndex')
);

export let LoadingShimmer = createLazyComponent(lazyModule, m => m.LoadingShimmer);
