import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "smimeadapter" */ './lazyIndex')
);

export const lazySmimeAdapter = new LazyImport(lazyModule, m => m.SmimeAdapter);
