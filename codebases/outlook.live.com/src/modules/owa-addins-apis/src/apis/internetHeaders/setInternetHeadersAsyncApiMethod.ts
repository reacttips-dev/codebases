import { internetHeaderDictionaryIsValid, SetInternetHeadersArgs } from 'owa-addins-apis-types';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export default function setInternetHeadersAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: SetInternetHeadersArgs,
    callback: ApiMethodCallback
) {
    if (!data || !internetHeaderDictionaryIsValid(data.internetHeaderNameValuePairs)) {
        callback(createErrorResult());
        return;
    }
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    adapter.setInternetHeaders(data.internetHeaderNameValuePairs);
    callback(createSuccessResult());
}
