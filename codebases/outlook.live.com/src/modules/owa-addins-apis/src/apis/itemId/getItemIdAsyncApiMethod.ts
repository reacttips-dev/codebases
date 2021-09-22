import { MessageComposeAdapter, getAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';

export default function getItemIdAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: null,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;
    adapter
        .getItemId()
        .then(itemId => {
            if (!itemId) {
                callback(createErrorResult(ApiErrorCode.ItemNotSavedError));
                return;
            }
            callback(createSuccessResult(itemId));
        })
        .catch(() => {
            callback(createErrorResult(ApiErrorCode.InternalServerError));
            return;
        });
}
