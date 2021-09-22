import displayNewMessageForm, { DisplayNewMessageFormArgs } from './displayNewMessageFormApiMethod';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';
import ApiErrorCode from '../ApiErrorCode';

export default async function displayNewMessageFormAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DisplayNewMessageFormArgs,
    callback: ApiMethodCallback
) {
    try {
        await displayNewMessageForm(hostItemIndex, controlId, data, callback);
    } catch (e) {
        callback(
            createErrorResult(
                e.message.search('ErrorInvalidIdMalformed') < 0 ? e : ApiErrorCode.ItemNotFound
            )
        );
    }
}
