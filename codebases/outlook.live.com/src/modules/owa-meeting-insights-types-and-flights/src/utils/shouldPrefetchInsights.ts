import { isFeatureEnabled } from 'owa-feature-flags';

export function shouldPrefetchInsights(): boolean {
    return (
        !isFeatureEnabled('cal-meeting-insights-disablePrefetch') &&
        !isFeatureEnabled('cal-meeting-insights-noCache')
    );
}
