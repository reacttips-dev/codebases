import addEventToMyCalendarOperation from 'owa-service/lib/operation/addEventToMyCalendarOperation';
import addEventToMyCalendarRequest from 'owa-service/lib/factory/addEventToMyCalendarRequest';
import type AddEventToMyCalendarResponse from 'owa-service/lib/contract/AddEventToMyCalendarResponse';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import recurringMasterItemId from 'owa-service/lib/factory/recurringMasterItemId';
import type RecurringMasterItemId from 'owa-service/lib/contract/RecurringMasterItemId';
import type { ClientItemId } from 'owa-client-ids';

export default function addCalendarEventToMyCalendar(
    calendarEventId: ClientItemId,
    addSeries: boolean = false
): Promise<AddEventToMyCalendarResponse> {
    let requestBody = addEventToMyCalendarRequest({
        ItemId: addSeries ? createRecurringMasterItemId(calendarEventId) : calendarEventId,
    });
    return addEventToMyCalendarOperation(
        {
            request: requestBody,
        },
        getMailboxRequestOptions(calendarEventId.mailboxInfo)
    );
}

function createRecurringMasterItemId(itemId: ClientItemId): RecurringMasterItemId {
    return recurringMasterItemId({
        ChangeKey: itemId.ChangeKey,
        OccurrenceId: itemId.Id,
    });
}
