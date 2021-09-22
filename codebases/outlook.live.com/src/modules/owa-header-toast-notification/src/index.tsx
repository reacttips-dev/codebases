import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';
import addNotification from './actions/addNotification';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "NotificationToast" */ './lazyIndex')
);

// Delay loaded components
export const NotificationToast = createLazyComponent(lazyModule, m => m.NotificationToast);

// Delay loaded actions
export let lazyAddNotification = new LazyAction(lazyModule, m => m.addNotification);

export { addNotification };
export { NotificationActionType } from './store/schema/NotificationViewState';
export type { default as NotificationViewState } from './store/schema/NotificationViewState';
export { ensureNotificationHandlerRegistered } from './utils/notificationHandler';
export {
    CALL_NOTIFICATION_TYPE,
    IM_NOTIFICATION_TYPE,
    SUMMARY_NOTIFICATION_TYPE,
} from './utils/constants';
export { default as headerToastNotificationStore } from './store/store';
export type { default as SkypeNotificationViewState } from './store/schema/SkypeNotificationViewState';
export { default as removeNotification } from './actions/removeNotification';
