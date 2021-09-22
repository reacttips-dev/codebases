import { LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "RebootModal" */ './lazyIndex')
);

export const RebootModal = createLazyComponent(lazyModule, m => m.RebootModal);
