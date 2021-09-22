import { LazyBootModule, LazyImport } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(
    () => import(/* webpackChunkName: "ResolversWeb" */ './webResolversSync')
);

export const lazyWebResolvers = new LazyImport(lazyModule, m => m.webResolvers);
