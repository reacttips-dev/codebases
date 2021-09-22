import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupListTree" */ './lazyIndex')
);

// Delay loaded components
export let GroupListTree = createLazyComponent(lazyModule, m => m.GroupListTree);
export let GroupRightCharm = createLazyComponent(lazyModule, m => m.GroupRightCharm);
export let GroupRightCharmHover = createLazyComponent(lazyModule, m => m.GroupRightCharmHover);
export let GroupContextMenu = createLazyComponent(lazyModule, m => m.GroupContextMenu);

export let lazyDropMailListRowsOnGroup = new LazyAction(lazyModule, m => m.dropMailListRowsOnGroup);
