import * as AdapterManager from 'owa-addins-adapters';
import ApiErrorCode from '../ApiErrorCode';
import getTokenForExtension from './getTokenForExtension';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';
import { createTokenAsyncResult } from './TokenAsyncResult';
import { getAddinCommandForControl } from 'owa-addins-store';
import { RestTokenType, ScopedTokenType } from '../../services/getClientAccessToken';
import RequestedCapabilities from 'owa-service/lib/contract/RequestedCapabilities';
import type ClientAccessTokenType from 'owa-service/lib/contract/ClientAccessTokenType';

export interface GetCallbackTokenArgs {
    isRest: boolean;
}

export default async function getCallbackTokenApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: GetCallbackTokenArgs,
    callback: ApiMethodCallback
): Promise<void> {
    const addinCommand = getAddinCommandForControl(controlId);
    const scope = await createScopeForItem(hostItemIndex);
    const tokenType = data.isRest ? RestTokenType : ScopedTokenType;

    if (
        !IsRestTokenAndRWMailboxAddin(tokenType, addinCommand.extension.RequestedCapabilities) &&
        !scope
    ) {
        callback(createErrorResult(ApiErrorCode.CallSaveAsyncBeforeToken));
        return;
    }

    const token = await getTokenForExtension(addinCommand, tokenType, scope);

    if (token) {
        callback(createTokenAsyncResult(/* wasSuccessful*/ true, token.TokenValue));
    } else {
        callback(createErrorResult(ApiErrorCode.GenericTokenError));
    }
}

export const ParentItemIdPrefix = 'ParentItemId:';

async function createScopeForItem(hostItemIndex: string) {
    const adapter = AdapterManager.getAdapter(hostItemIndex);
    const itemId = await adapter.getItemId();

    if (!itemId) {
        return undefined;
    }

    return ParentItemIdPrefix + itemId;
}

function IsRestTokenAndRWMailboxAddin(
    tokenType: ClientAccessTokenType,
    requestedCapabilities: RequestedCapabilities
) {
    return (
        tokenType == RestTokenType &&
        requestedCapabilities == RequestedCapabilities.ReadWriteMailbox
    );
}
