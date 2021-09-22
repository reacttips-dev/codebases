import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export default function saveAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    adapter.saveItem().then(itemId => {
        if (!itemId) {
            callback(createErrorResult(ApiErrorCode.SaveError));
            return;
        }
        callback(createSuccessResult(itemId));
    });
}
