import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';

export interface AddFileAttachmentFromBase64Args {
    base64String: string;
    name: string;
    isInline: boolean;
}

export default async function addFileAttachmentFromBase64AsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: AddFileAttachmentFromBase64Args,
    callback: ApiMethodCallback
) {
    const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;
    try {
        const attachmentId = await adapter.addFileAttachmentFromBase64(
            data.base64String,
            data.name,
            data.isInline
        );
        if (!attachmentId) {
            callback(createErrorResult(ApiErrorCode.AttachmentUploadGeneralFailure));
        } else {
            callback(createSuccessResult(attachmentId));
        }
    } catch (err) {
        callback(createErrorResult(err.errorCode));
    }
}
