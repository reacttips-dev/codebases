import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "EndpointTracker" */ './lazyIndex')
);

export let lazyAddEndpointDataForOwa = new LazyAction(lazyModule, m => m.addEndpointDataForOwa);
