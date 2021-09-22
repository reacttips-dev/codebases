import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FilterContextMenu" */ './lazyIndex')
);

// Delay loaded components
export let MailFilterContextMenu = createLazyComponent(lazyModule, m => m.MailFilterContextMenu);
export let MailListFilterMenu = createLazyComponent(lazyModule, m => m.MailListFilterMenu);
