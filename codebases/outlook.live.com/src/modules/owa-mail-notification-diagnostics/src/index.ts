import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "NotificationDiagnostics" */ './lazyIndex')
);

export let lazyInitializeNotificationDiagnostics = new LazyImport(
    lazyModule,
    m => m.initializeNotificationDiagnostics
);
