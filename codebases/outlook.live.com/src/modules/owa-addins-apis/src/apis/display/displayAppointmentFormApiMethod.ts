import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, CommonAdapter } from 'owa-addins-adapters';

export interface DisplayAppointmentFormArgs {
    itemId: string;
}

export default function displayAppointmentFormApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DisplayAppointmentFormArgs,
    callback: ApiMethodCallback
) {
    if (!data.itemId) {
        callback(createErrorResult());
        return;
    }

    const adapter: CommonAdapter = getAdapter(hostItemIndex) as CommonAdapter;
    adapter.displayAppointmentForm(data.itemId);
    callback(createSuccessResult());
}
