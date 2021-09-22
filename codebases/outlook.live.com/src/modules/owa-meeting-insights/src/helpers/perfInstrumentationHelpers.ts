import getInsightsDataFetchSource from '../selectors/getInsightsDataFetchSource';
import getInsightsTraceId from '../selectors/getInsightsTraceId';
import {
    InsightsDataFetchSource,
    convertInsightsEntrySourceEnumToName,
} from 'owa-meeting-insights-types-and-flights';
import type { PerformanceDatapoint } from 'owa-analytics';
import {
    getFileAttachments,
    getRelatedFiles,
    getRelatedEmails,
    getExplicitFilesCount,
    getExplicitEmailsCount,
} from '../selectors/meetingInsightsSelectors';
import { getIsOrganizerFromMeetingId } from '../selectors/instrumentationSelectors';
import { lazyLogInsightsRenderAndLayout } from '../index';

export function tryEndInsightsPerfDatapoint(
    insightsPerfDatapoint: PerformanceDatapoint,
    meetingId: string,
    entrySource: InsightsDataFetchSource
): boolean {
    if (!insightsPerfDatapoint) {
        // insightsPerfDatapoint can be null when feature is not enabled
        return false;
    }

    const traceId = getInsightsTraceId(meetingId, entrySource);
    if (!traceId) {
        // Do not end the datapoint if there is no insights data returned from server yet
        return false;
    }

    const filesCount = getRelatedFiles(meetingId, entrySource).length;
    const emailsCount = getRelatedEmails(meetingId, entrySource).length;
    insightsPerfDatapoint.addCustomData({
        filesCount: filesCount,
        emailsCount: emailsCount,
        dataFetchSource: getInsightsDataFetchSource(meetingId, entrySource) as number,
        isOrganizer: getIsOrganizerFromMeetingId(meetingId),
        traceId: traceId,
        explicitFilesCount: getExplicitFilesCount(meetingId, entrySource),
        explicitEmailsCount: getExplicitEmailsCount(meetingId, entrySource),
        fileAttachmentsCount: getFileAttachments(meetingId, entrySource).length,
        entrySource: convertInsightsEntrySourceEnumToName(entrySource),
    });

    insightsPerfDatapoint.end();

    lazyLogInsightsRenderAndLayout.importAndExecute(meetingId, entrySource);

    return true;
}
