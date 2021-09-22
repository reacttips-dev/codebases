import {
    getAdapter,
    Adapter,
    MessageComposeAdapter,
    MessageReadAdapter,
    AppointmentReadAdapter,
    AppointmentComposeAdapter,
} from 'owa-addins-adapters';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { AttachmentContent, AttachmentContentFormat } from 'owa-addins-apis-types';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { assertNever } from 'owa-assert';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import type AttachmentId from 'owa-service/lib/contract/AttachmentId';
import { isAttachmentOfItemType } from 'owa-attachment-type/lib/isAttachmentOfItemType';

export interface GetAttachmentContentArgs {
    id: string;
}

export default async function getAttachmentContentAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: GetAttachmentContentArgs,
    callback: ApiMethodCallback
) {
    if (!data || !data.id) {
        callback(createErrorResult(ApiErrorCode.InvalidAttachmentId));
        return;
    }

    let attachmentContent: AttachmentContent = null;
    const adapter: Adapter = getAdapter(hostItemIndex);
    const mode: ExtensibilityModeEnum = adapter.mode;
    var isMessageReadMode: boolean = false;

    const attachmentModel = getAttachment(<AttachmentId>{ Id: data.id });
    if (isAttachmentOfItemType(attachmentModel.model)) {
        const embeddedItemClass = attachmentModel.model.EmbeddedItemClass;
        if (
            embeddedItemClass &&
            embeddedItemClass !== 'IPM.Note' &&
            embeddedItemClass !== 'IPM.Appointment'
        ) {
            callback(createErrorResult(ApiErrorCode.AttachmentTypeNotSupported));
            return;
        }
    }

    switch (mode) {
        case ExtensibilityModeEnum.MessageRead:
            {
                isMessageReadMode = true;
                attachmentContent = await getAttachmentContentAsyncApiMethodUtil(
                    isMessageReadMode,
                    adapter,
                    data.id
                );
            }
            break;

        case ExtensibilityModeEnum.MessageCompose:
            attachmentContent = await (adapter as MessageComposeAdapter).getAttachmentContent(
                data.id
            );
            break;

        case ExtensibilityModeEnum.AppointmentAttendee:
            {
                isMessageReadMode = false;
                attachmentContent = await getAttachmentContentAsyncApiMethodUtil(
                    isMessageReadMode,
                    adapter,
                    data.id
                );
            }
            break;

        case ExtensibilityModeEnum.AppointmentOrganizer:
            attachmentContent = await (adapter as AppointmentComposeAdapter).getAttachmentContent(
                data.id
            );
            break;

        default:
            assertNever(mode as never);
    }

    if (attachmentContent == null) {
        callback(createErrorResult(ApiErrorCode.InvalidAttachmentId));
        return;
    }

    try {
        callback(createSuccessResult(attachmentContent));
    } catch (err) {
        callback(createErrorResult(ApiErrorCode.InvalidAttachmentId));
    }
}

async function getAttachmentContentAsyncApiMethodUtil(
    isMessageReadMode: boolean,
    adapter: Adapter,
    id: string
): Promise<AttachmentContent> {
    let attachmentContent: AttachmentContent = null;
    let item = await (isMessageReadMode === true
        ? (adapter as MessageReadAdapter).getItem()
        : (adapter as AppointmentReadAdapter).getItem());
    let attachmentFoundInItem: boolean = false;
    if (item.Attachments.length > 0) {
        for (let attachment of item.Attachments) {
            let attachmentOriginalUrl = attachment.AttachmentOriginalUrl;
            let attachmentId = attachment.AttachmentId.Id;
            if (
                attachment.__type === 'ReferenceAttachment:#Exchange' &&
                id === attachmentOriginalUrl
            ) {
                let referenceAttachment: ReferenceAttachment = attachment;
                attachmentContent = {
                    format: AttachmentContentFormat.Url,
                    content: referenceAttachment.AttachLongPathName,
                };
                attachmentFoundInItem = true;
                return attachmentContent;
            } else if (id === attachmentId) {
                isMessageReadMode === true
                    ? (attachmentContent = await (adapter as MessageReadAdapter).getAttachmentContent(
                          id
                      ))
                    : (attachmentContent = await (adapter as AppointmentReadAdapter).getAttachmentContent(
                          id
                      ));
                attachmentFoundInItem = true;
                return attachmentContent;
            }
        }
        if (!attachmentFoundInItem) {
            return attachmentContent;
        }
    }
    return attachmentContent;
}
