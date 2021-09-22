import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FilterSearchPrompt" */ './lazyIndex')
);

export const FilterSearchPrompt = createLazyComponent(lazyModule, m => m.FilterSearchPrompt);
