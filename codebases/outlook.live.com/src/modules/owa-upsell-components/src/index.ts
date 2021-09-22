import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "UpsellComponents" */ './lazyIndex')
);

export let IrisUpsellBanner = createLazyComponent(lazyModule, m => m.IrisUpsellBanner);
