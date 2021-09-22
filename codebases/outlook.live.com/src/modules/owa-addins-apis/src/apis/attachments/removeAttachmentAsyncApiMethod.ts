import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export interface RemoveAttachmentArgs {
    attachmentIndex: string;
}

export default async function removeAttachmentAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: RemoveAttachmentArgs,
    callback: ApiMethodCallback
) {
    if (!data || !data.attachmentIndex) {
        callback(createErrorResult(ApiErrorCode.InvalidAttachmentId));
        return;
    }

    try {
        const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;

        if (returnErrorIfUserCannotEditItem(adapter, callback)) {
            return;
        }

        await adapter.removeAttachment(data.attachmentIndex);
        callback(createSuccessResult());
    } catch (err) {
        callback(createErrorResult(err.errorCode));
    }
}
