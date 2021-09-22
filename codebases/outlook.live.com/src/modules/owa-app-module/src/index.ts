import { LazyBootModule, LazyAction } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(
    () => import(/* webpackChunkName: "SharedBoot" */ './lazyIndex')
);

export const lazyFrameworkBootstrap = new LazyAction(lazyModule, m => m.appBootstrap);
export { getServiceWorkerConfig } from './getServiceWorkerConfig';
