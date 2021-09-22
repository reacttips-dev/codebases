import type { InsightsDataFetchSource } from 'owa-meeting-insights-types-and-flights';
import { isFeatureEnabled } from 'owa-feature-flags';

export function getInsightsMapKey(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): string {
    if (isFeatureEnabled('cal-meeting-insights-noCache')) {
        return meetingId + dataFetchSource.toString();
    } else {
        return meetingId;
    }
}
