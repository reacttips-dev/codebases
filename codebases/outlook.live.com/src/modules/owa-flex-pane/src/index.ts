import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "FlexPane"*/ './lazyIndex'));

// Export actions
export let lazyShowFlexPane = new LazyAction(lazyModule, m => m.mountAndShowFlexPane);
export let lazyHideFlexPane = new LazyAction(lazyModule, m => m.hideFlexPane);
