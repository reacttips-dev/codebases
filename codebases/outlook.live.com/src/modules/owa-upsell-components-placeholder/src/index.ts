import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "UpsellModuleAsync" */ './lazyIndex')
);
export let TopUpsellBannerComponent = createLazyComponent(lazyModule, m => m.TopUpsellBanner);
