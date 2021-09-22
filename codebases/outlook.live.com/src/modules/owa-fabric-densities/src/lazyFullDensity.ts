import { LazyBootModule, LazyImport } from 'owa-bundling-light';

const lazyFullModule = new LazyBootModule(
    () => import(/* webpackChunkName: "FullDensity" */ './densities/full')
);
export const lazyFullDensity = new LazyImport(lazyFullModule, m => m.fullDensity);
