import { createLazyComponent, LazyModule } from 'owa-bundling';

export let LazyCommandingModeMenu = createLazyComponent(
    new LazyModule(() => import(/* webpackChunkName: "CommandingModeMenu" */ './lazyIndex')),
    m => m.CommandingModeMenu
);
