import type { AttachmentFile, AttachmentFileType } from 'owa-attachment-file-types';
import type { AttachmentState } from 'owa-attachment-full-data';
import type { AttachmentWellViewState } from './index';
import type { ClientItemId } from 'owa-client-ids';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ItemId from 'owa-service/lib/contract/ItemId';

export default {
    AttachmentCreationClassicFromLocalFile: {
        name: 'AttachmentCreationClassicFromLocalFile',
        customData: (
            parentItemId: ClientItemId,
            attachment: AttachmentType,
            cancellationId: string,
            backingObject: Blob,
            attachmentState: AttachmentState
        ) => {
            return backingObject ? [backingObject.size] : [0]; // Log 0 if no backing object
        },
    },
    AttachmentCreationFromRecentAttachment: {
        name: 'AttachmentCreationFromRecentAttachment',
        customData: (
            parentItemId: ClientItemId,
            attachment: AttachmentType,
            cancellationId: string,
            backingObject: AttachmentFile,
            attachmentState: AttachmentState,
            isCloudFile: boolean
        ) => {
            return [
                backingObject?.size || 0 /* Log 0 if no backing object */,
                backingObject?.fileType,
            ];
        },
    },
    AttachmentCreationCloudyFromLocalFile: {
        name: 'AttachmentCreationCloudyFromLocalFile',
    },
    AttachmentDeletionAction: {
        name: 'AttachmentDeletionAction',
        customData: (
            attachmentWellViewState: AttachmentWellViewState,
            attachmentState: AttachmentState,
            parentItemId: ItemId,
            attachmentFileType: AttachmentFileType
        ): any => {
            return {
                generatedAttachmentId: attachmentState.attachmentId.Id,
            };
        },
        cosmosOnlyData: (
            attachmentWellViewState: AttachmentWellViewState,
            attachmentState: AttachmentState,
            parentItemId: ItemId,
            attachmentFileType: AttachmentFileType
        ): string =>
            JSON.stringify({
                attachmentId: attachmentState.attachmentId.Id,
                fileType: attachmentFileType,
            }),
        options: { isCore: true },
    },
};
