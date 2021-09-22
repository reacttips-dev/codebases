import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, CommonAdapter } from 'owa-addins-adapters';

export interface DisplayMessageFormArgs {
    itemId: string;
}

export default async function displayMessageFormApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DisplayMessageFormArgs,
    callback: ApiMethodCallback
) {
    const adapter: CommonAdapter = getAdapter(hostItemIndex) as CommonAdapter;
    await adapter.displayMessageForm(data.itemId);
    callback(createSuccessResult());
}
