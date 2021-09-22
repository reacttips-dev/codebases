import type ItemId from 'owa-service/lib/contract/ItemId';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import updateBirthdayEventOperation from 'owa-service/lib/operation/updateBirthdayEventOperation';
import updateBirthdayEventRequest from 'owa-service/lib/factory/updateBirthdayEventRequest';
import type UpdateBirthdayEventResponseMessage from 'owa-service/lib/contract/UpdateBirthdayEventResponseMessage';
import popupReminderSetting from 'owa-service/lib/factory/popupReminderSetting';
import inboxReminderType from 'owa-service/lib/factory/inboxReminderType';
import type PopupReminderSetting from 'owa-service/lib/contract/PopupReminderSetting';
import type InboxReminderType from 'owa-service/lib/contract/InboxReminderType';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type { MailboxInfo } from 'owa-client-ids';

/**
 * Makes the UpdateBirthdayEvent call to the server
 */
export default async function updateBirthdayEventService(
    itemId: ItemId,
    mailboxInfo: MailboxInfo,
    popupReminderSettingsUpdate?: PopupReminderSetting,
    emailReminderSettingsUpdate?: InboxReminderType[]
): Promise<UpdateBirthdayEventResponseMessage> {
    if (emailReminderSettingsUpdate) {
        emailReminderSettingsUpdate = emailReminderSettingsUpdate.map(u => {
            return inboxReminderType(u);
        });
    }
    const request = updateBirthdayEventRequest({
        PopupReminderSettings: popupReminderSettingsUpdate
            ? [popupReminderSetting(popupReminderSettingsUpdate)]
            : undefined,
        EmailReminderSettings: emailReminderSettingsUpdate,
        Id: itemId,
    });

    const response = await updateBirthdayEventOperation(
        {
            Header: getJsonRequestHeader(),
            Body: request,
        },
        getMailboxRequestOptions(mailboxInfo)
    );

    return response.Body as UpdateBirthdayEventResponseMessage;
}
