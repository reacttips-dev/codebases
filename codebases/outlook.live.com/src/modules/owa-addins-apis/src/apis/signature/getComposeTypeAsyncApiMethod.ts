import type { ApiMethodCallback } from '../ApiMethod';
import { getAdapter, ComposeSignatureAdapter } from 'owa-addins-adapters';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { ExtensibilityModeEnum, ComposeTypeResponse } from 'owa-addins-types';
import { isFeatureEnabled } from 'owa-feature-flags';
import ApiErrorCode from '../ApiErrorCode';

export default async function getComposeTypeAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: null,
    callback: ApiMethodCallback
): Promise<void> {
    if (!isFeatureEnabled('addin-signatureScenario')) {
        callback(createErrorResult(ApiErrorCode.OperationNotSupported));
        return;
    }

    const adapter = getAdapter(hostItemIndex);
    const mode = adapter.mode;
    try {
        if (mode === ExtensibilityModeEnum.MessageCompose) {
            let composeType: ComposeTypeResponse;
            composeType = (adapter as ComposeSignatureAdapter).getComposeTypeAndCoercionType();
            callback(createSuccessResult(composeType));
        } else {
            callback(createErrorResult(ApiErrorCode.OperationNotSupported));
            return;
        }
    } catch (err) {
        callback(createErrorResult(err.errorCode));
    }
}
