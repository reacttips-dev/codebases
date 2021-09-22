import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupsReadUnreadDiagnostics" */ './lazyIndex')
);

export let lazyAddMarkAsReadDiagnostics = new LazyImport(
    lazyModule,
    m => m.addMarkAsReadDiagnostics
);

export let lazyAddUnreadCountNotificationDiagnostics = new LazyImport(
    lazyModule,
    m => m.addUnreadCountNotificationDiagnostics
);

export let lazyAddUnreadCountSubscriptionDiagnostics = new LazyImport(
    lazyModule,
    m => m.addUnreadCountSubscriptionDiagnostics
);
