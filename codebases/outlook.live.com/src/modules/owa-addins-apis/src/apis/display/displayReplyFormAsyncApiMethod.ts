import type DisplayReplyFormArgs from './DisplayReplyFormArgs';
import type { ApiMethodCallback } from '../ApiMethod';
import displayReplyFormApiMethod from './displayReplyFormApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';
import ApiErrorCode from '../ApiErrorCode';

export default async function displayReplyFormAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DisplayReplyFormArgs,
    callback: ApiMethodCallback
) {
    try {
        await displayReplyFormApiMethod(hostItemIndex, controlId, data, callback);
    } catch (e) {
        callback(
            createErrorResult(
                e.message.search('ErrorInvalidIdMalformed') < 0 ? e : ApiErrorCode.ItemNotFound
            )
        );
    }
}
