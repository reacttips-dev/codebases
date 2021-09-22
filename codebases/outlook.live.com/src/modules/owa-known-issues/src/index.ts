import { LazyModule, createLazyComponent, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "KnownIssues" */ './lazyIndex')
);

// Export initializer
export const lazyInitializeKnownIssuesPoll = new LazyAction(
    lazyModule,
    m => m.initializeKnownIssuesPoll
);

// Export component
export const KnownIssues = createLazyComponent(lazyModule, m => m.KnownIssues);

// Export selector
export const lazyGetKnownIssuesBadgeCount = new LazyAction(
    lazyModule,
    m => m.getKnownIssuesBadgeCount
);
