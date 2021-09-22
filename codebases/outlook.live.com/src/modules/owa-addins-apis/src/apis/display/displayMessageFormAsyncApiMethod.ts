import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';
import displayMessageFormApiMethod, { DisplayMessageFormArgs } from './displayMessageFormApiMethod';
import ApiErrorCode from '../ApiErrorCode';

export default async function displayMessageFormAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DisplayMessageFormArgs,
    callback: ApiMethodCallback
) {
    try {
        await displayMessageFormApiMethod(hostItemIndex, controlId, data, callback);
    } catch (e) {
        callback(
            createErrorResult(
                e.message.search('ErrorInvalidIdMalformed') < 0 ? e : ApiErrorCode.ItemNotFound
            )
        );
    }
}
