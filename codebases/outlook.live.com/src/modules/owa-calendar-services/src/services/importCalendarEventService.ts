// TODO VSO 113265: remove Mobx store dependent package dependencies from `owa-calendar-services`
import type { MailboxInfo } from 'owa-client-ids';
import type { CalendarId } from 'owa-graph-schema';
import { getApolloClient } from 'owa-apollo';
import {
    ImportEventsFromIcsFileDocument,
    ImportEventsFromIcsFileMutation,
    ImportEventsFromIcsFileMutationVariables,
} from '../graphql/__generated__/importEventsFromIcsFileMutation.interface';

export type ImportEventsFromIcsFileResult = ImportEventsFromIcsFileMutation['importEventsFromIcsFile'];

/**
 * Makes the import calendars event call to the server to add the calednar events to your calendar
 * @param content base 64 encoded string of ICS file.
 * @param folderId folder id of the calendar on which the items should be added.
 * @param attachmentId attachment Id of the Ics file whose events will be added to the calendar
 */
export default async function importCalendarEventService(
    content: string,
    folderId: string,
    calendarId: CalendarId | null,
    attachmentId: string,
    mailboxInfo?: MailboxInfo
): Promise<ImportEventsFromIcsFileResult> {
    const client = getApolloClient();
    const input: ImportEventsFromIcsFileMutationVariables = {
        fileContent: content,
        folderId: folderId,
        calendarId: calendarId
            ? {
                  id: calendarId.id,
                  changeKey: calendarId.changeKey,
                  mailboxInfo: calendarId.mailboxInfo,
              }
            : null,
        mailboxInfo: mailboxInfo,
        attachmentId: attachmentId,
    };
    const mutationResult = await client.mutate({
        variables: input,
        mutation: ImportEventsFromIcsFileDocument,
    });

    return mutationResult?.data?.importEventsFromIcsFile;
}
