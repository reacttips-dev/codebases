import { ClientItemId, getUserMailboxInfo } from 'owa-client-ids';
import { lazyPopoutCalendarReadingPane } from 'owa-popout-calendar';

export function displayAppointmentForm(itemId: string) {
    const clientItemId: ClientItemId = {
        Id: itemId,
        mailboxInfo: getUserMailboxInfo(),
    };
    lazyPopoutCalendarReadingPane.importAndExecute(clientItemId, 'Mail_Addins', null /* data */);
}
