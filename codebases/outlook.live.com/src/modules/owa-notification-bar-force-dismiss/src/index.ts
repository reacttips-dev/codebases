import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "NotificationBarForceDismiss" */ './lazyIndex')
);

export { DefaultHotKeyCommand } from './schema/NotificationInterfaces';
export type {
    NotificationOptions,
    NotificationButtonOptions,
} from './schema/NotificationInterfaces';
export type { NotificationBarCallbackReason } from './schema/NotificationInterfaces';

export {
    NotificationBarCallbackReason as DefaultNotificationBarCallbackReason,
    NotificationBarHost,
} from 'owa-notification-bar';

// Lazy-load actions
export let lazyShowNotification = new LazyAction(lazyModule, m => m.showNotification);
export let lazyShowNotificationWithButtonCallback = new LazyAction(
    lazyModule,
    m => m.showNotificationWithButtonCallback
);
export let lazyDismissNotification = new LazyAction(lazyModule, m => m.dismissNotification);
export let lazyEnableNotificationBar = new LazyAction(lazyModule, m => m.enableNotificationBar);
