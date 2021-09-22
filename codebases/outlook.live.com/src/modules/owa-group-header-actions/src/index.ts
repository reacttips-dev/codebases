import { LazyAction, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupHeaderActions" */ './lazyIndex')
);

export const lazySetGroupHeaderCallbacks = new LazyAction(
    lazyModule,
    m => m.setGroupHeaderCallbacks
);

export let lazyGroupHeaderCommandBarStore = new LazyImport(
    lazyModule,
    m => m.groupHeaderCommandBarStore
);

export let lazyGroupHeaderNavigationButton = new LazyImport(
    lazyModule,
    m => m.groupHeaderNavigationButton
);

export let lazyGroupHeaderCommandBarAction = new LazyAction(
    lazyModule,
    m => m.groupHeaderCommandBarAction
);

export let lazyIsGroupHeaderNavigationOnEmail = new LazyImport(
    lazyModule,
    m => m.isGroupHeaderNavigationOnEmail
);
