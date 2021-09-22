import { hasQueryStringParameter, getQueryStringParameter } from 'owa-querystring';
import type { TraceLevel } from 'owa-trace';
import { getExtraSettings } from 'owa-config';

export function isTracingEnabled(level: TraceLevel): boolean {
    if (hasQueryStringParameter('enableTracing')) {
        return isLevelEnabled(level, getQueryStringParameter('traceLevel'));
    }
    const extraSettingsTracing = getExtraSettings()?.clientTracing;
    if (extraSettingsTracing) {
        return isLevelEnabled(level, extraSettingsTracing);
    }
    return false;
}

function isLevelEnabled(level: TraceLevel, testLevel: string | undefined): boolean {
    if (testLevel) {
        try {
            return level <= parseInt(testLevel);
        } catch {
            return false;
        }
    }
    return true;
}
