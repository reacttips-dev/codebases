import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';
import type FolderId from 'owa-service/lib/contract/FolderId';
import type { LinkedCalendarEntry } from 'owa-graph-schema';
import { getCalendarEntryByFolderId } from 'owa-calendar-cache';
import type { MailboxInfo } from 'owa-client-ids';
import {
    SharedCalendarAdditionalInfoDocument,
    SharedCalendarAdditionalInfoQuery,
} from '../graphql/__generated__/SharedCalendarAdditionalInfoQuery.interface';
import { getApolloClient } from 'owa-apollo';

export type SharedCalendarAdditionalInfoResult = SharedCalendarAdditionalInfoQuery['sharedCalendarAdditionalInfo'];

/**
 * Makes the GetCalendarFolderConfiguration call to the server to get the CalendarFolder object
 * @param {FolderId} folderId id of the calendar's configuration that needs to be fetched
 * @param {string} mailboxSmtpAddress smtp addres of request mailbox
 * @returns promise of calendar folder object
 */
export async function getCalendarFolderConfigurationService(
    folderId: FolderId,
    mailboxSmtpAddress: string,
    userIdentity: string
): Promise<SharedCalendarAdditionalInfoResult> {
    let mailboxInfo: MailboxInfo = {
        type: 'GroupMailbox', // Setting this as GroupMailbox only to indicate that mailboxSmtpAddress is explicit and different from UserIdentity and request options need to be generated accordingly
        userIdentity: userIdentity,
        mailboxSmtpAddress: mailboxSmtpAddress,
    };

    let calendarEntry = getCalendarEntryByFolderId(folderId.Id) as LinkedCalendarEntry;

    // For a GS or group calendar we dont have the folder id there we use the DistinguisedFolderIdName
    let calculatedFolderId;
    if (
        calendarEntry &&
        (calendarEntry.IsGeneralScheduleCalendar || calendarEntry.IsGroupMailboxCalendar)
    ) {
        calculatedFolderId = 'calendar';
    } else if (calendarEntry.CalendarFolderType == CalendarFolderTypeEnum.PublicCalendarFolder) {
        calculatedFolderId = calendarEntry.SharedFolderId.Id;
    } else {
        calculatedFolderId = folderId.Id;
    }

    const client = getApolloClient();
    const result = await client.query({
        variables: {
            calculatedFolderId: calculatedFolderId,
            mailboxInfo: mailboxInfo,
            isGroupCalendar: calendarEntry.IsGroupMailboxCalendar,
        },
        query: SharedCalendarAdditionalInfoDocument,
    });

    return result?.data?.sharedCalendarAdditionalInfo;
}
