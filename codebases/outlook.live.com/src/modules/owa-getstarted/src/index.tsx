import { LazyAction, LazyModule, createLazyComponent } from 'owa-bundling';

const getStartedLazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GetStarted" */ './lazyIndex')
);

export let GetStartedListInQuickOption = createLazyComponent(
    getStartedLazyModule,
    m => m.GetStartedListInQuickOption
);

export let GetStartedListInListView = createLazyComponent(
    getStartedLazyModule,
    m => m.GetStartedListInListView
);

export let initializeGetStartedTasksLazy = new LazyAction(
    getStartedLazyModule,
    m => m.getInitializeGetStartedPromise
);

export let GetStartedPaneInMailView = createLazyComponent(
    getStartedLazyModule,
    m => m.GetStartedPaneInMailView
);
