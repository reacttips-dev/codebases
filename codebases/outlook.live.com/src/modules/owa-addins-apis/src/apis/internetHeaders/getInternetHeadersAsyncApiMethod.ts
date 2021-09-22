import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import {
    isValidInternetHeaderKeysArray,
    GetRemoveInternetHeadersArgs,
} from 'owa-addins-apis-types';

export default async function getInternetHeadersAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: GetRemoveInternetHeadersArgs,
    callback: ApiMethodCallback
) {
    if (!data || !isValidInternetHeaderKeysArray(data.internetHeaderKeys)) {
        callback(createErrorResult());
        return;
    }
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;
    const dictionary = await adapter.getInternetHeaders(data.internetHeaderKeys);
    callback(createSuccessResult(dictionary));
}
