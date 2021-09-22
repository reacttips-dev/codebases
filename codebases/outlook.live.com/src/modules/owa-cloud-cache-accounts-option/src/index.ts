import { createLazyComponent, LazyModule, LazyAction } from 'owa-bundling';

export { store } from './store/store';
export { getModuleUrl, getModuleUrlForNewAccount } from './utils/getModuleUrl';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "CloudCache"*/ './lazyIndex'));

// Export delay loaded components
export var CloudCacheOptionFull = createLazyComponent(lazyModule, m => m.CloudCacheOptionFull);
export var AddCloudCacheAccountCallout = createLazyComponent(
    lazyModule,
    m => m.AddCloudCacheAccountCallout
);
export const lazyAddCloudCacheAccount = new LazyAction(lazyModule, m => m.addCloudCacheAccount);
export const lazyGetCloudCacheAccount = new LazyAction(lazyModule, m => m.getCloudCacheAccount);
