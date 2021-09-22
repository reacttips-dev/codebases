import { LazyImport, LazyModule } from 'owa-bundling';

// TODO VSO 83730: make `owa-calendar-notification-bar` strict
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "CalendarNotificationBar" */ './lazyIndex')
);

export { NotificationBarHost } from 'owa-notification-bar';

// Lazy-load actions
export let lazyShowCalendarNotification = new LazyImport(lazyModule, m => m.showNotification);
export let lazyShowCalendarNotificationWithButtonCallback = new LazyImport(
    lazyModule,
    m => m.showNotificationWithButtonCallback
);

export {
    lazyDismissNotification as lazyDismissCalendarNotification,
    lazyEnableNotificationBar,
    DefaultNotificationBarCallbackReason as NotificationBarCallbackReason,
    DefaultHotKeyCommand,
} from 'owa-notification-bar-force-dismiss';
export type { NotificationBarCallbackReason as CalendarNotificationBarCallbackReason } from 'owa-notification-bar-force-dismiss';
