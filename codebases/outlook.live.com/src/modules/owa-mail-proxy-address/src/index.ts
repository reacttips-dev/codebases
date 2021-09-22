import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ProxyAddress" */ './lazyIndex')
);

export let lazyInitializeProxyAddressStore = new LazyAction(
    lazyModule,
    m => m.initializeProxyAddressStore
);
