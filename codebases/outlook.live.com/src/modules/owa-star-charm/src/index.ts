import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "StarCharm" */ './lazyIndex'));

export const StarCharm = createLazyComponent(lazyModule, m => m.StarCharm);
