import { LazyBootModule, LazyImport } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(
    () => import(/* webpackChunkName: "cachePolicies" */ './policiesSync')
);

export const lazyCachePolicies = new LazyImport(lazyModule, m => m.cachePolicies);
