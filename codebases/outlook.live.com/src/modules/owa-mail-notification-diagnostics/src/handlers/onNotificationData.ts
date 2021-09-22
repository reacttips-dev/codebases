import addNotificationDatapoint from '../actions/addNotificationDatapoint';
import type { NotificationDatapoint } from '../schema/NotificationDatapoint';
import {
    DiagnosticsLogger,
    lazyGetDiagnosticsLogState,
    lazyRegisterDiagnostics,
} from 'owa-diagnostics';
import type NotificationPayloadBase from 'owa-service/lib/contract/NotificationPayloadBase';

const loggerName = 'Notifications';
let notificationLogger: DiagnosticsLogger<NotificationDatapoint>;

let initialized = false;

async function ensureInitialized() {
    if (!initialized) {
        initialized = true;

        notificationLogger = {
            name: loggerName,
            datapoints: [],
        };

        const getDiagnosticsLogState = await lazyGetDiagnosticsLogState.import();
        const registerDiagnostics = await lazyRegisterDiagnostics.import();

        const diagnosticsLogState = getDiagnosticsLogState();
        registerDiagnostics(notificationLogger);
        notificationLogger = diagnosticsLogState.loggers.get(loggerName);
    }
}

export default function onNotificationData(notification: NotificationPayloadBase) {
    ensureInitialized();
    addNotificationDatapoint(notification, notificationLogger);
}
