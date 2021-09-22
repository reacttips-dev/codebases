import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "leftNavUpsell" */ './lazyIndex')
);

export let LeftnavStorageNotification = createLazyComponent(
    lazyModule,
    m => m.LeftnavStorageNotification
);
