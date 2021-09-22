import {
    isValidInternetHeaderKeysArray,
    GetRemoveInternetHeadersArgs,
} from 'owa-addins-apis-types';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export default async function removeInternetHeadersAsyncApiMethod(
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

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    await adapter.removeInternetHeaders(data.internetHeaderKeys);
    callback(createSuccessResult());
}
