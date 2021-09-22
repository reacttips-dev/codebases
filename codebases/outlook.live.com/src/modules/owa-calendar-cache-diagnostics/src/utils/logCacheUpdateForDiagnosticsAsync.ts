import { logCacheUpdateForDiagnostics } from '../actions/publicActions';
import type { CalendarCacheUpdateLog } from '../store/schema/CalendarCacheDiagnosticsStore';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * This function ensures that the logCacheUpdateForDiagnostics action is invoked is a seperate thread
 * which enables us to invoke this action from a mutator or orchestrator alike (bypassing the rule that mutators cannot invoke actions)
 */
export default function (cacheUpdateLog: CalendarCacheUpdateLog) {
    // gate the lazy-loaded entrypoint to avoid unnecessarily loading this bundle outside SDF ring
    if (!isFeatureEnabled('cal-cacheDiagnostics')) {
        return;
    }

    setTimeout(() => logCacheUpdateForDiagnostics(cacheUpdateLog), 0);
}
