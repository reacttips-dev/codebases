import ApiErrorCode from '../ApiErrorCode';
import getTokenForExtension from './getTokenForExtension';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';
import { createTokenAsyncResult } from './TokenAsyncResult';
import { getAddinCommandForControl } from 'owa-addins-store';
import { UserIdentityTokenType } from '../../services/getClientAccessToken';

export default async function getUserIdentityTokenApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
) {
    const addinCommand = getAddinCommandForControl(controlId);
    const token = await getTokenForExtension(addinCommand, UserIdentityTokenType);

    if (token) {
        callback(createTokenAsyncResult(/* wasSuccessful*/ true, token.TokenValue));
    } else {
        callback(createErrorResult(ApiErrorCode.GenericTokenError));
    }
}
