import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "ItemActions"*/ './lazyIndex'));

export let ItemActionsMenu = createLazyComponent(lazyModule, m => m.ItemActionsMenu);
