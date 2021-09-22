import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';
import displayAppointmentFormApiMethod, {
    DisplayAppointmentFormArgs,
} from './displayAppointmentFormApiMethod';
import { getAdapter, CommonAdapter } from 'owa-addins-adapters';
import ApiErrorCode from '../ApiErrorCode';

export default async function displayAppointmentFormAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DisplayAppointmentFormArgs,
    callback: ApiMethodCallback
) {
    try {
        const adapter: CommonAdapter = getAdapter(hostItemIndex) as CommonAdapter;
        //It checks if itemId is valid, else throws itemNotFound error
        await adapter.checkItemId(data.itemId);
        displayAppointmentFormApiMethod(hostItemIndex, controlId, data, callback);
    } catch (e) {
        callback(
            createErrorResult(
                e.message.search('ErrorInvalidIdMalformed') < 0 ? e : ApiErrorCode.ItemNotFound
            )
        );
    }
}
