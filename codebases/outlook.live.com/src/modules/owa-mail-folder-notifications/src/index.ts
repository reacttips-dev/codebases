import { LazyModule, LazyAction, registerLazyOrchestrator } from 'owa-bundling';
import {
    onNewFolderNotification,
    onUpdateFolderNotification,
} from 'owa-mail-actions/lib/folderNotificationActions';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailFolderNotifications" */ './lazyIndex')
);

export const lazySubscribeToHierarchyNotification = new LazyAction(
    lazyModule,
    m => m.subscribeToHierarchyNotification
);

registerLazyOrchestrator(
    onNewFolderNotification,
    lazyModule,
    m => m.onNewFolderNotificationOrchestrator
);

registerLazyOrchestrator(
    onUpdateFolderNotification,
    lazyModule,
    m => m.onUpdateFolderNotificationOrchestrator
);
