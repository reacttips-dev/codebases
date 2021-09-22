import { getAdapter, AppointmentComposeAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult, createErrorResult } from '../ApiMethodResponseCreator';
import type { AttachmentDetails } from 'owa-addins-apis-types';
import { ExtensibilityModeEnum } from 'owa-addins-types';

import { ApiErrorCode } from '../ApiErrorCode';

export default async function getAttachmentsAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: null,
    callback: ApiMethodCallback
) {
    const adapter = getAdapter(hostItemIndex);
    let content: AttachmentDetails[] = null;
    let attachments: AttachmentDetails[] = [];

    switch (adapter.mode) {
        case ExtensibilityModeEnum.MessageCompose:
            content = await (adapter as MessageComposeAdapter).getAttachments();
            break;

        case ExtensibilityModeEnum.AppointmentOrganizer:
            content = await (adapter as AppointmentComposeAdapter).getAttachments();
            break;
    }

    if (content == null) {
        callback(createErrorResult(ApiErrorCode.GenericResponseError));
        return;
    }
    attachments = content.map(
        wrapper =>
            <AttachmentDetails>{
                id: wrapper.id,
                name: wrapper.name,
                contentType: wrapper.contentType,
                size: wrapper.size,
                attachmentType: wrapper.attachmentType,
                isInline: wrapper.isInline,
                url: wrapper.url ? wrapper.url : undefined,
            }
    );

    try {
        callback(createSuccessResult(attachments));
    } catch (err) {
        callback(createErrorResult(err.errorCode));
    }
}
