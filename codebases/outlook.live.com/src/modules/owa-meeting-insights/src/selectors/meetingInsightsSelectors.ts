import {
    isInsightsEnabledForEvent,
    EmailInsightType,
    FileInsightType,
    RelevanceRelationship,
    InsightsDataFetchSource,
} from 'owa-meeting-insights-types-and-flights';
import type InsightsViewState from '../store/schema/InsightsViewState';
import { getMeetingInsightsStore } from '../store/store';
import { getInsightsMapKey } from '../helpers/getInsightsMapKey';

export function getMeetingInsights(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): InsightsViewState | null {
    return getMeetingInsightsStore().meetingIdToInsightsMap.get(
        getInsightsMapKey(meetingId, dataFetchSource)
    );
}

/**
 * Gets the files from insights which are NOT meeting attachments
 */
export function getRelatedFiles(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): FileInsightType[] {
    const insights: InsightsViewState = getMeetingInsights(meetingId, dataFetchSource);

    // For related files, client filters out the meeting attachments explicitly
    return insights ? insights.files.filter(file => !file.isMeetingAttachment) : [];
}

export function getRelatedEmails(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): EmailInsightType[] {
    const insights: InsightsViewState = getMeetingInsights(meetingId, dataFetchSource);
    return insights ? insights.emails.filter(email => !email.isMeetingAttachment) : [];
}

export function getRelatedFilesAndEmailsCount(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): number {
    return (
        getRelatedFiles(meetingId, dataFetchSource).length +
        getRelatedEmails(meetingId, dataFetchSource).length
    );
}

/**
 * Gets the files from insights which are meeting attachments
 */
export function getFileAttachments(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): FileInsightType[] {
    const insights: InsightsViewState = getMeetingInsights(meetingId, dataFetchSource);
    return insights ? insights.files.filter(file => file.isMeetingAttachment) : [];
}

/**
 * Gets the emails from insights which are meeting attachments
 */
export function getEmailAttachments(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): EmailInsightType[] {
    const insights: InsightsViewState = getMeetingInsights(meetingId, dataFetchSource);
    return insights ? insights.emails.filter(email => email.isMeetingAttachment) : [];
}

/**
 * Gets the files from insights which include both meeting attachments and related files
 */
export function getAllInsightsFiles(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): FileInsightType[] {
    const insights = getMeetingInsights(meetingId, dataFetchSource);
    if (!insights || insights.files.length === 0) {
        return [];
    }
    return insights.files;
}

/**
 * Gets the emails from insights which include both meeting attachments and related files
 */
export function getAllInsightsEmails(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): EmailInsightType[] {
    const insights = getMeetingInsights(meetingId, dataFetchSource);
    if (!insights || insights.emails.length === 0) {
        return [];
    }
    return insights.emails;
}

export function getExplicitFilesCount(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): number {
    const relatedFiles = getRelatedFiles(meetingId, dataFetchSource);
    return relatedFiles.filter(
        file => file.relevanceRelationship === RelevanceRelationship.Explicit
    ).length;
}

export function getExplicitEmailsCount(
    meetingId: string,
    dataFetchSource: InsightsDataFetchSource
): number {
    const relatedEmails = getRelatedEmails(meetingId, dataFetchSource);
    return relatedEmails.filter(
        email => email.relevanceRelationship === RelevanceRelationship.Explicit
    ).length;
}

export function hasInsightsToShowInCalendarPeek(meetingId: string): boolean {
    // Show calendar peek insights if
    // - feature is enabled
    // - and there is file insights returned from 3S
    return (
        isInsightsEnabledForEvent(meetingId) &&
        getAllInsightsFiles(meetingId, InsightsDataFetchSource.ItemPeek).length > 0
    );
}

export function hasInsightsToShowInTimePanelPeek(meetingId: string): boolean {
    // Show time panel peek insights if
    // - feature is enabled
    // - and there is files or emails insights returned from 3S
    return (
        isInsightsEnabledForEvent(meetingId) &&
        getAllInsightsFiles(meetingId, InsightsDataFetchSource.TimePanelEventDetails).length +
            getAllInsightsEmails(meetingId, InsightsDataFetchSource.TimePanelEventDetails).length >
            0
    );
}

export function hasInsightsToShowInAgendaViewUpNext(meetingId: string): boolean {
    // Show up next insights if
    // - feature is enabled
    // - and there is file insights returned from 3S
    return (
        isInsightsEnabledForEvent(meetingId) &&
        getAllInsightsFiles(meetingId, InsightsDataFetchSource.AgendaView).length > 0
    );
}
