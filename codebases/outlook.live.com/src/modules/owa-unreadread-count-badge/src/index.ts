import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "UnreadReadCountBadge" */ './lazyIndex')
);

export const UnreadReadCountBadge = createLazyComponent(lazyModule, m => m.UnreadReadCountBadge);
