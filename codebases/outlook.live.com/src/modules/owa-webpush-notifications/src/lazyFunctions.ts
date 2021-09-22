import { createLazyComponent, LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "Webpush-Notifications"*/ './lazyIndex')
);

export let lazybootStrapWebPushService = new LazyAction(lazyModule, m => m.bootStrapWebPushService);

export const lazyUserInitiatedWebPushSetupWorkflow = new LazyImport(
    lazyModule,
    m => m.userInitiatedWebPushSetupWorkflow
);

export const lazyUserInitiatedWebPushDisableWorkflow = new LazyImport(
    lazyModule,
    m => m.userInitiatedWebPushDisableWorkflow
);

export const lazyUnsubscribeWebPushNotifications = new LazyImport(lazyModule, m => m.unsubscribe);

export const lazyLoadWebPushOptions = new LazyImport(lazyModule, m => m.loadWebPushOptions);

export const WebPushDiscovery = createLazyComponent(lazyModule, m => m.WebPushDiscovery);
