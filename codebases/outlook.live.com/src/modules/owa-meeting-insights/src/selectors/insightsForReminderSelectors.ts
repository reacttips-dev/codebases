import {
    getFileAttachments,
    getRelatedFiles,
    getAllInsightsEmails,
} from './meetingInsightsSelectors';
import {
    EmailInsightType,
    FileInsightType,
    InsightsDataFetchSource,
} from 'owa-meeting-insights-types-and-flights';
import { ControlIcons } from 'owa-control-icons';
import loc, { format } from 'owa-localize';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import * as insightsStrings from './meetingInsights.locstring.json';

export type ReminderInsightType = 'attachments' | 'prereads';

/**
 * Get the insights text and icon for Calendar reminder
 * Return null if there is no insight files returned from 3S
 */
export function getReminderInsightsProps(
    meetingId: string
): {
    insightsText: string;
    insightsIcon: ControlIcons;
    insightType: ReminderInsightType;
} | null {
    const fileAttachments = getFileAttachments(meetingId, InsightsDataFetchSource.Reminder);
    const relatedFiles = getRelatedFiles(meetingId, InsightsDataFetchSource.Reminder);
    const emailInsights = getAllInsightsEmails(meetingId, InsightsDataFetchSource.Reminder);

    if (fileAttachments.length > 0) {
        // If there is file attachment, show icon/text based on the attachment
        return {
            insightsText: getInsightsTextForFileAttachments(fileAttachments),
            insightsIcon: ControlIcons.Attach,
            insightType: 'attachments',
        };
    } else if (relatedFiles.length > 0) {
        // If there is no attachment, but related files, show icon/text based on both related files and all emails insights
        // Note that client doesn't show text when there is no related files but only emails
        return {
            insightsText: getInsightsTextForRelatedFiles(relatedFiles, emailInsights),
            insightsIcon: ControlIcons.Insights,
            insightType: 'prereads',
        };
    }

    // No insights to show
    return null;
}

function getInsightsTextForFileAttachments(fileAttachments: FileInsightType[]): string {
    const senderEmailAddress = fileAttachments[0].senderEmailAddress;
    const isSelfMeetingOrganizer =
        senderEmailAddress &&
        senderEmailAddress.toLowerCase() == getUserConfiguration().SessionSettings.UserEmailAddress;

    if (isSelfMeetingOrganizer) {
        return fileAttachments.length === 1
            ? loc(insightsStrings.insightsSummaryForSelfAndSingleAttachment)
            : format(
                  loc(insightsStrings.insightsSummaryForSelfAndMultipleAttachments),
                  fileAttachments.length
              );
    } else {
        const senderToDisplay = fileAttachments[0].senderName || senderEmailAddress;
        if (fileAttachments.length === 1) {
            return format(loc(insightsStrings.insightsSummaryForSingleAttachment), senderToDisplay);
        } else if (fileAttachments.length <= 3) {
            return format(
                loc(insightsStrings.insightsSummaryForSomeAttachments),
                senderToDisplay,
                fileAttachments.length
            );
        } else {
            return format(
                loc(insightsStrings.insightsSummaryForMultipleAttachments),
                senderToDisplay
            );
        }
    }
}

function getInsightsTextForRelatedFiles(
    relatedFiles: FileInsightType[],
    emailInsights: EmailInsightType[]
): string {
    if (relatedFiles.length == 1) {
        return loc(insightsStrings.insightsSummaryForSinglePreread);
    } else if (relatedFiles.length <= 3) {
        return format(
            loc(insightsStrings.insightsSummaryForMultiplePrereads),
            relatedFiles.length + emailInsights.length
        );
    } else {
        return loc(insightsStrings.insightsSummaryForMultiplePrereads);
    }
}
