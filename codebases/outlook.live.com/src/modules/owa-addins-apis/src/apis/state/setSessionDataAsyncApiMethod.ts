import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import type { ApiMethodCallback } from '../ApiMethod';
import { getAddinCommandForControl, IAddinCommand } from 'owa-addins-store';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';

export interface SetStateApiArgs {
    name: string;
    value: string;
}

export default async function setSessionDataAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: SetStateApiArgs,
    callback: ApiMethodCallback
) {
    const adapter = getAdapter(hostItemIndex);
    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);

    if (!addinCommand || !adapter) {
        callback(createErrorResult());
        return;
    }

    try {
        (adapter as MessageComposeAdapter).setSessionDataState(
            data.name,
            data.value,
            //we used the guid as the unique number for mapping each addin
            addinCommand.get_Id()
        );
        callback(createSuccessResult());
    } catch (e) {
        callback(createErrorResult(e));
    }
}
