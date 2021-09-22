import type { ApiMethodCallback } from '../ApiMethod';
import { getAdapter, ComposeSignatureAdapter } from 'owa-addins-adapters';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import ApiErrorCode from '../ApiErrorCode';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { isFeatureEnabled } from 'owa-feature-flags';

export default async function isClientSignatureEnabledAsyncApiMethod(
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
            let clientSignatureEnabled: boolean;
            clientSignatureEnabled = (adapter as ComposeSignatureAdapter).isClientSignatureEnabled();
            callback(createSuccessResult(clientSignatureEnabled));
        } else {
            callback(createErrorResult(ApiErrorCode.OperationNotSupported));
            return;
        }
    } catch (err) {
        callback(createErrorResult(err.errorCode));
    }
}
