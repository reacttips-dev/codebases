import { LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "LocationLPCInit" */ './lazyIndex')
);

export const lazyJankLogger = new LazyImport(lazyModule, m => m.logJank);

export { default as getPerformanceNow } from './utils/getPerformanceNow';
