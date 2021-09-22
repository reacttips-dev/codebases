import type { CalendarNotificationUpdateLog } from '../store/schema/CalendarNotificationDiagnosticsStore';
import { action } from 'satcheljs';

/**
 * Action which logs the notification update for diagnostics panel
 */
export const logNotificationUpdateForDiagnostics = action(
    'logNotificationUpdateForDiagnostics',
    (notificationUpdateLog: CalendarNotificationUpdateLog) => ({ notificationUpdateLog })
);
