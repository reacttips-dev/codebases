import { getMeetingInsights } from './meetingInsightsSelectors';
import type { InsightsDataFetchSource } from 'owa-meeting-insights-types-and-flights';

export default function getInsightsDataFetchSource(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): InsightsDataFetchSource | null {
    const insights = getMeetingInsights(meetingId, dataFetchSource);
    if (!insights) {
        return null;
    }
    return insights.dataFetchSource;
}
