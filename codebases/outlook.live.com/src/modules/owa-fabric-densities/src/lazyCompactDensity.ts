import { LazyBootModule, LazyImport } from 'owa-bundling-light';

const lazyCompactModule = new LazyBootModule(
    () => import(/* webpackChunkName: "CompactDensity" */ './densities/compact')
);
export const lazyCompactDensity = new LazyImport(lazyCompactModule, m => m.compactDensity);
