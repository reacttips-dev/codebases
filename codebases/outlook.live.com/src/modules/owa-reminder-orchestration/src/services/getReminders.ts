import getRemindersOperation from 'owa-service/lib/operation/getRemindersOperation';
import getRemindersRequest from 'owa-service/lib/factory/getRemindersRequest';
import ReminderTypes from 'owa-service/lib/contract/ReminderTypes';
import type GetRemindersResponse from 'owa-service/lib/contract/GetRemindersResponse';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { addMinutes, getISOString, now } from 'owa-datetime';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import { getUserMailboxInfo } from 'owa-client-ids';
import type RequestOptions from 'owa-service/lib/RequestOptions';

export default async function getReminders(
    userIdentity: string | null,
    minMinsPast: number,
    maxMinsFuture: number
): Promise<GetRemindersResponse> {
    const nowValue = now();

    let options: RequestOptions | undefined;

    if (userIdentity) {
        const mailboxInfo = getUserMailboxInfo(userIdentity);
        options = getMailboxRequestOptions(mailboxInfo);
    }

    const response = await getRemindersOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getRemindersRequest({
                BeginTime: getISOString(addMinutes(nowValue, minMinsPast)),
                EndTime: getISOString(addMinutes(nowValue, maxMinsFuture)),
                ReminderType: ReminderTypes.Current,
            }),
        },
        options ?? undefined
    );

    return response.Body;
}
