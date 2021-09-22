import { LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "AMP" */ './lazyIndex'));

// Delayed Loaded Components
export let AMPViewer = createLazyComponent(lazyModule, m => m.AMPViewer);
export let AMPValidator = createLazyComponent(lazyModule, m => m.AMPValidator);
