import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import {
    lazyTriggerAttachmentsChangedEvent,
    AttachmentStatusEnum,
    AttachmentDetails,
    getComposeHostItemIndex,
    lazyOnLaunchEventTriggered,
} from 'owa-addins-core';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import { lazyGetTypeOfAttachment } from 'owa-addins-common-utils';
import { isCloudyAttachmentType } from 'owa-attachment-model-store/lib/utils/isCloudyAttachment';
import { isFeatureEnabled } from 'owa-feature-flags';
import LaunchEventType from 'owa-service/lib/contract/LaunchEventType';

export default async function triggerAttachmentsChanged(
    composeId: string,
    attachmentStatus: AttachmentStatusEnum,
    attachment: AttachmentType
) {
    let attachmentDetail: AttachmentDetails = null;

    let url: string = undefined;

    let getTypeOfAttachment = await lazyGetTypeOfAttachment.import();

    // Access store and get AttachmentDetails object for "attachment".
    if (attachmentStatus === AttachmentStatusEnum.Added) {
        // Get attachment details from model.
        const attachmentModel = getAttachment(attachment.AttachmentId);
        if (isCloudyAttachmentType(attachmentModel.model)) {
            url = attachmentModel.model.AttachLongPathName;
        }
        if (attachmentModel?.model) {
            attachmentDetail = {
                id: attachment.AttachmentId.Id,
                name: attachmentModel.model.Name,
                contentType: attachmentModel.model.ContentType,
                size: attachmentModel.model.Size,
                attachmentType: getTypeOfAttachment(attachmentModel.model),
                isInline: attachmentModel.model.IsInline,
                url: url,
            };
        }
    } else if (attachmentStatus === AttachmentStatusEnum.Deleted) {
        // Since attachment is already deleted, details are not present in model.
        // Get attachment details from AttachmentType object received.
        if (isCloudyAttachmentType(attachment)) {
            url = attachment.AttachLongPathName;
        }
        attachmentDetail = {
            id: attachment.AttachmentId.Id,
            name: attachment.Name,
            contentType: attachment.ContentType,
            size: attachment.Size,
            attachmentType: getTypeOfAttachment(attachment),
            isInline: attachment.IsInline,
            url: url,
        };
    }

    let triggerAttachmentsChanged = await lazyTriggerAttachmentsChangedEvent.import();
    triggerAttachmentsChanged(composeId, attachmentStatus, attachmentDetail);

    if (
        isFeatureEnabled('addin-autoRun') &&
        isFeatureEnabled('addin-autoRun-attachmentsChangedEvent')
    ) {
        const hostItemIndex = getComposeHostItemIndex(composeId);
        const attachmentStatusResult: string =
            attachmentStatus === AttachmentStatusEnum.Added
                ? 'added'
                : attachmentStatus === AttachmentStatusEnum.Deleted
                ? 'removed'
                : null;
        lazyOnLaunchEventTriggered.importAndExecute(
            hostItemIndex,
            LaunchEventType.OnMessageAttachmentsChanged,
            {
                type: 'olkAttachmentsChanged',
                attachmentStatus: attachmentStatusResult,
                attachmentDetails: attachmentDetail,
            }
        );
    }
}
