import ApiErrorCode from '../ApiErrorCode';
import type EwsProxyResponse from 'owa-service/lib/contract/EwsProxyResponse';
import executeEwsProxy from '../../services/executeEwsProxy';
import getTokenForExtension from '../token/getTokenForExtension';
import type Token from 'owa-service/lib/contract/Token';
import type { ApiMethodCallback } from '../ApiMethod';
import { convertProxyResponseIntoAsyncResult, EwsProxyAsyncResult } from './EwsProxyAsyncResult';
import { createErrorResult } from '../ApiMethodResponseCreator';
import { ExtensionCallbackTokenType } from '../../services/getClientAccessToken';
import { getAddinCommandForControl, IAddinCommand } from 'owa-addins-store';

export interface EwsRequestArgs {
    body: string;
}

export const MAX_EWS_REQUEST_SIZE = 1 * 1000 * 1000;

export default async function ewsRequestApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: EwsRequestArgs,
    callback: ApiMethodCallback
): Promise<void> {
    const { body } = data;
    if (!body || body.length > MAX_EWS_REQUEST_SIZE) {
        callback(createErrorResult(ApiErrorCode.GenericResponseError));
        return;
    }

    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
    const token: Token = await getTokenForExtension(addinCommand, ExtensionCallbackTokenType);
    if (!token) {
        callback(createErrorResult(ApiErrorCode.GenericTokenError));
        return;
    }

    try {
        const response: EwsProxyResponse = await executeEwsProxy(
            body,
            token.TokenValue,
            addinCommand.extension.Id
        );
        const convertedResponse: EwsProxyAsyncResult = convertProxyResponseIntoAsyncResult(
            response
        );
        callback(convertedResponse);
    } catch (error) {
        callback(createErrorResult(ApiErrorCode.GenericResponseError));
    }
}
