import { logNotificationUpdateForDiagnostics } from '../actions/publicActions';
import type { CalendarNotificationUpdateLog } from '../store/schema/CalendarNotificationDiagnosticsStore';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * This function ensures that the logCalendarNotificationUpdateForDiagnostics action is invoked is a seperate thread
 * which enables us to invoke this action from a mutator or orchestrator alike (bypassing the rule that mutators cannot invoke actions)
 */
export default function (notificationUpdateLog: CalendarNotificationUpdateLog) {
    // gate the lazy-loaded entrypoint to avoid unnecessarily loading this bundle outside SDF ring
    if (!isFeatureEnabled('cal-notificationDiagnostics')) {
        return;
    }

    setTimeout(() => logNotificationUpdateForDiagnostics(notificationUpdateLog), 0);
}
