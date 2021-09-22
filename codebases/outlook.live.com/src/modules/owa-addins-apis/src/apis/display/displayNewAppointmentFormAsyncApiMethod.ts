import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';
import displayNewAppointmentFormApiMethod, {
    DisplayNewAppointmentFormArgs,
} from './displayNewAppointmentFormApiMethod';
import ApiErrorCode from '../ApiErrorCode';

export default function displayNewAppointmentFormAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DisplayNewAppointmentFormArgs,
    callback: ApiMethodCallback
) {
    try {
        displayNewAppointmentFormApiMethod(hostItemIndex, controlId, data, callback);
    } catch (e) {
        callback(
            createErrorResult(
                e.message.search('ErrorInvalidIdMalformed') < 0 ? e : ApiErrorCode.ItemNotFound
            )
        );
    }
}
