import { createLazyComponent, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "AdsPanel" */ './lazyIndex'));

export let AdsPanel = createLazyComponent(lazyModule, m => m.AdsPanel);
export let lazyRefreshAd = new LazyImport(lazyModule, m => m.refresh);
