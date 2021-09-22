import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import type { ApiMethodCallback } from '../ApiMethod';
import { getAddinCommandForControl, IAddinCommand } from 'owa-addins-store';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';

export interface RemoveStateApiArgs {
    name: string;
}

export default async function removeSessionDataAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: RemoveStateApiArgs,
    callback: ApiMethodCallback
) {
    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
    const adapter = getAdapter(hostItemIndex);

    if (!addinCommand || !adapter) {
        callback(createErrorResult());
        return;
    }

    try {
        (adapter as MessageComposeAdapter).removeSessionDataState(data.name, addinCommand.get_Id());
        callback(createSuccessResult());
    } catch (e) {
        callback(createErrorResult(e));
    }
}
