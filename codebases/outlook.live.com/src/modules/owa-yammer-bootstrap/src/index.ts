import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "YammerBootstrap" */ './lazyIndex')
);

// Delay loaded imports
export const lazyBootstrapYammer = new LazyImport(lazyModule, m => m.bootstrapYammerIfNeeded);

export { default as isYammerReady } from './selectors/isYammerReady';
