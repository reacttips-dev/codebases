import { LazyBootModule, LazyImport } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(
    () => import(/* webpackChunkName: "LocalStateResolvers" */ './localStateResolversSync')
);

export const lazyLocalStateResolvers = new LazyImport(lazyModule, m => m.localStateResolvers);
