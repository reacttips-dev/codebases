import { createLazyComponent, LazyAction, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "NotificationBar" */ './lazyIndex')
);

export let NotificationBarHost = createLazyComponent(lazyModule, m => m.NotificationBarHost);

export let lazyShowNotification = new LazyAction(lazyModule, m => m.showNotification);

export let lazyDismissNotification = new LazyAction(lazyModule, m => m.dismissNotification);

export const lazyClearNotificationBar = new LazyImport(lazyModule, m => m.clearNotificationBar);
export type { default as NotificationBarHostId } from './store/schema/NotificationBarHostId';
export type { NotificationBarOptions } from './orchestrators/showNotification';
export { NotificationBarCallbackReason } from './callbacksMap/NotificationBarCallbackReason';
