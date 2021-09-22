import { createLazyComponent, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "MeetNow" */ './lazyIndex'));

export let MeetNowSuiteHeaderButton = createLazyComponent(
    lazyModule,
    m => m.MeetNowSuiteHeaderButton
);
export let MeetNowFolderPaneButton = createLazyComponent(
    lazyModule,
    m => m.MeetNowFolderPaneButton
);

export let lazyIsMeetNowEnabled = new LazyImport(lazyModule, m => m.isMeetNowEnabled);
