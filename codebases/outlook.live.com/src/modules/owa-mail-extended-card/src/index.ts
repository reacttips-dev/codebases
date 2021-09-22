import { createLazyComponent, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ExtendedCard" */ './lazyIndex')
);

export let ExtendedCardWrapper = createLazyComponent(lazyModule, m => m.ExtendedCardWrapper);
export let lazyGetSnoozeSubMenu = new LazyImport(lazyModule, m => m.getSnoozeSubMenu);
