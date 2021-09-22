import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "TabView" */ './lazyIndex'));

export const TabBar = createLazyComponent(lazyModule, m => m.TabBar);
