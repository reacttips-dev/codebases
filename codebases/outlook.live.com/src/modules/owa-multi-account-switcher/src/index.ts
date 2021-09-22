import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MultiAccountSwitcher"*/ './lazyIndex')
);

export const MultiAccountSwitcher = createLazyComponent(lazyModule, m => m.MultiAccountSwitcher);
