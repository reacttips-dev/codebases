import { LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Rollup"*/ './lazyIndex'));

// Components
export const RollupContainer = createLazyComponent(lazyModule, m => m.RollupContainer);
