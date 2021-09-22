import { LazyModule, LazyAction, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "UserStorage" */ './lazyIndex')
);

export const lazyGetAccountInformation = new LazyAction(lazyModule, m => m.getAccountInformation);

export const lazyGetStorageStore = new LazyImport(lazyModule, m => m.getStore);

export const lazyTryValidateDumpsterQuota = new LazyImport(
    lazyModule,
    m => m.tryValidateDumpsterQuota
);
