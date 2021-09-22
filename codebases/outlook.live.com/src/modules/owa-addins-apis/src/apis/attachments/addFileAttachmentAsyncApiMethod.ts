import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export interface AddFileAttachmentArgs {
    uri: string;
    name: string;
    isInline: boolean;
}

export default async function addFileAttachmentAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: AddFileAttachmentArgs,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;
    try {
        if (returnErrorIfUserCannotEditItem(adapter, callback)) {
            return;
        }

        const attachmentId = await adapter.addFileAttachment(data.name, data.uri, data.isInline);
        if (!attachmentId) {
            callback(createErrorResult(ApiErrorCode.AttachmentUploadGeneralFailure));
        } else {
            callback(createSuccessResult(attachmentId));
        }
    } catch (e) {
        callback(createErrorResult(ApiErrorCode.AttachmentUploadGeneralFailure));
    }
}
