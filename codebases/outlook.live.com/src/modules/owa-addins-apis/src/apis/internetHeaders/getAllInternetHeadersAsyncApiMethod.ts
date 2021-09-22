import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult, createErrorResult } from '../ApiMethodResponseCreator';
import { getAdapter, MessageReadAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';

export default async function getAllInternetHeadersAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: null,
    callback: ApiMethodCallback
) {
    const adapter: MessageReadAdapter = getAdapter(hostItemIndex) as MessageReadAdapter;
    const result = await adapter.getAllInternetHeaders();
    callback(
        result == null || undefined
            ? createErrorResult(ApiErrorCode.GenericResponseError)
            : createSuccessResult(result)
    );
}
