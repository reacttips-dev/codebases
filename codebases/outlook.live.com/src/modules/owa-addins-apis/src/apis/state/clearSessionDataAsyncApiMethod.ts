import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import type { ApiMethodCallback } from '../ApiMethod';
import { getAddinCommandForControl, IAddinCommand } from 'owa-addins-store';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';

export default async function clearSessionDataAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
) {
    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
    const adapter = getAdapter(hostItemIndex);

    if (!addinCommand || !adapter) {
        callback(createErrorResult());
        return;
    }

    try {
        (adapter as MessageComposeAdapter).clearSessionDataState(addinCommand.get_Id());
        callback(createSuccessResult());
    } catch (e) {
        callback(createErrorResult(e));
    }
}
