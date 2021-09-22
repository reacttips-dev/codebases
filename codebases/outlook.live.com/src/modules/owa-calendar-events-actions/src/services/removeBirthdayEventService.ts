import removeBirthdayEventOperation from 'owa-service/lib/operation/removeBirthdayEventOperation';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type { MailboxInfo } from 'owa-client-ids';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';

export default async function removeBirthdayEventService(
    deleteCalendarEventId: BaseItemId,
    mailboxInfo: MailboxInfo
): Promise<SingleResponseMessage> {
    const response = await removeBirthdayEventOperation(
        deleteCalendarEventId as ItemId,
        getMailboxRequestOptions(mailboxInfo)
    );

    if (response.WasSuccessful) {
        return {
            ResponseClass: 'Success',
        };
    } else {
        return {
            ResponseClass: 'Error',
        };
    }
}
