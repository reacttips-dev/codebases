import { LazyImport, LazyModule } from 'owa-bundling';

export const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "getTcfVendorList"*/ './lazyIndex')
);

export let lazyGdprTcfVendorList = new LazyImport(lazyModule, m => m.getTcfVendorList);
