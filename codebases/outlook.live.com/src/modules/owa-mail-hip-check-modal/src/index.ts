import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaHipCheckModal" */ './lazyIndex')
);

export const HipCheckModal = createLazyComponent(lazyModule, m => {
    return m.HipCheckModal;
});
