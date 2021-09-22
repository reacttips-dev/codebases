import type DisplayReplyFormArgs from './DisplayReplyFormArgs';
import type { ApiMethodCallback } from '../ApiMethod';
import displayReplyAllFormApiMethod from './displayReplyAllFormApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';
import ApiErrorCode from '../ApiErrorCode';

export default async function displayReplyAllFormAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DisplayReplyFormArgs,
    callback: ApiMethodCallback
) {
    try {
        await displayReplyAllFormApiMethod(hostItemIndex, controlId, data, callback);
    } catch (e) {
        callback(
            createErrorResult(
                e.message.search('ErrorInvalidIdMalformed') < 0 ? e : ApiErrorCode.ItemNotFound
            )
        );
    }
}
