import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "LazyAnnounced" */ './lazyIndex')
);

export const LazyAnnounced = createLazyComponent(lazyModule, m => m.LazyAnnounced);
