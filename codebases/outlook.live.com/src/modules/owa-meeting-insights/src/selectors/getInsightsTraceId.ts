import { getMeetingInsights } from './meetingInsightsSelectors';
import type { InsightsDataFetchSource } from 'owa-meeting-insights-types-and-flights';

export default function getInsightsTraceId(
    meetingId: string,
    insightsEntrySource: InsightsDataFetchSource
): string | null {
    const insights = getMeetingInsights(meetingId, insightsEntrySource);
    return insights ? insights.traceId : null;
}
