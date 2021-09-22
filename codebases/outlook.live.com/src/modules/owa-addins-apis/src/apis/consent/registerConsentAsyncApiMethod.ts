import ApiErrorCode from '../ApiErrorCode';
import type ConsentStateType from 'owa-service/lib/contract/ConsentStateType';
import registerConsent from '../../services/registerConsent';
import type RegisterConsentJsonResponse from 'owa-service/lib/contract/RegisterConsentJsonResponse';
import type ResponseClass from 'owa-service/lib/contract/ResponseClass';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { getExtensionId, updateConsentState } from 'owa-addins-store';

export interface ConsentArgs {
    consentState: ConsentStateType;
}

export default async function registerConsentAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: ConsentArgs,
    callback: ApiMethodCallback
): Promise<void> {
    const { consentState } = data;
    const id = getExtensionId(controlId);

    if (!id || !consentState) {
        callback(createErrorResult(ApiErrorCode.GenericResponseError));
        return;
    }

    try {
        updateConsentState(hostItemIndex, controlId, consentState);
        const responseMessage: RegisterConsentJsonResponse = await registerConsent(
            id,
            consentState
        );

        if (
            responseMessage.Body.ResponseCode === 'NoError' &&
            responseMessage.Body.ResponseClass === ('Success' as ResponseClass)
        ) {
            callback(createSuccessResult());
            return;
        }

        callback(createErrorResult(ApiErrorCode.GenericResponseError));
    } catch (error) {
        callback(createErrorResult(ApiErrorCode.GenericResponseError));
    }
}
