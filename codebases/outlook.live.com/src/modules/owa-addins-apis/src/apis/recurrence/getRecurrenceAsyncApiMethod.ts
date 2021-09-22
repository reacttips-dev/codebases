import type { ApiMethodCallback } from '../ApiMethod';
import { convertRecurrenceToAddinFormat } from 'owa-addins-recurrence';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, RecurrenceAdapter, ComposeTimeAdapter } from 'owa-addins-adapters';

export default async function getRecurrenceAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
) {
    const adapter = getAdapter(hostItemIndex) as RecurrenceAdapter & ComposeTimeAdapter;
    const recurrenceType = await adapter.getRecurrence();
    const recurrence = convertRecurrenceToAddinFormat({
        recurrenceType,
        timeZone: adapter.getTimeZoneName(),
        endTime: adapter.getEndTime(),
        startTime: adapter.getStartTime(),
    });
    callback(createSuccessResult(recurrence));
}
