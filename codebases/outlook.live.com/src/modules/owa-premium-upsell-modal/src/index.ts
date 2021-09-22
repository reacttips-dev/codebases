import { LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "owaPremiumUpsellModal" */ './lazyIndex')
);

export let lazyLaunchOwaPremiumUpsellModal = new LazyAction(
    lazyModule,
    m => m.launchOwaPremiumUpsellModal
);
