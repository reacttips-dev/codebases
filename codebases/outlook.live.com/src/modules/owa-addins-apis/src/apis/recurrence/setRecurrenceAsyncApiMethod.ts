import {
    getAdapter,
    CommonAdapter,
    ComposeTimeAdapter,
    ComposeRecurrenceAdapter,
} from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';
import {
    convertRecurrenceToExchangeFormat,
    isValidRecurrence,
    AddinRecurrence,
} from 'owa-addins-recurrence';
import { isFeatureEnabled } from 'owa-feature-flags';

export interface SetRecurrenceArgs {
    recurrenceData: AddinRecurrence;
}

export default async function setRecurrenceAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: SetRecurrenceArgs,
    callback: ApiMethodCallback
) {
    if (!isValidRecurrence(data.recurrenceData)) {
        callback(createErrorResult(ApiErrorCode.InvalidRecurrence));
        return;
    }
    const adapter = getAdapter(hostItemIndex) as ComposeTimeAdapter &
        ComposeRecurrenceAdapter &
        CommonAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    if ((await adapter.getSeriesId()) != null) {
        callback(createErrorResult(ApiErrorCode.SetRecurrenceOnInstance));
        return;
    }
    const recurrence = convertRecurrenceToExchangeFormat(data.recurrenceData);
    if (recurrence == null) {
        adapter.setRecurrence(null);
    } else {
        if (!isFeatureEnabled('addin-fix-recurrenceTimezone')) {
            // setTimeZoneName must be called before setting start and end time,
            // otherwise they will be converted
            adapter.setTimeZoneName(recurrence.timeZone);
        }
        adapter.setStartTime(recurrence.startTime);
        adapter.setEndTime(recurrence.endTime);

        if (isFeatureEnabled('addin-fix-recurrenceTimezone')) {
            // setTimeZoneName must be called after setting start and end time,
            // so that the timezone is reflected
            adapter.setTimeZoneName(recurrence.timeZone);
        }
        adapter.setRecurrence(recurrence.recurrenceType);
    }
    callback(createSuccessResult());
}
