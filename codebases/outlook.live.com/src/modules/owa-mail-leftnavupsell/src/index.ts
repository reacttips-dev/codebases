import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "BundleName" */ './lazyIndex'));

export let LeftnavUpsell = createLazyComponent(lazyModule, m => m.LeftnavUpsell);
