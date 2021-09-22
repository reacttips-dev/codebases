import { LazyBootModule, LazyImport } from 'owa-bundling-light';

const lazyMediumModule = new LazyBootModule(
    () => import(/* webpackChunkName: "MediumDensity" */ './densities/medium')
);
export const lazyMediumDensity = new LazyImport(lazyMediumModule, m => m.mediumDensity);
