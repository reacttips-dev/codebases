import { createLazyComponent, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "InAppNotifications"*/ './lazyIndex')
);

export const NotificationPane = createLazyComponent(lazyModule, m => m.NotificationPane);
export const lazyOnDismissAutomaticReplyNotification = new LazyImport(
    lazyModule,
    m => m.onDismissAutomaticReplyNotification
);
