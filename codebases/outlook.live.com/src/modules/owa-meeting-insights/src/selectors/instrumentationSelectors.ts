import { getCalendarEventWithId } from 'owa-calendar-events-store';
import { getRelatedEmails, getRelatedFiles } from './meetingInsightsSelectors';
import {
    default as getTimeRelevance,
    TimeRelevance,
} from 'owa-datetime-utils/lib/getTimeRelevance';
import type { InsightsDataFetchSource } from 'owa-meeting-insights-types-and-flights';

export function getIsOrganizerFromMeetingId(meetingId: string): boolean {
    const calendarEvent = getCalendarEventWithId(meetingId);
    return calendarEvent ? calendarEvent.IsOrganizer : false;
}

export function getSuggestionClickTimeRelevance(meetingId: string): TimeRelevance | number {
    const calendarEvent = getCalendarEventWithId(meetingId);
    const timeRelevance = calendarEvent
        ? getTimeRelevance(calendarEvent.Start, calendarEvent.End)
        : -1;
    return timeRelevance;
}

export function getRelatedFilePosition(
    meetingId: string,
    referenceId: string,
    dataFetchSource: InsightsDataFetchSource
): number {
    const files = getRelatedFiles(meetingId, dataFetchSource);
    for (let i = 0; i < files.length; i++) {
        if (files[i].referenceId === referenceId) {
            return i;
        }
    }
    return -1;
}

export function getRelatedEmailPosition(
    meetingId: string,
    referenceId: string,
    dataFetchSource: InsightsDataFetchSource
): number {
    const emails = getRelatedEmails(meetingId, dataFetchSource);
    for (let i = 0; i < emails.length; i++) {
        if (emails[i].referenceId === referenceId) {
            return i;
        }
    }
    return -1;
}
