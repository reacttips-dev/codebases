import { createLazyComponent, LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "UpNextV2"*/ './lazyIndex'));

// actions
export const lazyInitializeUpNextV2 = new LazyAction(lazyModule, m => m.initializeUpNextV2);

// components
export const UpNextV2 = createLazyComponent(lazyModule, m => m.UpNextV2);

// selectors
export const lazyIsUpNextEventReady = new LazyImport(lazyModule, m => m.isUpNextEventReady);
