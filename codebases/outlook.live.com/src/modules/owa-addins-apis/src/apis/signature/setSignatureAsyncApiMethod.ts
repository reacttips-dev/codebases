import type { ApiMethodCallback } from '../ApiMethod';
import { getAdapter, MessageComposeAdapter, ComposeSignatureAdapter } from 'owa-addins-adapters';
import { createErrorResult } from '../ApiMethodResponseCreator';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { SsoErrorCode } from 'owa-addins-sso';
import type { SetDataArgs } from '../setData/SetDataArgs';
import { CoercionType } from '../../index';
import { ApiErrorCode } from '../ApiErrorCode';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { SetDataAdapterMethod } from '../setData/SetDataAdapterMethod';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';
import setDataAsyncApiMethodBase from '../setData/setDataAsyncApiMethodBase';

const MAX_SIGNATURE_DATA_LENGTH = 120000;

export default async function setSignatureAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    args: SetDataArgs,
    callback: ApiMethodCallback
): Promise<void> {
    if (!isFeatureEnabled('addin-signatureScenario')) {
        callback(createErrorResult(ApiErrorCode.OperationNotSupported));
        return;
    }

    if (args.data.length > MAX_SIGNATURE_DATA_LENGTH) {
        callback(createErrorResult(ApiErrorCode.OoeInvalidDataFormat));
        return;
    }

    const adapter = getAdapter(hostItemIndex);
    if (
        args.coercionType === CoercionType.Html &&
        (adapter as MessageComposeAdapter).getBodyType() === 'Text'
    ) {
        callback(createErrorResult(ApiErrorCode.OoeInvalidDataFormat));
        return;
    }

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    const mode = adapter.mode;
    if (!(mode === ExtensibilityModeEnum.MessageCompose)) {
        callback(createErrorResult(SsoErrorCode.OperationNotSupported));
        return;
    }
    const setSignature: SetDataAdapterMethod = (signature: string) =>
        (adapter as ComposeSignatureAdapter).setSignature(signature);

    await setDataAsyncApiMethodBase(hostItemIndex, controlId, args, callback, setSignature);
}
