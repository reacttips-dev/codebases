import { action } from 'satcheljs';
import type { CalendarCacheUpdateLog } from '../store/schema/CalendarCacheDiagnosticsStore';

/**
 * Action which logs the cache update for diagnostics panel
 */
export const logCacheUpdateForDiagnostics = action(
    'logCacheUpdateForDiagnostics',
    (cacheUpdateLog: CalendarCacheUpdateLog) => ({ cacheUpdateLog })
);
