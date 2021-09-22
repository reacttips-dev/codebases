import { LazyAction, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupDeepLinkActions" */ './lazyIndex')
);

export let lazyDeeplinkActionType = new LazyImport(lazyModule, m => m.DeeplinkActionType);

export let lazyInitializeDeeplink = new LazyAction(lazyModule, m => m.initializeDeeplink);

export let lazyDeeplinkOnGroupDetailsLoaded = new LazyAction(
    lazyModule,
    m => m.onGroupDetailsLoaded
);

export let lazyDeeplinkOnGroupDetailsLoadError = new LazyAction(
    lazyModule,
    m => m.onGroupDetailsLoadError
);
