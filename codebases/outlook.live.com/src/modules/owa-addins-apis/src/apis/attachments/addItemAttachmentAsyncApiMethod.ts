import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export interface AddItemAttachmentArgs {
    itemId: string;
    name: string;
    isInline: boolean;
}

export default async function addItemAttachmentAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: AddItemAttachmentArgs,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;
    try {
        if (returnErrorIfUserCannotEditItem(adapter, callback)) {
            return;
        }

        const attachmentId = await adapter.addItemAttachment(data.name, data.itemId, data.isInline);
        if (!attachmentId) {
            callback(createErrorResult(ApiErrorCode.AttachmentUploadGeneralFailure));
        } else {
            callback(createSuccessResult(attachmentId));
        }
    } catch (errorCode) {
        callback(createErrorResult(errorCode));
    }
}
