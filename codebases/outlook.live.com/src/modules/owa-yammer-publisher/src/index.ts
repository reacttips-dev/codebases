import { LazyAction, LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "YammerPublisher" */ './lazyIndex')
);

// Delay loaded imports
export const lazyOpenYammerPublisher = new LazyAction(lazyModule, m => m.openYammerPublisher);
export const OpxYammerPublisher = createLazyComponent(lazyModule, m => m.OpxYammerPublisher);
