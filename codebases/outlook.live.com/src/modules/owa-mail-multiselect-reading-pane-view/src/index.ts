import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MultiSelectReadingPane" */ './lazyIndex')
);

export let MultiSelectReadingPane = createLazyComponent(lazyModule, m => m.MultiSelectReadingPane);
