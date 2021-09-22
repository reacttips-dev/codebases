import performReminderActionOperation from 'owa-service/lib/operation/performReminderActionOperation';
import performReminderActionRequest from 'owa-service/lib/factory/performReminderActionRequest';
import reminderItemAction from 'owa-service/lib/factory/reminderItemAction';
import ReminderActionType from 'owa-service/lib/contract/ReminderActionType';
import type ItemId from 'owa-service/lib/contract/ItemId';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { OwaDate, getEwsRequestString } from 'owa-datetime';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import { getUserMailboxInfo } from 'owa-client-ids';
import type RequestOptions from 'owa-service/lib/RequestOptions';

export default async function snoozeReminder(
    userIdentity: string | null | undefined,
    itemId: ItemId,
    newReminderTime: OwaDate
): Promise<void> {
    let options: RequestOptions | undefined;

    if (userIdentity) {
        const mailboxInfo = getUserMailboxInfo(userIdentity);
        options = getMailboxRequestOptions(mailboxInfo);
    }

    await performReminderActionOperation(
        {
            Header: getJsonRequestHeader(),
            Body: performReminderActionRequest({
                ReminderItemActions: [
                    reminderItemAction({
                        ActionType: ReminderActionType.Snooze,
                        ItemId: itemId,
                        NewReminderTime: getEwsRequestString(newReminderTime),
                    }),
                ],
            }),
        },
        options ?? undefined
    );
}
