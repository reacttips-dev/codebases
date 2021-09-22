import { setIsPlaceholderAttachment } from 'owa-attachment-data';
import addAndInitializeAttachments from 'owa-attachment-model-store/lib/actions/addAndInitializeAttachments';
import deleteAttachment from 'owa-attachment-model-store/lib/actions/deleteAttachment';
import refreshDownloadUrl from 'owa-attachment-model-store/lib/actions/refreshDownloadUrl';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import { isCloudyAttachmentType } from 'owa-attachment-model-store/lib/utils/isCloudyAttachment';
import type { ClientAttachmentId } from 'owa-client-ids';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type GetSharingInfoResponse from 'owa-service/lib/contract/GetSharingInfoResponse';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import { action } from 'satcheljs/lib/legacy';
import ActionMessageId from '../schema/ActionMessageId';
import ActionType from '../schema/ActionType';
import type AttachmentState from '../schema/AttachmentState';
import InlineAttachmentStatus from '../schema/InlineAttachmentStatus';
import isInlineAttachmentStateType from '../utils/isInlineAttachmentStateType';
import initializeAttachmentFullViewState from './initialization/initializeAttachmentFullViewState';
import setActionCompletePercent from './setActionCompletePercent';
import setAttachmentShouldShowContextMenu from './setAttachmentShouldShowContextMenu';
import setInlineAttachmentStatus from './setInlineAttachmentStatus';
import setOngoingActionAndActionMessage from './setOngoingActionAndActionMessage';

export default action('updateAttachment')(function updateAttachment(
    attachmentState: AttachmentState,
    attachmentId: ClientAttachmentId,
    attachment: AttachmentType,
    attachmentFromServer: AttachmentType,
    permissionInfo?: GetSharingInfoResponse
) {
    deleteAttachment(attachmentState.attachmentId);

    const newAttachmentId: ClientAttachmentId = {
        ...attachmentFromServer.AttachmentId,
        mailboxInfo: attachmentId.mailboxInfo,
    };
    attachment.AttachmentId = newAttachmentId;
    if (attachmentFromServer.Name) {
        attachment.Name = attachmentFromServer.Name;
    }

    if (attachmentFromServer.Size) {
        attachment.Size = attachmentFromServer.Size;
    }

    if (attachmentFromServer.ContentType) {
        attachment.ContentType = attachmentFromServer.ContentType;
    }

    // When creating an attachment from an attachmentItemId, we need to update the type of the attachment
    // on the client to match the type of attachment that the server sent on the response.
    if (attachmentFromServer.__type) {
        attachment.__type = attachmentFromServer.__type;
    }

    if (attachment.IsInline) {
        attachment.ContentId = attachmentFromServer.ContentId;
    }

    if (isCloudyAttachmentType(attachmentFromServer)) {
        const referenceAttachment = attachment as ReferenceAttachment;
        referenceAttachment.AttachLongPathName = attachmentFromServer.AttachLongPathName;
        referenceAttachment.PermissionType = attachmentFromServer.PermissionType;
        referenceAttachment.ProviderType = attachmentFromServer.ProviderType;
        referenceAttachment.AttachmentThumbnailUrl = attachmentFromServer.AttachmentThumbnailUrl;
        referenceAttachment.AttachmentPreviewUrl = attachmentFromServer.AttachmentPreviewUrl;
    }

    addAndInitializeAttachments(
        [
            {
                attachmentId: newAttachmentId,
                attachment: attachment,
                permissionInfo: permissionInfo,
            },
        ],
        false /* isReadOnly */
    );

    attachmentState.attachmentId = newAttachmentId;

    if (isInlineAttachmentStateType(attachmentState)) {
        setInlineAttachmentStatus(
            attachmentState,
            InlineAttachmentStatus.CreateAttachmentSucceeded
        );
    } else {
        setIsPlaceholderAttachment(attachmentState, false);
        setTimeout(() => {
            setActionCompletePercent(attachmentState, 1.1);
        }, 500);
        setOngoingActionAndActionMessage(attachmentState, ActionType.None, ActionMessageId.None);
        setAttachmentShouldShowContextMenu(attachmentState, false);
        const attachmentModel = getAttachment(newAttachmentId);

        initializeAttachmentFullViewState(
            attachmentState,
            attachmentModel,
            false /* treatLinksAsAttachments */,
            attachmentState.strategy.supportedMenuActions
        );

        if (!attachmentModel.download.url) {
            refreshDownloadUrl(
                newAttachmentId,
                attachmentState.isReadOnly,
                true /* addIsDownloadQueryParam */
            );
        }
    }
});
